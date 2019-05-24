import { Config, Http } from '@/util';

export default {
  balanceQuery(data) {
    return Http.get(Config.api.financeBalanceQuery, data);
  },
  balanceEdit(data) {
    return Http.post(Config.api.financeBalanceEdit, data);
  },
  balanceLogQuery(data) {
    return Http.get(Config.api.financeBalanceLogQuery, data);
  },
  balanceExport(data) {
    return Http.get(Config.api.financeBalanceExport, data);
  },
  balanceMerchantLogExport(data) {
    return Http.get(Config.api.financeBalanceMerchantLogExport, data);
  },

  approveQuery(data) {
    return Http.get(Config.api.financeApproveQuery, data);
  },
  approveEdit(data) {
    return Http.post(Config.api.financeApproveEdit, data);
  },
  approveDetail(data) {
    return Http.get(Config.api.financeApproveDetail, data);
  },

}
