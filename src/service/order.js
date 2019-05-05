import { Config, Request } from '@/util';

export default {
    //订单列表
    orderQuery(data){
        return Request.requestGet(Config.api.orderQuery, data);
    },
    //导出订单列表
    orderListExport(data) {
        return Request.requestGet(Config.api.orderListExport, data);
    },
    //订单详情
    orderDetail(data){
        return Request.requestGet(Config.api.orderDetail, data);
    },
    //取消订单
    orderCancel(data) {
        return Request.requestPost(Config.api.orderCancel, data);
    },
    //确认订单
    orderConfirm(data) {
      return Request.requestPost(Config.api.orderConfirm, data);
    },
    //手动修改订单
    orderManualChange(data) {
      return Request.requestPost(Config.api.orderManualChange, data);
    },
    //手动发货
    orderShip(data) {
      return Request.requestPost(Config.api.orderShip, data);
    },
    //导出订单商品列表
    orderItemExport(data) {
        return Request.requestGet(Config.api.orderItemExport, data);
    },
    //修改订单价格
    orderPriceUpdate(data){
        return Request.requestPost(Config.api.orderPriceUpdate, data);
    },
    //获取负责处理的售后单
    afterSaleQuery(data){
        return Request.requestGet(Config.api.afterSaleQuery, data);
    },
    //获取售后单详情
    afterSaleDetail(data){
        return Request.requestPost(Config.api.afterSaleDetail, data);
    },
    //售后处理
    afterSaleUpdate(data){
        return Request.requestPost(Config.api.afterSaleUpdate, data);
    },
    //售后单回复
    aftersaleAppend(data){
        return Request.requestPost(Config.api.aftersaleAppend, data);
    },
}
