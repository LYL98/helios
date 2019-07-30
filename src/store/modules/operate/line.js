import { Operate } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: {
    items: [],
    distributor_ids: []
  },
  detail: {},
  isShowAddEdit: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  operateLineListDataItem: state => state.dataItem,
  operateLineIsShowAddEdit: state => state.isShowAddEdit,
  operateLineDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏线路新增修改
  operateLineShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.OPERATE_LINE_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.OPERATE_LINE_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.OPERATE_LINE_DETAIL, {});
    }
  },
  //获取线路列表
  async operateLineList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await Operate.operateLineList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_LINE_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取线路删除
  async operateLineDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Operate.operateLineDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '线路已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改线路
  async operateLineAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Operate[data.id?'operateLineEdit':'operateLineAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `线路${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.OPERATE_LINE_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //线路列表数据
  [Types.OPERATE_LINE_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //线路详情
  [Types.OPERATE_LINE_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏线路新增修改
  [Types.OPERATE_LINE_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}