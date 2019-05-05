import { Config, Request } from '@/util';

export default {
  headQuery(data) {
    return Request.requestGet(Config.api.groupHeadQuery, data)
  },
  headFreeze(data) {
    data = {...data, is_freeze_header: true }
    return Request.requestPost(Config.api.groupHeadFreeze, data)
  },
  headUnFreeze(data) {
    data = {...data, is_freeze_header: false }
    return Request.requestPost(Config.api.groupHeadFreeze, data)
  },
  headStoreDetail(data) {
    return Request.requestGet(Config.api.groupHeadStoreBindDetail, data)
  },
  headAdd(data) {
    return Request.requestPost(Config.api.groupHeadAdd, data)
  },
  memberQuery(data) {
    return Request.requestGet(Config.api.groupMemberQuery, data)
  },
  memberFreeze(data) {
    data = {...data, is_freeze: true }
    return Request.requestPost(Config.api.groupMemberFreeze, data)
  },
  memberUnFreeze(data) {
    data = {...data, is_freeze: false }
    return Request.requestPost(Config.api.groupMemberFreeze, data)
  },
  orderQuery(data) {
    return Request.requestGet(Config.api.groupOrderQuery, data)
  },
  orderShip(data) {
    return Request.requestPost(Config.api.groupOrderShip, data)
  },
  orderAllShip(data){
    return Request.requestPost(Config.api.groupOrderAllShip, data)
  },
  orderAllShipTotals(data){
    return Request.requestGet(Config.api.groupOrderAllShipTotals, data)
  },
  orderDetail(data) {
    return Request.requestGet(Config.api.groupOrderDetail, data)
  },
  orderCancel(data) {
    return Request.requestPost(Config.api.groupOrderCancel, data)
  },
  orderConfirmPickUp(data){
    return Request.requestPost(Config.api.groupOrderConfirmPickUp, data);
  }
}
