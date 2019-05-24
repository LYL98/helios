import { Config, Http } from '@/util';

export default {
    //采购员商品定价页面查询
    itemPriceList(data) {
        return Http.get(Config.api.itemPriceList, data);
    },
    //商品定价
    itemPriceFix(data){
        return Http.post(Config.api.itemPriceFix, data);
    },
    //商品定价审核
    itemPriceAudit(data){
        return Http.post(Config.api.itemPriceAudit, data);
    },
    //商品编号修改
    itemCodeEdit(data){
      return Http.post(Config.api.itemCodeEdit, data);
    },
    //添加商品
    itemAdd(data){
        return Http.post(Config.api.itemAdd, data);
    },
    //编辑商品
    itemEdit(data){
        return Http.post(Config.api.itemEdit, data);
    },
    //删除商品
    itemDelete(data){
      return Http.post(Config.api.itemDelete, data);
    },
    //商品列表
    itemList(data){
        return Http.get(Config.api.itemList, data);
    },
    //商品上架
    itemOnGround(data){
        return Http.post(Config.api.itemOnGround, data);
    },
    //商品下架
    itemUnderGround(data){
        return Http.post(Config.api.itemUnderGround, data);
    },
    //商品详情
    itemDetail(data) {
        return Http.get(Config.api.itemDetail, data);
    },
    //商品审核
    itemStatusApprove(data) {
        return Http.post(Config.api.itemStatusApprove, data);
    },
    //商品标签修改
    itemTagsEdit(data) {
        return Http.post(Config.api.itemTagsEdit, data);
    },

    // 营销活动
    scopePromotionQuery(data) {
      return Http.get(Config.api.itemScopePromotionQuery, data);
    },
    scopePromotionAdd(data) {
      return Http.post(Config.api.itemScopePromotionAdd, data);
    },
    scopePromotionRepeat(data) {
      return Http.get(Config.api.itemScopePromotionRepeat, data);
    },
    promotionItemCheck(data) {
      return Http.get(Config.api.itemPromotionItemCheck, data);
    },
    promotionDetail(data) {
      return Http.get(Config.api.itemPromotionDetail, data);
    },
    promotionStart(data) {
      return Http.post(Config.api.itemPromotionStart, data);
    },
    promotionHalt(data) {
      return Http.post(Config.api.itemPromotionHalt, data);
    },

    // 优惠券
    couponQuery(data) {
      return Http.get(Config.api.itemCouponQuery, data);
    },
    couponAdd(data) {
      return Http.post(Config.api.itemCouponAdd, data);
    },
    couponDetail(data) {
      return Http.get(Config.api.itemCouponDetail, data);
    },
    couponDistribute(data) {
      return Http.post(Config.api.itemCouponDistribute, data);
    },
    couponAutoDis(data) {
      return Http.post(Config.api.itemCouponAutoDis, data);
    },
    couponDistributeLog(data) {
      return Http.get(Config.api.itemCouponDistributeLog, data);
    },
    couponDistributeStatistic(data) {
      return Http.get(Config.api.itemCouponDistributeStatistic, data);
    },

    // 社区团购
    groupBuyQuery(data) {
      return Http.get(Config.api.groupBuyQuery, data);
    },
    groupBuyLogQuery(data) {
      return Http.get(Config.api.groupBuyLogQuery, data);
    },
    groupBuyItemList(data) {
      return Http.get(Config.api.groupBuyItemList, data);
    },
    groupBuyDetail(data) {
      return Http.get(Config.api.groupBuyDetail, data);
    },
    groupBuyStoreDetail(data) {
      return Http.get(Config.api.groupBuyStoreDetail, data);
    },
    groupBuyStoreMemberList(data) {
      return Http.get(Config.api.groupBuyStoreMemberList, data);
    },
    groupBuyDelete(data) {
      return Http.post(Config.api.groupBuyDelete, data);
    },
    groupBuyCancel(data) {
      return Http.post(Config.api.groupBuyCancel, data);
    },
    groupBuyAdd(data) {
      return Http.post(Config.api.groupBuyAdd, data);
    },
    groupBuyEdit(data) {
      return Http.post(Config.api.groupBuyEdit, data);
    },
    groupBuyActive(data) {
      return Http.post(Config.api.groupBuyActive, data);
    },
    groupBuyStoreList(data) {
      return Http.get(Config.api.groupBuyStoreList, data);
    }

}
