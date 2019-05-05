import { Config, Request } from '@/util';

export default {
  // 供应商
  supplierQuery(data) {
    return Request.requestGet(Config.api.purchaseSupplierQuery, data);
  },
  supplierAdd(data) {
    return Request.requestPost(Config.api.purchaseSupplierAdd, data);
  },
  supplierModify(data) {
    return Request.requestPost(Config.api.purchaseSupplierModify, data);
  },
  supplierApprove(data) {
    return Request.requestPost(Config.api.purchaseSupplierApprove, data);
  },
  supplierFreeze(data) {
    return Request.requestPost(Config.api.purchaseSupplierFreeze, data);
  },
  supplierUnFreeze(data) {
    return Request.requestPost(Config.api.purchaseSupplierUnFreeze, data);
  },

  // 采购商品
  itemQuery(data) {
    return Request.requestGet(Config.api.purchaseItemQuery, data);
  },
  itemList(data) {
    return Request.requestGet(Config.api.purchaseItemList, data);
  },
  itemDetail(data) {
    return Request.requestGet(Config.api.purchaseItemDetail, data);
  },
  warehouseQuery(data) {
    return Request.requestGet(Config.api.purchaseWarehouseQuery, data);
  },
  financeQuery(data) {
    return Request.requestGet(Config.api.purchaseFinanceQuery, data);
  },
  itemAdd(data) {
    return Request.requestPost(Config.api.purchaseItemAdd, data);
  },
  itemModify(data) {
    return Request.requestPost(Config.api.purchaseItemModify, data);
  },
  itemHighAuthor(data) {
    return Request.requestPost(Config.api.purchaseItemHighAuthor, data);
  },
  itemFirstCheck(data) {
    return Request.requestPost(Config.api.purchaseItemFirstCheck, data);
  },
  itemSecondCheck(data) {
    return Request.requestPost(Config.api.purchaseItemSecondCheck, data);
  },
  itemDecline(data) {
    return Request.requestPost(Config.api.purchaseItemDecline, data);
  },
  itemApproveLog(data) {
    return Request.requestGet(Config.api.purchaseItemApproveLog, data);
  }
}
