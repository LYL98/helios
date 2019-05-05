import { Config, Request } from '@/util';

export default {
    //商户列表
    merchantList(data){
        return Request.requestGet(Config.api.merchantList, data);
    },
    //新增商户
    merchantAdd(data){
        return Request.requestPost(Config.api.merchantAdd, data);
    },
    //修改商户
    merchantEdit(data){
        return Request.requestPost(Config.api.merchantEdit, data);
    },
    //商户详情
    merchantDetail(data){
        return Request.requestGet(Config.api.merchantDetail, data);
    },
    //商户审核
    merchantApprove(data){
        return Request.requestPost(Config.api.merchantApprove, data);
    },
    //商户冻结
    merchantFreeze(data){
        return Request.requestPost(Config.api.merchantFreeze, data);
    },
    //商户解冻
    merchantUnFreeze(data){
        return Request.requestPost(Config.api.merchantUnFreeze, data);
    },
    //商户内标签修改
    merchantGradeTagsEdit(data){
        return Request.requestPost(Config.api.merchantGradeTagsEdit, data);
    },
    //团购商户批处理
    merchantBatchGroupBuy(data){
      return Request.requestPost(Config.api.merchantBatchGroupBuy, data);
    },
    // 商户充值/扣款
    balanceEdit(data) {
        return Request.requestPost(Config.api.merchantBalanceEdit, data);
    },
    balanceLogQuery(data) {
        return Request.requestGet(Config.api.merchantBalanceLogQuery, data);
    },
    // 修改门店的退框信息
    refundListEdit(data) {
        return Request.requestPost(Config.api.merchantRefundListEdit, data);
    },
    // 修改门店的退框信息
    refundEdit(data) {
        return Request.requestPost(Config.api.merchantRefundEdit, data);
    },
    // 门店退框日志查询
    refundLogQuery(data) {
        return Request.requestGet(Config.api.merchantRefundLogQuery, data);
    },
    //所有门店的查询结果
    storeQuery(data) {
        return Request.requestGet(Config.api.storeQuery, data);
    },
    //单商户下的门店列表
    storeList(data){
        return Request.requestGet(Config.api.storeList, data);
    },
    //门店详情
    storeDetail(data){
        return Request.requestGet(Config.api.storeDetail, data);
    },
    //添加门店
    storeAdd(data){
        return Request.requestPost(Config.api.storeAdd, data);
    },
    //修改门店
    storeEdit(data){
        return Request.requestPost(Config.api.storeEdit, data);
    },
    //修改所在仓
    storeEditCity(data) {
      return Request.requestPost(Config.api.storeEditCity, data);
    },
    //门店冻结
    storeFreeze(data){
        return Request.requestPost(Config.api.storeFreeze, data);
    },
    //门店解冻
    storeUnFreeze(data){
        return Request.requestPost(Config.api.storeUnFreeze, data);
    },
    //门店审核
    storeApprove(data){
        return Request.requestPost(Config.api.storeApprove, data);
    },
    //删除门店
    storeDelete(data){
        return Request.requestPost(Config.api.storeDelete, data);
    },
    //新用户资料添加
    memberAdd(data){
        return Request.requestPost(Config.api.memberAdd, data);
    },
    //用户列表
    memberList(data){
        return Request.requestGet(Config.api.memberList, data);
    },
    //重置密码
    memberPasswordReset(data){
        return Request.requestPost(Config.api.memberPasswordReset, data);
    },
    //冻结用户账号
    memberFreeze(data){
        return Request.requestPost(Config.api.memberFreeze, data);
    },
    //解冻用户账号
    memberUnFreeze(data){
        return Request.requestPost(Config.api.memberUnFreeze, data);
    },

}
