import { Config, Http } from '@/util';

export default {
  headQuery(data) {
    return Http.get(Config.api.groupHeadQuery, data)
  },
  headFreeze(data) {
    data = {...data, is_freeze_header: true }
    return Http.post(Config.api.groupHeadFreeze, data)
  },
  headUnFreeze(data) {
    data = {...data, is_freeze_header: false }
    return Http.post(Config.api.groupHeadFreeze, data)
  },
  //门店冻结解冻
  storeFreeze(data){
    return Http.post(Config.api.groupStoreFreeze, data);
  },
  headStoreDetail(data) {
    return Http.get(Config.api.groupHeadStoreBindDetail, data)
  },
  headAdd(data) {
    return Http.post(Config.api.groupHeadAdd, data)
  },
  memberQuery(data) {
    return Http.get(Config.api.groupMemberQuery, data)
  },
  memberFreeze(data) {
    data = {...data, is_freeze: true }
    return Http.post(Config.api.groupMemberFreeze, data)
  },
  memberUnFreeze(data) {
    data = {...data, is_freeze: false }
    return Http.post(Config.api.groupMemberFreeze, data)
  },
  orderQuery(data) {
    return Http.get(Config.api.groupOrderQuery, data)
  },
  orderShip(data) {
    return Http.post(Config.api.groupOrderShip, data)
  },
  orderAllShip(data){
    return Http.post(Config.api.groupOrderAllShip, data)
  },
  orderAllShipTotals(data){
    return Http.get(Config.api.groupOrderAllShipTotals, data)
  },
  orderDetail(data) {
    return Http.get(Config.api.groupOrderDetail, data)
  },
  orderCancel(data) {
    return Http.post(Config.api.groupOrderCancel, data)
  },
  orderConfirmPickUp(data){
    return Http.post(Config.api.groupOrderConfirmPickUp, data);
  }
}
