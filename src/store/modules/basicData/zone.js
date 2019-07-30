import { BasicData } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: [],
  detail: {},
  isShowAddEdit: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  basicDataZoneListDataItem: state => state.dataItem,
  basicDataZoneIsShowAddEdit: state => state.isShowAddEdit,
  basicDataZoneDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏片区新增修改
  basicDataZoneShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_ZONE_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_ZONE_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_ZONE_DETAIL, {});
    }
  },
  //获取片区列表
  async basicDataZoneList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataZoneList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_ZONE_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取片区删除
  async basicDataZoneDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataZoneDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '片区已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改片区
  async basicDataZoneAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataZoneEdit':'basicdataZoneAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `片区${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_ZONE_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //片区列表数据
  [Types.BASIC_DATA_ZONE_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //片区详情
  [Types.BASIC_DATA_ZONE_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏片区新增修改
  [Types.BASIC_DATA_ZONE_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}