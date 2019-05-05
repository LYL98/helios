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
  basicDataMerchantOuterTagsListDataItem: state => state.dataItem,
  basicDataMerchantOuterTagsIsShowAddEdit: state => state.isShowAddEdit,
  basicDataMerchantOuterTagsDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏商户外标签新增修改
  basicDataMerchantOuterTagsShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_MERCHANT_INNER_TAGS_IS_SHOW_ADD_EDIT, isShow);
    if(data && data.id){
      commit(Types.BASIC_DATA_MERCHANT_INNER_TAGS_DETAIL, data);
    }else{
      commit(Types.BASIC_DATA_MERCHANT_INNER_TAGS_DETAIL, {});
    }
  },
  //获取商户外标签列表
  async basicDataMerchantOuterTagsList({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataMerchantOuterTagsList(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_MERCHANT_INNER_TAGS_SAVE_DATA_ITEM, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取商户外标签删除
  async basicDataMerchantOuterTagsDelete({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataMerchantOuterTagsDelete(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '商户外标签已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改商户外标签
  async basicDataMerchantOuterTagsAddEdit({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataMerchantOuterTagsEdit':'basicdataMerchantOuterTagsAdd'](data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: `商户外标签${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_MERCHANT_INNER_TAGS_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商户外标签列表数据
  [Types.BASIC_DATA_MERCHANT_INNER_TAGS_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //商户外标签详情
  [Types.BASIC_DATA_MERCHANT_INNER_TAGS_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏商户外标签新增修改
  [Types.BASIC_DATA_MERCHANT_INNER_TAGS_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}