import Vue from 'vue';
import NumberKey from './NumberKey';
let NumberKeyConstructor = Vue.extend(NumberKey);
let instance;

export default {
  //显示
  show(data){
    if(!instance){
      instance = new NumberKeyConstructor({
        el: document.createElement('div')
      });
      document.body.appendChild(instance.$el);
    }

    instance.show(data);
  }
};
