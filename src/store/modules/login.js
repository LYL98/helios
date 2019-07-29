import { Account } from '@/service';
import * as Types from './../mutationTypes';
import md5 from 'md5';

//初始化或重置state
const initState = {
  //输入信息
  loginForm: {
    username: '',
    password: ''
  },
};

// initial state
// shape: [{ id, quantity }]
const state = {
  //登录信息
  loginInfo: {
    username: ''
  },
  ...JSON.parse( JSON.stringify( initState ) )
}

// getters
const getters = {
  loginForm: state => state.loginForm,
}


// actions
const actions = {
  //初始化state
  loginInitState({ commit }){
    commit(Types.LOGIN_INIT_STATE);
  },
}

// mutations
const mutations = {
  //初始化state
  [Types.LOGIN_INIT_STATE](state){
    state = {
      ...state,
      ...JSON.parse( JSON.stringify( initState ) )
    }
  },
  //保存用户名
  [Types.LOGIN_SAVE_USER_NAME](state, username) {
    state.loginForm.username = username;
  },
  //保存密码
  [Types.LOGIN_SAVE_PASSWORD](state, password) {
    state.loginForm.password = password;
  },
  //保存登录信息
  [Types.LOGIN_SAVE_LOGIN_INFO](state, data){
    state.loginInfo = data;
  },
  //删除登录信息
  [Types.LOGIN_DELETE_LOGIN_INFO](state){
    state.loginInfo = {
      username: ''
    };
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}