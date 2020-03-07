import Vue from 'vue';
import VueResource from 'vue-resource';
// import 'babel-polyfill';//解决ie浏览器不支持promise
import App from './App';
import router from './router';
import { DataHandle, Method, Http, Config } from '@/util';
import { MessageBox, Notification, Loading } from 'element-ui';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import './../element-variables.scss';

// 服务器地址
let url = window.location.origin;
let isPro = url.indexOf('apple.pgyscm.com') >= 0;
if(isPro){
  Sentry.init({
    dsn: 'https://3f58bbfce036428b83b8efcce8690589@track-dev.pgyscm.com/2',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
  });
}

//全局品牌
let globalBrand = {};

Vue.use(VueResource);
Vue.config.productionTip = false;

let LoadingInstance; //全局loading

//全局注册方法
Vue.use({
  install(Vue){
    //全局提示
    Vue.prototype.$message = ({title = '提示', message = '成功', type = 'success', })=>{
      if(type === 'error'){
        MessageBox.alert(message, title, {
          type: 'error'
        });
      }else{
        Notification[type]({
          title: title,
          message: message,
          offset: 50
        });
      } 
    }
    //全局loading
    Vue.prototype.$loading = ({ isShow = true, isWhole = true }) =>{
      if(isShow && isWhole){
        LoadingInstance = Loading.service({
          background: 'rgba(255, 255, 255, 0.2)'
        });
      }else{
        LoadingInstance && LoadingInstance.close();
      }
    }
    //全局MessageBox
    Vue.prototype.$messageBox = MessageBox;

    //全局省份
    let province = Method.getLocalStorage('heliosGlobalProvince');
    Vue.prototype.$province = province;
  }
});

DataHandle.initArrayRemove();//初始化数组删除

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
