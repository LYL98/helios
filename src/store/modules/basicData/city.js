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
  //显示隐藏县区新增修改
  basicDataCityShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_CITY_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_CITY_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_CITY_DETAIL, {});
    }
  },
  //获取县区列表
  async basicDataCityList({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataCityList(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_CITY_SAVE_DATA_ITEM, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取县区删除
  async basicDataCityDelete({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataCityDelete(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '县区已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改县区
  async basicDataCityAddEdit({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataCityEdit':'basicdataCityAdd'](data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: `县区${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
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
