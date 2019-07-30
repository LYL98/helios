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
  basicDataFrameIsShowAddEdit: state => state.isShowAddEdit,
  basicDataFrameDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏商品框新增修改
  basicDataFrameShowHideAddEdit({commit}, {isShow, data}){
    commit(Types.BASIC_DATA_FRAME_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_FRAME_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_FRAME_DETAIL, {});
    }
  },
  
  //获取商品框删除
  async basicDataFrameDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataFrameDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品框已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改商品框
  async basicDataFrameAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataFrameEdit':'basicdataFrameAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `商品框${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_FRAME_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商品框列表数据
  [Types.BASIC_DATA_FRAME_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //商品框详情
  [Types.BASIC_DATA_FRAME_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏商品框新增修改
  [Types.BASIC_DATA_FRAME_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}