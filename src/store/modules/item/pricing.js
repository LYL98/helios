import { Item } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: {
    buyers: [],
    items: []
  },
  isShowEdit: false, //显示编辑
  editData: {} //编辑内容
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  itemPricingPriceListDataItem: state => state.dataItem,
  itemPricingIsShowEdit: state => state.isShowEdit,
  itemPricingEditData: state => state.editData
}

// actions
const actions = {
  //显示隐藏商品定价修改
  itemPricingShowHideEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.ITEM_PRICING_IS_SHOW_EDIT, isShow);
    commit(Types.ITEM_PRICING_SAVE_EDIT_DATA, data || {});
  },
  //获取商品定价列表
  async itemPricingPriceList({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Item.itemPriceList(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.ITEM_PRICING_SAVE_DATA_ITEM, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品定价修改
  async itemPricingPriceFix({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Item.itemPriceFix(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '商品已报价', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //提交审核
  async itemPricingPriceAudit({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Item.itemPriceAudit(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '商品报价已审核', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.ITEM_PRICING_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商品定价列表数据
  [Types.ITEM_PRICING_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //显示隐藏商品定价修改
  [Types.ITEM_PRICING_IS_SHOW_EDIT](state, data){
    state.isShowEdit = data;
  },
  //保存编辑信息
  [Types.ITEM_PRICING_SAVE_EDIT_DATA](state, data){
    state.editData = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
