<template>
  <div class="page-login">
    <a class="logo cursor-pointer"></a>
    <div class="body">
      <div class="form-container">
        <div :class="`bg-${type}`" @click="toggleLoginType" v-if="step === 0"></div>
        <h3 class="login-title">{{ step === 0 ? (type === 'qrcode' ? '微信扫码登录' : '蒲公英运营中心') : (type === 'qrcode' ? '关联已有账号' : '微信授权') }}</h3>
        <div class="qrcode-container" v-if="type==='qrcode' && step === 0 || type === 'password' && step === 1">
          <iframe
            frameborder="0"
            scrolling="no"
            :src="qrconnect_url"
          >
          </iframe>
          <div class="tips mt-30">
            请使用微信扫一扫{{ type==='qrcode' && step === 0 ? '登录' : '授权' }}
            <a class="ml-5" @click="signQrconnectUrl">刷新</a>
            &nbsp;<i :class="`iconfont${refreshing ? ' spinner' : ''}`">&#xe653;</i>
          </div>
        </div>
        <el-form v-if="(type==='password' && step === 0) || (type === 'qrcode' && step === 1)" :model="loginData" :rules="rules" ref="ruleForm">
          <el-form-item class="mt-40 custom-form-item" prop="login_name">
            <el-input
              ref="login-name"
              placeholder="请输入用户名"
              v-model="loginData.login_name"
              class="custom-loign-input"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" class="iconfont" style="font-size: 20px">&#xe656;</i>
            </el-input>
          </el-form-item>
          <el-form-item class="mt-40 custom-form-item" prop="password">
            <el-input
              type="password"
              ref="login-password"
              placeholder="请输入密码"
              v-model="loginData.password"
              class="custom-loign-input"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" class="iconfont" style="font-size: 20px">&#xe655;</i>
            </el-input>
          </el-form-item>
          <el-form-item class="mt-40">
            <el-button type="primary" class="w-100" @click="handleLogin" id="btn-submit" :disabled="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, Checkbox } from 'element-ui';
import { Config, Http, Method } from '@/util';
import md5 from 'md5';

export default {
  name: 'login',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-checkbox': Checkbox
  },
  created() {
    documentTitle('登录');
    this.$data.type === 'qrcode' && this.signQrconnectUrl();
  },
  beforeDestroy() {
    this.interval && clearInterval(this.interval);
  },
  data() {
    return {

      type: 'qrcode', //  qrcode | password
      step: 0,

      isDev: Config.isDev,
      refreshing: false, // 刷新二维码
      loading: false, // 提交loading

      login_key: '',
      qrconnect_url: '',

      loginData: {
        login_name: '',
        password: '',
      },

      wechatInfo: {
        snsapi_openid: '',
        wechat_unionid: '',
      },
      rules: {
        login_name: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ]
      }
    }
  },

  methods: {

    /**
     * 账号密码 + 扫码:
     *  /m/sign/login 返回的login_key、qrconnect_url
     *  轮询: /sign/login/confirm 参数login_key
     *
     * 直接扫码:
     *  /m/sign/qrconnect/url
     *  轮询: /sign/login/confirm 参数login_key
     *
     * 登陆失败账号绑定:
     *  /sign/wechat/bind  参数: login_name、password、snsapi_openid、wechat_unionid
     */
    intervalConfirm() {
      this.interval = setInterval(() => {
        Http.post(Config.api.signLoginConfirm, { login_key: this.$data.login_key }, { throttle: false })
          .then(res => {
            if (res.code == 2) { // 表示需要绑定微信
              this.interval && clearInterval(this.interval);
              this.$data.wechatInfo = res.data;
              this.$data.step = 1;
              return;
            }

            if (res.code === 0) { // 表示绑定成功 或者 登录成功
              this.interval && clearInterval(this.interval);
              this.$router.replace({ name: "Home" });
              return;
            }

          });
      }, 2000);
    },

    toggleLoginType() {
      this.interval && clearInterval(this.interval);
      if (this.$data.type === 'qrcode') {
        this.$data.type = 'password';
      } else if (this.$data.type === 'password') {
        this.$data.type = 'qrcode';
        this.signQrconnectUrl();
      }
      this.$data.step = 0;
    },

    // 如果是切换到了 qrcode 登录，则自动刷新URL
    async signQrconnectUrl() {
      this.interval && clearInterval(this.interval); // 请求二维码时，首先重置计时器。
      if (this.$data.refreshing) return;

      this.$data.refreshing = true;
      let res = await Http.get(Config.api.signQrconnectUrl);
      this.$data.refreshing = false;

      if (res.code !== 0) return;
      this.intervalConfirm(); // 二维码请求成功后，开始计时器
      this.$data.login_key = res.data.login_key;
      this.$data.qrconnect_url = res.data.qrconnect_url;
    },

    handleLogin() {
      this.$refs['ruleForm'].validate(async (valid, vs) => {

        if (!valid) {
          if (vs.login_name) {
            this.$refs['login-name'] && this.$refs['login-name'].focus();
          } else if(vs.password) {
            this.$refs['login-password'] && this.$refs['login-password'].focus();
          }
          return;
        }

        // 用户输入合法校验通过。
        if (this.$data.type === 'qrcode' && this.$data.step === 1) { // 表示当前是绑定微信操作
          let formData = { ...this.$data.loginData, ...this.$data.wechatInfo };
          formData.password = md5(formData.password);

          this.$data.loading = true;
          let res = await Http.post(Config.api.signWechatBind, formData);
          this.$data.loading = false;

          if (res.code === 0) {
            this.$router.replace({ name: "Home" });
          } else {
            this.$message({message: res.message, type: 'error'});
          }
        }

        if (this.$data.type === 'password' && this.$data.step === 0) { // 表示当前是用户输入用户名和密码登录
          let formData = { ...this.$data.loginData };
          formData.password = md5(formData.password);

          this.$data.loading = true;
          let res = await Http.post(Config.api.signLogin, formData, {throttle: false});
          this.$data.loading = false;

          if (res.code === 0) {
            this.$data.login_key = res.data.login_key;
            this.$data.qrconnect_url = res.data.qrconnect_url;
            this.$data.step = 1;
            this.intervalConfirm();

            // //如果是测试开发环境
            this.$data.isDev && Method.setLocalStorage('loginData', formData);
          }else{
            this.$message({message: res.message, type: 'error'});
          }
        }

      });
    },

    //提交登录
    submitLogin() {
      this.$refs['ruleForm'].validate((valid, vs) => {
        if (valid) {
          (async ()=>{
            let { loginData, loading, isDev } = this;
            let isSuccess = false, si = null;
            //防止错误时回车穿透
            let dom = document.getElementById('btn-submit');
            dom.focus();

            if(loading) return;

            this.$data.loading = true;
            let res = await Http.post(Config.api.signLogin, {
              login_name: loginData.login_name,
              password: md5(loginData.password)
            }, {throttle: false});

            this.$data.loading = false;
            if(res.code === 0){
              this.$router.replace({ name: "Home" });
              isSuccess = true;
              //如果是测试开发环境
              if(isDev){
                Method.setLocalStorage('loginData', {
                  login_name: loginData.login_name,
                  password: md5(loginData.password)
                });
              }
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }else{
          if(vs.login_name){
            this.$refs['login-name'] && this.$refs['login-name'].focus();
          }else if(vs.password){
            this.$refs['login-password'] && this.$refs['login-password'].focus();
          }
        }
      });

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .page-login {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    overflow: hidden;
    background: url("./../assets/img/login_bg.jpg") no-repeat center;
    background-size: cover;
  }

  .page-login .logo {
    display: inline-block;
    width: 175px;
    height: 68px;
    background: url("./../assets/img/logo_default.png") no-repeat center center;
    background-size: cover;

    position: absolute;
    top: 40px;
    left: 60px;
  }

  .page-login .body {
    width: 1000px;
    height: 380px;
    position: absolute;
    top: 50%;
    margin-top: -220px;
    left: 50%;
    margin-left: -500px;
  }

  .body .form-container {
    margin-left: auto;
    width: 380px;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.08);
    border-radius: 12px;
    border-radius: 12px;
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .body .form-container .login-title {
    font-weight: 600;
    font-size: 30px;
    line-height: 42px;
    color: #242424;
    user-select: none;
  }

  .body .form-container .bg-password,
  .body .form-container .bg-qrcode {
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    height: 80px;
    background-size: cover;
    cursor: pointer;
  }

  .body .form-container .bg-password {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAPFBMVEUAAAD////d3d2ZmZn////////////////////////d3d2ZmZn09PSjo6PJycnh4eG9vb329va3t7ehoaFhNwwiAAAACXRSTlMAgICAkvPVK73BDujrAAABD0lEQVRYw9XWTU7DQBBE4RfsBMzYJsD978qyhGbRifptUgf4NH+aLi6bk+ttfQcgYj+rLn68wBr1c1yRxRuyeMUWsUVsEVvEFrFF/mcZz+W47xPYE8fvPoGdXe8/4z6BPXEcFcjb56P5+t62MSawI84gPbEAI1pgRAuMaIERLTCiBUa0wIgWGNECI1pgRAuMaIERLTCiBUa0wIgWGNECI1pgRAuMaIERLTCiCUasx2hDrAZ9ncsjVaQh1mWpzlLXuYZYF846ddvDFrFFbBFbxBaxRQRRAPPCj9MBI47TAPObndNv0xFtkMXacsTiUozXgy1ii9gitogtYovYIraILWKL2CK2iC1ii9gitogt/gFNhHSCpdN/wQAAAABJRU5ErkJggg==") no-repeat center center;
    transition: all .3s ease-in-out;

    &:hover {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAANlBMVEUAAAD///8Aref///////////////////////////8ArecXturj9v131PNZyvAct+q26PlJxe5RQKRzAAAACXRSTlMAgICS89UrBr0xa+FRAAABCklEQVRYw63WXQ6CMBBF4aP4R0HB/W/WxxvBpJE5dwFfettJOpxGJ5frcAMgYj3D3RYfujhgi/o9DsjiFVm8YIvYIraILWKL2CLfObf/Mr3mLXhQDDnvwErr+d1eG7AqtmkHHm+9rOPY2gasiT/AmtgBI1pgRAuMaIERLTCiBUa0wIgWGNECI1pgRAuMaIERLTCiBUa0wIgWGNECI1pgRAuMaIERLTCiCUbsf6MVcVlrIKcDq0hf7C9Lldb9da4v9hfOSut9sEVsEVvEFrFFbBFBFMBM+PR0wIjtKYE5owZytsCIVuWInUcxpgdbxBaxRWwRW8QWsUVsEVvEFrFFbBFbxBaxRWwRW/wA4GVzfKb+HQAAAAAASUVORK5CYII=");
    }

    &::after {
      display: inline-block;
      content: '账号登录';
      text-align: center;
      font-size: 12px;
      color: #BBBBBB;
      width: 68px;
      height: 20px;
      line-height: 20px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAUBAMAAADGs4Z2AAAAGFBMVEUAAADu7u7u7u7x8fHx8fHw8PDu7u7u7u5/e4H9AAAAB3RSTlMA4/BJNzC3wPsnVwAAAD5JREFUKM9jMCzHC4QZGBjE8SspBCopJwDopiSAsBIVwkqKHAgqKVclrKSMKkpUiXIu5Z4OoGM0Ek5SRCRMABHZLM7/8+8oAAAAAElFTkSuQmCC") no-repeat center center;
      background-size: cover;

      position: absolute;
      top: 13px;
      right: 80px;
    }
  }

  .body .form-container .bg-qrcode {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAQlBMVEUAAAD///+ZmZn////r6+vX19f////////////////////Dw8P///+ZmZnX19fr6+vCwsL5+fn09PSioqK9vb3v7++CBWtlAAAADHRSTlMAgICSgIDz1SsGvYBMRb1uAAABMElEQVRYw63WOW7DMABE0dFmZxMZyc79r5qAKmTgIwU18zsCxCuIKajhK9PtPr2pdYp203ta/IiLk9Ji/B0nhcW7wuJNaVFpUWlRaVFpURCjoMb1v0q7Xo9DbYeyro/nDhBiD/hH7gAhdoHrEyDEPvABEGIfuAKkmAa1lNdewa20tg6QezzBs15QgwtSdEGKLkgxDWreCW61tV0C9Qmwb4dscEGKLkjRBSm6IEUXpJgGNbogRRek6IIUXZCiC1IsBOt36xqoBSDqAzW4IEUXpOiCFF2QYhrUbO6QjS5I0QUpuiBFF6SYBrUcP4ef0jJA/nuY0qLSotKi0qKuN9ejGKjR3yFFgqZI0BQJuiJAWwRoi1GQC1daVFpUWlRaVFpUWlRaVFpUWlRaVFpUWlRa/AWmD5hBMXr7vwAAAABJRU5ErkJggg==") no-repeat center center;
    transition: all .3s ease-in-out;

    &:hover {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAA85JREFUeAHt28tr1EAcB/BJX7KFWqV7sCBqj4L4qteC9OZV/wVpPXvw2vTqwWutePfUf0Cw+AdYvfg4KirsZVFLiwu1dv19F2adzSbZTDaPefwGQmYmM5PNhwmTmWSDbrcbCiE2aOMQL3BI2V9pe0nb8yAIPqjFAiQYUSVJjZ/Q0S3aHhLkEUr2ABFhRChkDrtU8g4QJ2QVSoQU35Rp3qcKrNLRJyjR74GyOPdEKTFyj9v5ar8HyuLcE6XEyD3s7g/1QFmNe6KUSN1/TARENUZMxcPBw1RAlGBEKCSHkYCoyohjAjJiAYCMGI+Y6RZWq/LtrGrEPEgPHo5PMeJ/F+0e2K+60wopXvoqzvbNebF2qdE/rYzs/ToWt3bbMjmwf7PaFMtnpgbykHj2pSPW3+738hcbk+J2c0Y8vjInzjeG5hNDdZMy8te8txhSo5tJDZue3+r8FS++dcS1V23xvYNZWb6QHxDnsxwRl/Dj6EQ8en+AaK4wHiBO6QDi63Zvaa8mQAcQcTvnDeP3QHlmB3qivBSd/fBQpVM7WpYQtz93KLerPTrL0THaZFL64uykwAgdF3CsqlAsIP3q9aVGSM+J+P1aiLqAzZkg9vGmKjh5nuJuYdki7X1alC0FEJa+IJYG6AtiqYA+IBY+iAAtGnA77/38I5qnJjYujDHvVNv9TY9unw6O1ax+/PLclKhqIK4EEFe2fHY6fPBuX2xdP601OvdVIhHg6S4mRJooJFn6Laz+yqc35kNKW7sAoV6LjFcKiJO6NjpXDugaYi2ALiHWBugKYq2ALiDWDmg7ohGAQLR1ZdscQEsRzQK0ENE8QMsQK5sLw0Ur4B3LTgtVCpk7oyEsMqwtzSJaWDAXEJcIxN47lmIQVxamBbYig5m3sHKFeMdCSWMXIIwHhKXJCxBWAJqMaA2gqYhWAZqIaPYoDLGYIN+x0CGtRxz1+8Bos92756JZmdLW9UB5VXjHQvHaR2drAXuQBnzQZDcgFGtGtB+wZkQ3AGtEtHIUhldsoNsZ3yfS94Gxo/PKwkziN4Wx7fmaif+x0FZJcNaY9CpBdBYQF1YFotOAVSA6D1g2YuCFIF0kfZ8YdlPmznH/rcti4w1gDyPlD5LeLSZk6R1DZUqY9rkzExnSSsgoGNE/QLgWiOgnYIGI/gIWiIim/A40OuedOPsNp1x93mmf0gRH8yCyWkRAFzFSnZMQ0EFksQSBrIgJ1TkbAlkQWWqEwCjEEdX5MATSEFkoo0ASYsbqXAwCcYgsoykQRdSszsUhoCKySE4BiZizOleDABD/AfOzmFyDEMRqAAAAAElFTkSuQmCC");
    }

    &::after {
      display: inline-block;
      content: '扫码登录';
      text-align: center;
      font-size: 12px;
      color: #BBBBBB;
      width: 68px;
      height: 20px;
      line-height: 20px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAUBAMAAADGs4Z2AAAAGFBMVEUAAADu7u7u7u7x8fHx8fHw8PDu7u7u7u5/e4H9AAAAB3RSTlMA4/BJNzC3wPsnVwAAAD5JREFUKM9jMCzHC4QZGBjE8SspBCopJwDopiSAsBIVwkqKHAgqKVclrKSMKkpUiXIu5Z4OoGM0Ek5SRCRMABHZLM7/8+8oAAAAAElFTkSuQmCC") no-repeat center center;
      background-size: cover;

      position: absolute;
      top: 13px;
      right: 80px;
    }
  }

  .body .qrcode-container {
    text-align: center;
    margin-top: 28px;
    width: 300px;
    height: 330px;
    overflow: hidden;
    text-align: center;
    position: relative;

    iframe {
      width: 100%;
      height: 100%;
      transform: scale(.7);
      margin-top: -82px;
    }
  }

  /*.body .qrcode-container .qrcode {*/
  /*  display: block;*/
  /*  width: 200px;*/
  /*  height: 200px;*/
  /*  background: #DDD;*/
  /*  margin: 0 auto;*/
  /*  overflow: hidden;*/
  /*  text-align: center;*/

  /*  */
  /*}*/

  .body .qrcode-container .tips {
    position: absolute;
    top: 190px;
    width: 100%;
    font-size: 14px;
    color: #666666;

    a {
      user-select: none;
      color: #666666;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .mt-40 {
    margin-top: 40px;
  }

  .w-100 {
    width: 100%;
  }

  .ml-5 {
    margin-left: 5px;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .spinner {
    display: inline-block;
    user-select: none;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<style lang="scss">
  .page-login {

    .custom-loign-input .el-input__inner {
      border-radius: 0;
      border-left: none;
      border-top: none;
      border-right: none;
    }

    .custom-form-item .el-form-item__error {
      padding-left: 30px;
    }

  }
</style>
