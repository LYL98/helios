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
  basicDataCityListDataItem: state => state.dataItem,
  basicDataCityIsShowAddEdit: state => state.isShowAddEdit,
  basicDataCityDetail: state => state.detail
}

// actions
const actions = {
  //获取县区列表
  async basicDataCityList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataCityList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_CITY_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取县区删除
  async basicDataCityDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataCityDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '县区已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改县区
  async basicDataCityAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataCityEdit':'basicdataCityAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `县区${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_CITY_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //县区列表数据
  [Types.BASIC_DATA_CITY_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //县区详情
  [Types.BASIC_DATA_CITY_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏县区新增修改
  [Types.BASIC_DATA_CITY_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
