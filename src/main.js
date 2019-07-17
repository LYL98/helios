import Vue from 'vue';
import VueResource from 'vue-resource';
// import 'babel-polyfill';//解决ie浏览器不支持promise
import App from './App';
import store from './store';
import router from './router';
import { DataHandle } from '@/util';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

// 服务器地址
let url = window.location.origin;
let isPro = url.indexOf('apple.pgyscm.com') >= 0;
if(!isPro){
  Sentry.init({
    dsn: 'http://3f58bbfce036428b83b8efcce8690589@track-dev.pgyscm.com/2',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
  });
}

Vue.use(VueResource);
Vue.config.productionTip = false;

DataHandle.initArrayRemove();//初始化数组删除

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
