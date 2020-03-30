<template>
  <div class="page-login">
    <a class="logo"></a>
    <div class="body">
      <div class="form-container">
        <div :class="`bg-${type}`" @click="toggleLoginType"></div>
        <h3 class="login-title">蒲公英运营中心</h3>
        <el-form v-if="type==='password'" :model="loginData" :rules="rules" ref="ruleForm">
          <el-form-item class="mt-40 custom-form-item" prop="login_name">
            <el-input
              ref="login-name"
              placeholder="请输入用户名"
              v-model="loginData.login_name"
              class="custom-loign-input"
              @keyup.enter.native="submitLogin"
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
              @keyup.enter.native="submitLogin"
            >
              <i slot="prefix" class="iconfont" style="font-size: 20px">&#xe655;</i>
            </el-input>
          </el-form-item>
          <el-form-item class="mt-40">
            <el-button type="primary" class="w-100" @click="submitLogin" id="btn-submit" :disabled="loading">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="qrcode-container" v-if="type==='qrcode'">
          <div class="qrcode"></div>
          <div class="tips mt-30">请使用微信扫一扫授权绑定 <a>刷新</a> <i class="iconfont">&#xe653;</i></div>
        </div>
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
  },
  data(){
    return {

      type: 'password', // password | qrcode

      isDev: Config.isDev,
      loading: false,
      loginData: {
        login_name: '',
        password: '',
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

    toggleLoginType() {
      return;
      if (this.$data.type === 'qrcode') {
        this.$data.type = 'password';
      } else if (this.$data.type === 'password') {
        this.$data.type = 'qrcode';
      }
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
    margin-top: 48px;
  }

  .body .qrcode-container .qrcode {
    display: block;
    width: 160px;
    height: 160px;
    background: #DDD;
    margin: 0 auto;
  }

  .body .qrcode-container .tips {
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
