import { Config, Http } from '@/util';

export default {
    //订单列表
    orderQuery(data){
        return Http.get(Config.api.orderQuery, data);
    },
    //导出订单列表
    orderListExport(data) {
        return Http.get(Config.api.orderListExport, data);
    },
    //订单详情
    orderDetail(data){
        return Http.get(Config.api.orderDetail, data);
    },
    //取消订单
    orderCancel(data) {
        return Http.post(Config.api.orderCancel, data);
    },
    //确认订单
    orderConfirm(data) {
      return Http.post(Config.api.orderConfirm, data);
    },
    //手动修改订单
    orderManualChange(data) {
      return Http.post(Config.api.orderManualChange, data);
    },
    //手动发货
    orderShip(data) {
      return Http.post(Config.api.orderShip, data);
    },
    //导出订单商品列表
    orderItemExport(data) {
        return Http.get(Config.api.orderItemExport, data);
    },
    //修改订单价格
    orderPriceUpdate(data){
        return Http.post(Config.api.orderPriceUpdate, data);
    },
    //获取负责处理的售后单
    afterSaleQuery(data){
        return Http.get(Config.api.afterSaleQuery, data);
    },
    //获取售后单详情
    afterSaleDetail(data){
        return Http.post(Config.api.afterSaleDetail, data);
    },
    //售后处理
    afterSaleUpdate(data){
        return Http.post(Config.api.afterSaleUpdate, data);
    },
    //售后单回复
    aftersaleAppend(data){
        return Http.post(Config.api.aftersaleAppend, data);
    },
}
