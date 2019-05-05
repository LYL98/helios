import { Config, Request } from '@/util';

export default {
    //拉取收货单
    orderDeliveryItems(data) {
        return Request.requestGet(Config.api.orderDeliveryItems, data);
    },
    //提交收货单
    orderDeliveryItemsSubmit(data) {
        return Request.requestPost(Config.api.orderDeliveryItemsSubmit, data);
    },
    //获取要分配商品的门店列表
    operatorOrderDistributeStores(data) {
        return Request.requestGet(Config.api.operatorOrderDistributeStores, data);
    },
    //分配商品到门店
    operatorOrderDistribute(data) {
        return Request.requestPost(Config.api.operatorOrderDistribute, data);
    },
    //获取指定城市所需配送的门店
    deliveryStoresByCity(data) {
        return Request.requestGet(Config.api.deliveryStoresByCity, data);
    },
    //获取指定城市所需配送的商品
    deliveryItemsByCity(data) {
        return Request.requestGet(Config.api.deliveryItemsByCity, data);
    },
    //称重，查看门店商品的列表，可指定门店，或者指定商品
    deliveryStoreItems(data) {
        return Request.requestGet(Config.api.deliveryStoreItems, data);
    },
    //提交称重数据
    orderDeliveryWeightData(data) {
        return Request.requestPost(Config.api.orderDeliveryWeightData, data);
    },
    //审核详情(称重收货，预审，查看缺货的，称重偏差在20%的)
    deliveryPreCheck(data) {
        return Request.requestGet(Config.api.deliveryPreCheck, data);
    },
    //审核通过
    orderDeliveryCheck(data) {
        return Request.requestPost(Config.api.orderDeliveryCheck, data);
    },
    //线路新增
    operateLineAdd(data) {
        return Request.requestPost(Config.api.operateLineAdd, data);
    },
    //线路修改
    operateLineEdit(data) {
        return Request.requestPost(Config.api.operateLineEdit, data);
    },
    //线路列表
    operateLineList(data) {
        return Request.requestGet(Config.api.operateLineList, data);
    },
    //线路删除
    operateLineDelete(data) {
        return Request.requestPost(Config.api.operateLineDelete, data);
    },
    //打印商品标签(打印)
    orderLabelPrint(data) {
        return Request.requestGet(Config.api.orderLabelPrint, data);
    },
    // 退框查询
    refundFrameQuery(data) {
        return Request.requestGet(Config.api.operateRefundQuery, data);
    },
    // 获取可以退框的门店列表
    refundStoreList(data) {
        return Request.requestGet(Config.api.operateRefundStoreList, data);
    },
    // 退还多个门店的数据
    refundStoreReturn(data) {
      return Request.requestPost(Config.api.operateRefundStoreReturn, data);
    },
    // 退框记录审核
    refundFrameApprove(data) {
        return Request.requestPost(Config.api.operateRefundFrameApprove, data);
    },
    // 退框记录驳回
    refundFrameReject(data) {
        return Request.requestPost(Config.api.operateRefundFrameReject, data);
    },
    // 退框记录导出
    refundFrameExport(data) {
      return Request.requestPost(Config.api.operateRefundFrameExport, data);
    },
}
