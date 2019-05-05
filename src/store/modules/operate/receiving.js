import { Operate } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  receivingDataItem: {
    cities: [],
    items: []
  },//收货列表
  distributeStoresItem: {
    store_items: []
  }, //要分配的列表
  isShowAllot: false, //显示分配到门店
  isShowEditNumber: false, //显示编辑数量
  editNumData: {}, //编辑数量的data
  optData: {}, //操作数据
  isShowWeigh: false, //显示称重
  weighStoreItem: [], //称重页面客户列表
  weighItemsItem: [], //称重页面商品列表
  weighDataItem: [], //要称重的列表,
  isShowEditWeigh: false, //显示编辑称重
  editWeighData: {}, //编辑称重的数据
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  operateReceivingDataItem: state => state.receivingDataItem,
  operateReceivingStoresItem: state => state.distributeStoresItem,
  operateReceivingIsShowAllot: state => state.isShowAllot,
  operateReceivingIsShowEditNumber: state => state.isShowEditNumber,
  operateReceivingEditNumData: state => state.editNumData,
  operateReceivingOptData: state => state.optData,
  operateReceivingIsShowWeigh: state => state.isShowWeigh,
  operateReceivingWeighStoreItem: state => state.weighStoreItem,
  operateReceivingWeighItemsItem: state => state.weighItemsItem,
  operateReceivingWeighDataItem: state => state.weighDataItem,
  operateReceivingWeighIsShowEdit: state => state.isShowEditWeigh,
  operateReceivingEditWeighData: state => state.editWeighData,
}

// actions
const actions = {
  //显示隐藏编辑数量
  operateReceivingShowHideEditNumber({commit, dispatch, state}, {isShow, data}){
    commit(Types.OPERATE_RECEIVING_IS_SHOW_EDIT_NUMBER, isShow);
    commit(Types.OPERATE_RECEIVING_EDIT_NUMBER_DATA, data);
  },
  //获取收货列表
  async operatorReceivingDeliveryItems({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.orderDeliveryItems(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_RECEIVING_SAVE_DATA_ITEM, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //提交收货单
  async operatorReceivingDeliveryItemsSubmit({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.orderDeliveryItemsSubmit(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '收货成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //显示隐藏分配到门店
  operateReceivingShowHideAllot({commit, dispatch, state}, {isShow, data, index}){
    commit(Types.OPERATE_RECEIVING_IS_SHOW_ALLOT, isShow);
    if(data && data.id){
      dispatch('operatorReceivingOrderDistributeStores', {
        city_item_id: data.city_items[index].id
      });
    }
  },
  //获取分配到门店列表
  async operatorReceivingOrderDistributeStores({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.operatorOrderDistributeStores(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_RECEIVING_SAVE_DISTRIBUTE_STORES_ITEM, res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //分配到门店
  async operatorReceivingOrderDistribute({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.operatorOrderDistribute(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '分配成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //审核通过
  async operatorReceivingCheck({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.orderDeliveryCheck(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '审核成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //显示隐藏称重
  operateReceivingShowWeigh({commit, dispatch, state}, {isShow, data}){
    commit(Types.OPERATE_RECEIVING_IS_SHOW_WEIGH, isShow);
    if(isShow && data){
      commit(Types.OPERATE_RECEIVING_OPT_DATA, data); //操作数据
      dispatch('operatorReceivingDeliveryStoresByCity', data); //获取门店列表
      dispatch('operatorReceivingDeliveryItemsByCity', data); //获取商品列表
    }
  },

  //获取指定城市所需配送的门店
  async operatorReceivingDeliveryStoresByCity({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.deliveryStoresByCity(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_RECEIVING_WEIGH_STORE_ITEM, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //获取指定城市所需配送的商品
  async operatorReceivingDeliveryItemsByCity({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.deliveryItemsByCity(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_RECEIVING_WEIGH_ITEMS_ITEM, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //称重，查看门店商品的列表，可指定门店，或者指定商品
  async operatorReceivingWeighStoreItems({commit, dispatch, state}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.deliveryStoreItems(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      commit(Types.OPERATE_RECEIVING_WEIGH_STORE_ITEMS_LIST, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

  //显示隐藏编辑称重
  operateReceivingWeighShowHideEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.OPERATE_RECEIVING_WEIGH_IS_SHOW_EDIT, isShow);
    commit(Types.OPERATE_RECEIVING_WEIGH_EDIT_DATA, data || {});
  },

  //提交称重数据
  async operatorReceivingWeighData({commit, dispatch, state}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await Operate.orderDeliveryWeightData(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '称重成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },

}

// mutations
const mutations = {
  //初始化数据
  [Types.OPERATE_RECEIVING_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //获取收货列表
  [Types.OPERATE_RECEIVING_SAVE_DATA_ITEM](state, data){
    state.receivingDataItem = data;
  },
  //分配到门店列表数据
  [Types.OPERATE_RECEIVING_SAVE_DISTRIBUTE_STORES_ITEM](state, data){
    state.distributeStoresItem = data;
  },
  //显示隐藏分配到门店
  [Types.OPERATE_RECEIVING_IS_SHOW_ALLOT](state, data){
    state.isShowAllot = data;
  },
  //显示隐藏编辑数量
  [Types.OPERATE_RECEIVING_IS_SHOW_EDIT_NUMBER](state, data){
    state.isShowEditNumber = data;
  },
  //编辑数量data
  [Types.OPERATE_RECEIVING_EDIT_NUMBER_DATA](state, data){
    state.editNumData = data;
  },
  //操作数据
  [Types.OPERATE_RECEIVING_OPT_DATA](state, data){
    state.optData = data;
  },
  //显示隐藏称重
  [Types.OPERATE_RECEIVING_IS_SHOW_WEIGH](state, data){
    state.isShowWeigh = data;
  },
  //称重页面商户列表
  [Types.OPERATE_RECEIVING_WEIGH_STORE_ITEM](state, data){
    state.weighStoreItem = data;
  },
  //称重页面商品列表
  [Types.OPERATE_RECEIVING_WEIGH_ITEMS_ITEM](state, data){
    state.weighItemsItem = data;
  },
  //称重页面列表数据
  [Types.OPERATE_RECEIVING_WEIGH_STORE_ITEMS_LIST](state, data){
    state.weighDataItem = data;
  },
  //显示隐藏编辑称重
  [Types.OPERATE_RECEIVING_WEIGH_IS_SHOW_EDIT](state, data){
    state.isShowEditWeigh = data;
  },
  //称重编辑数量数据
  [Types.OPERATE_RECEIVING_WEIGH_EDIT_DATA](state, data){
    state.editWeighData = data;
  },
  
}

export default {
  state,
  getters,
  actions,
  mutations
}