import { Config, Request } from '@/util';

export default {
    //用户登录
    signLogin(data){
        return Request.requestPost(Config.api.signLogin, data);
    },
    //判断是否登录
    getSignIsLogin(){
        return Request.requestGet(Config.api.signIsLogin, null);
    },
    //登出
    signLogout(data) {
        return Request.requestGet(Config.api.signLogout, data);
    },
    //通过token登录
    loginByToken(data) {
        return Request.requestPost(Config.api.loginByToken, data);
    },
    //修改手机: 发送验证码
    profileSendCaptcha(data){
        return Request.requestPost(Config.api.profileSendCaptcha, data);
    },
    //修改手机号
    profileVerifyCaptcha(data){
        return Request.requestPost(Config.api.profileVerifyCaptcha, data);
    },
    //用户退出
    getSignLogout(data){
        return Request.requestPost(Config.api.signLogout, data);
    },
    //获取用户信息(get)
    profile(data){
        return Request.requestGet(Config.api.profile, data);
    },
    getBrand(data) {
        return Request.requestGet(Config.api.getBrand, data);
    }
}