import { Config, Http } from '@/util';

export default {
    //用户登录
    signLogin(data){
        return Http.post(Config.api.signLogin, data);
    },
    //判断是否登录
    getSignIsLogin(){
        return Http.get(Config.api.signIsLogin, null);
    },
    //登出
    signLogout(data) {
        return Http.get(Config.api.signLogout, data);
    },
    //通过token登录
    loginByToken(data) {
        return Http.post(Config.api.loginByToken, data);
    },
    //修改手机: 发送验证码
    profileSendCaptcha(data){
        return Http.post(Config.api.profileSendCaptcha, data);
    },
    //修改手机号
    profileVerifyCaptcha(data){
        return Http.post(Config.api.profileVerifyCaptcha, data);
    },
    //用户退出
    getSignLogout(data){
        return Http.post(Config.api.signLogout, data);
    },
    //获取用户信息(get)
    profile(data){
        return Http.get(Config.api.profile, data);
    },
    getBrand(data) {
        return Http.get(Config.api.getBrand, data);
    }
}