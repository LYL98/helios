import Vue from 'vue';
import VueResource from 'vue-resource';
// import 'babel-polyfill';//解决ie浏览器不支持promise
import App from './App';
import store from './store';
import router from './router';
import { DataHandle } from '@/util';

Vue.use(VueResource);
Vue.config.productionTip = false;

DataHandle.initArrayRemove();//初始化数组删除

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
