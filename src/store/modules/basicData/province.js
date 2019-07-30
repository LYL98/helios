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
  basicDataProvinceListDataItem: state => state.dataItem,
  basicDataProvinceIsShowAddEdit: state => state.isShowAddEdit,
  basicDataProvinceDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏省新增修改
  basicDataProvinceShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_PROVINCE_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_PROVINCE_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_PROVINCE_DETAIL, {});
    }
  },
  //获取省列表
  async basicDataProvinceList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataProvinceList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_PROVINCE_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取省删除
  async basicDataProvinceDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataProvinceDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '省已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改省
  async basicDataProvinceAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataProvinceEdit':'basicdataProvinceAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `省${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_PROVINCE_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //省列表数据
  [Types.BASIC_DATA_PROVINCE_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //省详情
  [Types.BASIC_DATA_PROVINCE_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏省新增修改
  [Types.BASIC_DATA_PROVINCE_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}