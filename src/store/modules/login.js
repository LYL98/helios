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
  globalBrand:{}
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
  globalBrand: state => state.globalBrand,
}


// actions
const actions = {
  //初始化state
  loginInitState({ commit }){
    commit(Types.LOGIN_INIT_STATE);
  },
  //登录
  async loginSubmit({ commit, dispatch }, {data, callback}){
    dispatch('loading', {isShow: true});
    let res = await Account.signLogin(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '登录成功', type: 'success'});
      let rd = res.data;
      commit(Types.LOGIN_SAVE_LOGIN_INFO, rd);
      typeof callback === 'function' && callback(rd);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //输入用户名
  loginTxtUserName({ commit }, username){
    commit(Types.LOGIN_SAVE_USER_NAME, username);
  },
  //输入密码
  loginTxtPassword({ commit }, password){
    commit(Types.LOGIN_SAVE_PASSWORD, password);
  },
  //判断是否登录
  async loginIsLogin({ commit }, callback){
    let res = await Account.getSignIsLogin();
    if(res.code === 0){
      let rd = res.data;
      commit(Types.LOGIN_SAVE_LOGIN_INFO, rd);
      typeof callback === 'function' && callback(rd, 'success');
    }else{
      typeof callback === 'function' && callback({}, 'fail');
    }
  },
  //登出
  async loginLoginOut({ commit, dispatch }, callback){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Account.signLogout();
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.LOGIN_DELETE_LOGIN_INFO, res.data);
      typeof callback === 'function' && callback();
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //通过token登录
  async loginLoginByToken({ commit, dispatch }, callback){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Account.loginByToken();
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.LOGIN_SAVE_LOGIN_INFO, res.data);
      typeof callback === 'function' && callback();
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  async getBrand({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Account.getBrand(data);
    dispatch('loading', {isShow: false});
    if (res.code === 0) {
      commit(Types.LOGIN_BRAND, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
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
  [Types.LOGIN_BRAND](state, data){
    state.globalBrand = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}