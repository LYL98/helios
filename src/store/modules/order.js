import { Order } from './../../service';
import * as Types from './../mutationTypes';

// initial state
// shape: [{ id, quantity }]
const state = {
  //===以下是订单页===
  dataItem: {
    items: [],
    num: 0
  },
  dataDetail: {
    items: [{item_attrs: []}],
    price_log: [],
    pay_record: []
  },
  isShowDetail: false,
  isShowPriceUpdate: false,
  isShowManualDelivery: false,
  //===以下是售后页===
  afterSaleDataItem: {
    items: [],
    num: 0
  },
  afterSaleDetail: {
    comment: []
  },
  isShowAfterSaleDetail: false,
  isShowAfterSaleClose: false
}

// getters
const getters = {
  //===以下是订单列表===
  orderDataItem: state => state.dataItem,
  orderDataDetail: state => state.dataDetail,
  orderIsShowDetail: state => state.isShowDetail,
  orderIsShowPriceUpdate: state => state.isShowPriceUpdate,
  orderIsShowManualDelivery: state => state.isShowManualDelivery,

  orderAfterSaleDataItem: state => state.afterSaleDataItem,
  orderAfterSaleDetail: state => state.afterSaleDetail,
  orderIsShowAfterSaleDetail: state => state.isShowAfterSaleDetail,
  orderIsShowAfterSaleClose: state => state.isShowAfterSaleClose
}

// actions
const actions = {
  //获取订单列表
  async orderGetList({commit, dispatch}, query){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderQuery(query);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.ORDER_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }

  },
  //显示隐藏订单详情
  orderShowHideDetail({commit, dispatch}, {data, isShow}){
    if (this.state.Order.isShowDetail) {
      // 如果已经是显示状态，则需要关闭后，再显示
      commit(Types.ORDER_SHOW_HIDE_DETAIL, false);
      setTimeout(() => {
        commit(Types.ORDER_SHOW_HIDE_DETAIL, isShow);
      }, 50);
    } else {
      commit(Types.ORDER_SHOW_HIDE_DETAIL, isShow);
    }
    // 发送action请求，根据订单的id 获取订单详情。
    if(isShow) dispatch('orderGetDetail', data.id);
  },
  //获取订单详情
  async orderGetDetail({commit, dispatch}, id){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderDetail({ id: id });
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.ORDER_SAVE_DETAIL, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //取消订单
  async orderCancel({commit, dispatch}, {id, callback}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderCancel({ id: id });
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '订单取消成功！', type: 'success'});
      callback && callback();
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //显示隐藏手动发货
  orderShowHideManualDelivery({commit, dispatch}, {data, isShow}){
    if (this.state.isShowManualDelivery) {
      // 如果已经是显示状态，则需要关闭后，再显示
      commit(Types.ORDER_SHOW_HIDE_MANUAL_DELIVERY, false);
      setTimeout(() => {
        commit(Types.ORDER_SHOW_HIDE_MANUAL_DELIVERY, isShow);
      }, 50);
    } else {
      commit(Types.ORDER_SHOW_HIDE_MANUAL_DELIVERY, isShow);
    }
    // 发送action请求，根据订单的id 获取订单详情。
    if(isShow) dispatch('orderGetDetail', data.id);
  },

  //确认订单
  async orderConfirm({commit, dispatch}, {id, callback}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderConfirm({ id: id });
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '订单确认成功！', type: 'success'});
      callback && callback();
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  /**
   * 列表页订单的价格修改功能删除
   */
  //显示隐藏价格变动
  orderShowHidePriceUpdate({commit, dispatch}, {data, isShow}){
    commit(Types.ORDER_SHOW_HIDE_PRICE_UPDATE, isShow);
    if(isShow) dispatch('orderGetDetail', data.id);
  },
  //订单价格变动
  async orderPriceUpdate({dispatch}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderPriceUpdate(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '订单价格修改成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取负责处理的售后单
  async orderAfterSaleQuery({commit, dispatch}, query){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.afterSaleQuery(query);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.ORDER_SAVE_AFTER_SALE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //显示隐藏售后单详情
  orderShowHideAfterSaleDetail({commit, dispatch}, {data, isShow}){
    if (this.state.Order.isShowAfterSaleDetail) {
      // 如果已经是显示状态，则需要关闭后，再显示
      commit(Types.ORDER_SHOW_AFTER_SALE_HIDE_DETAIL, false);
      setTimeout(() => {
        commit(Types.ORDER_SHOW_AFTER_SALE_HIDE_DETAIL, isShow);
      }, 50);
    } else {
      commit(Types.ORDER_SHOW_AFTER_SALE_HIDE_DETAIL, isShow);
    }
    if(isShow) dispatch('orderAfterSaleDetail', data.id);
  },
  //获取售后单详情
  async orderAfterSaleDetail({commit, dispatch}, id){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.afterSaleDetail({ id: id });
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.ORDER_SAVE_AFTER_SALE_DETAIL, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //售后处理
  async orderAfterSaleUpdate({dispatch}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.afterSaleUpdate(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '售后处理成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //显示隐藏售后单关闭
  orderShowHideAfterSaleClose({commit, dispatch}, {data, isShow}){
    commit(Types.ORDER_SHOW_AFTER_SALE_HIDE_CLOSE, isShow);
    //if(isShow) dispatch('orderAfterSaleDetail', data.id);
  },
  //售后单回复
  async orderAftersaleAppend({dispatch}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.aftersaleAppend(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '售后回复成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  //手动修改订单
  async orderManualChange({commit, dispatch}, {data, callback}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderManualChange(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '修改订单成功！', type: 'success'});
      callback && callback();
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  //手动发货
  async orderShip({commit, dispatch}, {data, callback}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Order.orderShip(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '手动发货成功！', type: 'success'});
      callback && callback();
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
};

// mutations
const mutations = {
  //初始化数据
  [Types.ORDER_INIT_STATE_DATA](state){
    state = {
      isShowDetail: false
    };
  },
  //更新订单列表数据
  [Types.ORDER_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //显示或隐藏订单详情
  [Types.ORDER_SHOW_HIDE_DETAIL](state, data){
    state.isShowDetail = data;
  },
  //更新订单详情
  [Types.ORDER_SAVE_DETAIL](state, data){
    state.dataDetail = data;
  },
  //显示或隐藏订单价格变动
  [Types.ORDER_SHOW_HIDE_PRICE_UPDATE](state, data){
    state.isShowPriceUpdate = data;
  },
  //更新售后列表数据
  [Types.ORDER_SAVE_AFTER_SALE_DATA_ITEM](state, data){
    state.afterSaleDataItem = data;
  },
  //显示或隐藏售后详情
  [Types.ORDER_SHOW_AFTER_SALE_HIDE_DETAIL](state, data){
    state.isShowAfterSaleDetail = data;
  },
  //更新售后详情
  [Types.ORDER_SAVE_AFTER_SALE_DETAIL](state, data){
    state.afterSaleDetail = data;
  },
  //显示或隐藏售后关闭
  [Types.ORDER_SHOW_AFTER_SALE_HIDE_CLOSE](state, data){
    state.isShowAfterSaleClose = data;
  },
  //显示或隐藏订单详情
  [Types.ORDER_SHOW_HIDE_MANUAL_DELIVERY](state, data){
    state.isShowManualDelivery = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
