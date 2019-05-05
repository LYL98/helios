import { Config, Request } from '@/util';

export default {
  balanceQuery(data) {
    return Request.requestGet(Config.api.financeBalanceQuery, data);
  },
  balanceEdit(data) {
    return Request.requestPost(Config.api.financeBalanceEdit, data);
  },
  balanceLogQuery(data) {
    return Request.requestGet(Config.api.financeBalanceLogQuery, data);
  },
  balanceExport(data) {
    return Request.requestGet(Config.api.financeBalanceExport, data);
  },
  balanceMerchantLogExport(data) {
    return Request.requestGet(Config.api.financeBalanceMerchantLogExport, data);
  },

  approveQuery(data) {
    return Request.requestGet(Config.api.financeApproveQuery, data);
  },
  approveEdit(data) {
    return Request.requestPost(Config.api.financeApproveEdit, data);
  },
  approveDetail(data) {
    return Request.requestGet(Config.api.financeApproveDetail, data);
  },

}
