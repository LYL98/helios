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
    width: 900px;
    height: 380px;
    position: absolute;
    top: 50%;
    margin-top: -190px;
    left: 50%;
    margin-left: -450px;
    border-radius: 12px;

    background: url("data:image/png;base64,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") no-repeat 30px center;
    background-size: contain;
    background-color: #FFF;
  }

  .body .form-container {
    display: block;
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
