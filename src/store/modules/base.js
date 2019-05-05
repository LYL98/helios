import * as Types from './../mutationTypes';
import { Method } from '@/util';

let globalAuth = Method.getSessionStorage('appleGlobalAuth');
let globalProvince = Method.getLocalStorage('appleGlobalProvince');

// initial state
// shape: [{ id, quantity }]
const state = {
  loading: {
    isShow: false,
    message: '请稍等...'
  },
  message: {
    title:'提示',
    message:'提示内容',
    type: 'success'
  },
  windowHeight: 300,
  globalAuth: globalAuth || {},//全局权限
  globalProvince: globalProvince || {}, //全局省份
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  //loading
  [Types.BASE_LOADING](state, { isShow, isWhole, message }) {
    state.loading = {
      isShow: isShow,
      isWhole: isWhole,
      message: message || '请稍等...'
    };
  },
  //message
  [Types.BASE_MESSAGE](state, { title, message, type}) {
    state.message = {
      title: title || '提示',
      message: message || '提示内容',
      type: type || 'success'
    };
  },
  //window窗口高度
  [Types.BASE_WINDOW_INNER_HEIGHT](state, data){
    state.windowHeight = data;
  },
  //全局权限
  [Types.BASE_GLOBAL_AUTH](state, data){
    state.globalAuth = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
