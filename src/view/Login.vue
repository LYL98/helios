<template>
  <div class="login-body b-b-b">
    <div class="login-div">
      <div class="login-logo">
        <img src="@/assets/img/logo.png" alt="蒲公英" />
        <span style="margin-left:10px">蒲公英运营中心</span>
      </div>
      <div class="login-form">
        <el-form label-position="right" :model="loginData" :rules="rules" ref="ruleForm">
          <el-form-item label="" prop="login_name">
            <el-input placeholder="请输入用户名" v-model="loginData.login_name" id="txt-login-name" @keyup.enter.native="submitLogin">
              <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入密码" v-model="loginData.password" id="txt-password" type="password" @keyup.enter.native="submitLogin">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" @click.native="submitLogin" id="btn-submit" class="btn-submit" :loading="loading.isShow">登录</el-button>
      </div>
    </div>
    <div class="foot-div"></div>
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
    return{
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
            });
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
            this.$data.loading = false;
          })();
        }else{
          if(vs.login_name){
            document.getElementById('txt-login-name').focus();
          }else if(vs.password){
            document.getElementById('txt-password').focus();
          }
        }
      });
      
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login-body{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('./../assets/img/login_bg.jpg');
  }
  .login-div {
    position: absolute;
    width: 450px;
    height: 300px;
    background: #fff;
    top: 50%;
    left: 50%;
    margin: -180px 0 0 -225px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
  .login-logo {
    height: 110px;
    margin-left: 50px;
    overflow: hidden;
  }
  .login-logo > img{
    height: 68px;
    float: left;
    margin: 25px 0 0 0;
  }
  .login-logo > span{
    float: left;
    font-size: 24px;
    margin-top: 46px;
    color: #32958b;
    font-weight:bold;
  }
  .login-form {
    margin: 0 50px;
  }
  .auto-login{
    margin-top: 10px;
  }
  .btn-submit {
    float: right;
    width: 120px;
  }
  .foot-div{
    position: absolute;
    bottom: 0px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    width: 100%;
    color: #666;
    font-size: 12px;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
  
</style>
