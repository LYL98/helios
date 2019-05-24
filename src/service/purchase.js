import { Config, Http } from '@/util';

export default {
  // 供应商
  supplierQuery(data) {
    return Http.get(Config.api.purchaseSupplierQuery, data);
  },
  supplierAdd(data) {
    return Http.post(Config.api.purchaseSupplierAdd, data);
  },
  supplierModify(data) {
    return Http.post(Config.api.purchaseSupplierModify, data);
  },
  supplierApprove(data) {
    return Http.post(Config.api.purchaseSupplierApprove, data);
  },
  supplierFreeze(data) {
    return Http.post(Config.api.purchaseSupplierFreeze, data);
  },
  supplierUnFreeze(data) {
    return Http.post(Config.api.purchaseSupplierUnFreeze, data);
  },

  // 采购商品
  itemQuery(data) {
    return Http.get(Config.api.purchaseItemQuery, data);
  },
  itemList(data) {
    return Http.get(Config.api.purchaseItemList, data);
  },
  itemDetail(data) {
    return Http.get(Config.api.purchaseItemDetail, data);
  },
  warehouseQuery(data) {
    return Http.get(Config.api.purchaseWarehouseQuery, data);
  },
  financeQuery(data) {
    return Http.get(Config.api.purchaseFinanceQuery, data);
  },
  itemAdd(data) {
    return Http.post(Config.api.purchaseItemAdd, data);
  },
  itemModify(data) {
    return Http.post(Config.api.purchaseItemModify, data);
  },
  itemHighAuthor(data) {
    return Http.post(Config.api.purchaseItemHighAuthor, data);
  },
  itemFirstCheck(data) {
    return Http.post(Config.api.purchaseItemFirstCheck, data);
  },
  itemSecondCheck(data) {
    return Http.post(Config.api.purchaseItemSecondCheck, data);
  },
  itemDecline(data) {
    return Http.post(Config.api.purchaseItemDecline, data);
  },
  itemApproveLog(data) {
    return Http.get(Config.api.purchaseItemApproveLog, data);
  }
}
