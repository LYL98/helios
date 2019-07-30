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
  basicDataDisplayClassListDataItem: state => state.dataItem,
  basicDataDisplayClassIsShowAddEdit: state => state.isShowAddEdit,
  basicDataDisplayClassDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏展示分类新增修改
  basicDataDisplayClassShowHideAddEdit({commit}, {isShow, data}){
    commit(Types.BASIC_DATA_DISPLAY_CLASS_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_DISPLAY_CLASS_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_DISPLAY_CLASS_DETAIL, {});
    }
  },
  //获取展示分类列表
  async basicDataDisplayClassList({commit, dispatch}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataDisplayClassList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_DISPLAY_CLASS_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取展示分类删除
  async basicDataDisplayClassDelete({dispatch}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataDisplayClassDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '展示分类已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改展示分类
  async basicDataDisplayClassAddEdit({dispatch}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataDisplayClassEdit':'basicdataDisplayClassAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `展示分类${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_DISPLAY_CLASS_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //展示分类列表数据
  [Types.BASIC_DATA_DISPLAY_CLASS_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //展示分类详情
  [Types.BASIC_DATA_DISPLAY_CLASS_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏展示分类新增修改
  [Types.BASIC_DATA_DISPLAY_CLASS_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
