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
  basicDataGradeListDataItem: state => state.dataItem,
  basicDataGradeIsShowAddEdit: state => state.isShowAddEdit,
  basicDataGradeDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏商户等级新增修改
  basicDataGradeShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_GRADE_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_GRADE_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_GRADE_DETAIL, {});
    }
  },
  //获取商户等级列表
  async basicDataGradeList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataGradeList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_GRADE_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取商户等级删除
  async basicDataGradeDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataGradeDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商户等级已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改商户等级
  async basicDataGradeAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataGradeEdit':'basicdataGradeAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `商户等级${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_GRADE_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商户等级列表数据
  [Types.BASIC_DATA_GRADE_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //商户等级详情
  [Types.BASIC_DATA_GRADE_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏商户等级新增修改
  [Types.BASIC_DATA_GRADE_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}