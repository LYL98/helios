import { Config, Http } from '@/util';

export default {
    //商户列表
    merchantList(data){
        return Http.get(Config.api.merchantList, data);
    },
    //新增商户
    merchantAdd(data){
        return Http.post(Config.api.merchantAdd, data);
    },
    //修改商户
    merchantEdit(data){
        return Http.post(Config.api.merchantEdit, data);
    },
    //商户详情
    merchantDetail(data){
        return Http.get(Config.api.merchantDetail, data);
    },
    //商户审核
    merchantApprove(data){
        return Http.post(Config.api.merchantApprove, data);
    },
    //商户冻结
    merchantFreeze(data){
        return Http.post(Config.api.merchantFreeze, data);
    },
    //商户解冻
    merchantUnFreeze(data){
        return Http.post(Config.api.merchantUnFreeze, data);
    },
    //商户内标签修改
    merchantGradeTagsEdit(data){
        return Http.post(Config.api.merchantGradeTagsEdit, data);
    },
    //团购商户批处理
    merchantBatchGroupBuy(data){
      return Http.post(Config.api.merchantBatchGroupBuy, data);
    },
    // 商户充值/扣款
    balanceEdit(data) {
        return Http.post(Config.api.merchantBalanceEdit, data);
    },
    // 修改门店的退框信息
    refundListEdit(data) {
        return Http.post(Config.api.merchantRefundListEdit, data);
    },
    // 修改门店的退框信息
    refundEdit(data) {
        return Http.post(Config.api.merchantRefundEdit, data);
    },
    // 门店退框日志查询
    refundLogQuery(data) {
        return Http.get(Config.api.merchantRefundLogQuery, data);
    },
    //所有门店的查询结果
    storeQuery(data) {
        return Http.get(Config.api.storeQuery, data);
    },
    //单商户下的门店列表
    storeList(data){
        return Http.get(Config.api.storeList, data);
    },
    //门店详情
    storeDetail(data){
        return Http.get(Config.api.storeDetail, data);
    },
    //添加门店
    storeAdd(data){
        return Http.post(Config.api.storeAdd, data);
    },
    //修改门店
    storeEdit(data){
        return Http.post(Config.api.storeEdit, data);
    },
    //修改所在仓
    storeEditCity(data) {
      return Http.post(Config.api.storeEditCity, data);
    },
    //门店冻结
    storeFreeze(data){
        return Http.post(Config.api.storeFreeze, data);
    },
    //门店解冻
    storeUnFreeze(data){
        return Http.post(Config.api.storeUnFreeze, data);
    },
    //门店审核
    storeApprove(data){
        return Http.post(Config.api.storeApprove, data);
    },
    //删除门店
    storeDelete(data){
        return Http.post(Config.api.storeDelete, data);
    },
    //新用户资料添加
    memberAdd(data){
        return Http.post(Config.api.memberAdd, data);
    },
    //用户列表
    memberList(data){
        return Http.get(Config.api.memberList, data);
    },
    //重置密码
    memberPasswordReset(data){
        return Http.post(Config.api.memberPasswordReset, data);
    },
    //冻结用户账号
    memberFreeze(data){
        return Http.post(Config.api.memberFreeze, data);
    },
    //解冻用户账号
    memberUnFreeze(data){
        return Http.post(Config.api.memberUnFreeze, data);
    },

}
