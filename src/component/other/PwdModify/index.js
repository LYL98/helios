import Vue from 'vue';
import PwdModify from './PwdModify';
let PwdModifyConstructor = Vue.extend(PwdModify);
let instance;

export default {
  //显示
  show(data){
    if(!instance){
      instance = new PwdModifyConstructor({
        el: document.createElement('div')
      });
      document.body.appendChild(instance.$el);
    }

    instance.show(data);
  }
};

