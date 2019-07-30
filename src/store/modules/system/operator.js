import { System } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: {
    items: []
  },
  isShowResetPwd: false,
  detail: {},
  isShowAddEdit: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  systemOperatorListDataItem: state => state.dataItem,
  systemOperatorIsShowResetPwd: state => state.isShowResetPwd,
  systemOperatorItem: state => state.operatorItem,
  systemOperatorIsShowAddEdit: state => state.isShowAddEdit,
  systemOperatorDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏密码重置
  systemOperatorShowHideResetPwd({commit}, {isShow, data}){
    commit(Types.SYSTEM_OPERATOR_IS_SHOW_RESET_PWD, isShow);
    if(data) commit(Types.SYSTEM_OPERATOR_DETAIL, data);
  },
  //重置密码
  async systemOperatorResetPwd({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = System.operatorPwdReset(data);
    this.$loading({isShow: false});
    if(!res.code){
      typeof callback === 'function' && callback(res.data);
      this.$message({title: '提示', message: '密码重置成功', type: 'success'});
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //显示隐藏运营人员新增修改
  systemOperatorShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.SYSTEM_OPERATOR_IS_SHOW_ADD_EDIT, isShow);
    if(data && data.id){
      dispatch('systemOperatorDetail', {data: {id: data.id}});
    }else{
      commit(Types.SYSTEM_OPERATOR_DETAIL, { data_level: '1', post: '' });
    }
  },
  //获取运营人员列表
  async systemOperatorList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.operatorList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.SYSTEM_OPERATOR_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取运营人员详情
  async systemOperatorDetail({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.operatorDetail(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.SYSTEM_OPERATOR_DETAIL, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //冻结运营人员
  async systemOperatorFreeze({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.operatorFreeze(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '已冻结', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //解冻运营人员
  async systemOperatorUnFreeze({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.operatorUnFreeze(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '已解冻', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改运营人员
  async systemOperatorAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System[data.id?'operatorEdit':'operatorAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `运营人员${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.SYSTEM_OPERATOR_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //运营人员列表数据
  [Types.SYSTEM_OPERATOR_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //显示隐藏密码重置
  [Types.SYSTEM_OPERATOR_IS_SHOW_RESET_PWD](state, data){
    state.isShowResetPwd = data;
  },
  //运营人员详情
  [Types.SYSTEM_OPERATOR_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏运营人员新增修改
  [Types.SYSTEM_OPERATOR_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
