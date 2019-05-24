import { Config, Http } from '@/util';

export default {
    //拉取收货单
    orderDeliveryItems(data) {
        return Http.get(Config.api.orderDeliveryItems, data);
    },
    //提交收货单
    orderDeliveryItemsSubmit(data) {
        return Http.post(Config.api.orderDeliveryItemsSubmit, data);
    },
    //获取要分配商品的门店列表
    operatorOrderDistributeStores(data) {
        return Http.get(Config.api.operatorOrderDistributeStores, data);
    },
    //分配商品到门店
    operatorOrderDistribute(data) {
        return Http.post(Config.api.operatorOrderDistribute, data);
    },
    //获取指定城市所需配送的门店
    deliveryStoresByCity(data) {
        return Http.get(Config.api.deliveryStoresByCity, data);
    },
    //获取指定城市所需配送的商品
    deliveryItemsByCity(data) {
        return Http.get(Config.api.deliveryItemsByCity, data);
    },
    //称重，查看门店商品的列表，可指定门店，或者指定商品
    deliveryStoreItems(data) {
        return Http.get(Config.api.deliveryStoreItems, data);
    },
    //提交称重数据
    orderDeliveryWeightData(data) {
        return Http.post(Config.api.orderDeliveryWeightData, data);
    },
    //审核详情(称重收货，预审，查看缺货的，称重偏差在20%的)
    deliveryPreCheck(data) {
        return Http.get(Config.api.deliveryPreCheck, data);
    },
    //审核通过
    orderDeliveryCheck(data) {
        return Http.post(Config.api.orderDeliveryCheck, data);
    },
    //线路新增
    operateLineAdd(data) {
        return Http.post(Config.api.operateLineAdd, data);
    },
    //线路修改
    operateLineEdit(data) {
        return Http.post(Config.api.operateLineEdit, data);
    },
    //线路列表
    operateLineList(data) {
        return Http.get(Config.api.operateLineList, data);
    },
    //线路删除
    operateLineDelete(data) {
        return Http.post(Config.api.operateLineDelete, data);
    },
    //打印商品标签(打印)
    orderLabelPrint(data) {
        return Http.get(Config.api.orderLabelPrint, data);
    },
    // 退框查询
    refundFrameQuery(data) {
        return Http.get(Config.api.operateRefundQuery, data);
    },
    // 获取可以退框的门店列表
    refundStoreList(data) {
        return Http.get(Config.api.operateRefundStoreList, data);
    },
    // 退还多个门店的数据
    refundStoreReturn(data) {
      return Http.post(Config.api.operateRefundStoreReturn, data);
    },
    // 退框记录审核
    refundFrameApprove(data) {
        return Http.post(Config.api.operateRefundFrameApprove, data);
    },
    // 退框记录驳回
    refundFrameReject(data) {
        return Http.post(Config.api.operateRefundFrameReject, data);
    },
    // 退框记录导出
    refundFrameExport(data) {
      return Http.post(Config.api.operateRefundFrameExport, data);
    },
}
