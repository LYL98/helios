import { Config, Request } from '@/util';

export default {
    //采购员商品定价页面查询
    itemPriceList(data) {
        return Request.requestGet(Config.api.itemPriceList, data);
    },
    //商品定价
    itemPriceFix(data){
        return Request.requestPost(Config.api.itemPriceFix, data);
    },
    //商品定价审核
    itemPriceAudit(data){
        return Request.requestPost(Config.api.itemPriceAudit, data);
    },
    //商品编号修改
    itemCodeEdit(data){
      return Request.requestPost(Config.api.itemCodeEdit, data);
    },
    //添加商品
    itemAdd(data){
        return Request.requestPost(Config.api.itemAdd, data);
    },
    //编辑商品
    itemEdit(data){
        return Request.requestPost(Config.api.itemEdit, data);
    },
    //删除商品
    itemDelete(data){
      return Request.requestPost(Config.api.itemDelete, data);
    },
    //商品列表
    itemList(data){
        return Request.requestGet(Config.api.itemList, data);
    },
    //商品上架
    itemOnGround(data){
        return Request.requestPost(Config.api.itemOnGround, data);
    },
    //商品下架
    itemUnderGround(data){
        return Request.requestPost(Config.api.itemUnderGround, data);
    },
    //商品详情
    itemDetail(data) {
        return Request.requestGet(Config.api.itemDetail, data);
    },
    //商品审核
    itemStatusApprove(data) {
        return Request.requestPost(Config.api.itemStatusApprove, data);
    },
    //商品标签修改
    itemTagsEdit(data) {
        return Request.requestPost(Config.api.itemTagsEdit, data);
    },

    // 营销活动
    scopePromotionQuery(data) {
      return Request.requestGet(Config.api.itemScopePromotionQuery, data);
    },
    scopePromotionAdd(data) {
      return Request.requestPost(Config.api.itemScopePromotionAdd, data);
    },
    scopePromotionRepeat(data) {
      return Request.requestGet(Config.api.itemScopePromotionRepeat, data);
    },
    promotionItemCheck(data) {
      return Request.requestGet(Config.api.itemPromotionItemCheck, data);
    },
    promotionDetail(data) {
      return Request.requestGet(Config.api.itemPromotionDetail, data);
    },
    promotionStart(data) {
      return Request.requestPost(Config.api.itemPromotionStart, data);
    },
    promotionHalt(data) {
      return Request.requestPost(Config.api.itemPromotionHalt, data);
    },

    // 优惠券
    couponQuery(data) {
      return Request.requestGet(Config.api.itemCouponQuery, data);
    },
    couponAdd(data) {
      return Request.requestPost(Config.api.itemCouponAdd, data);
    },
    couponDetail(data) {
      return Request.requestGet(Config.api.itemCouponDetail, data);
    },
    couponDistribute(data) {
      return Request.requestPost(Config.api.itemCouponDistribute, data);
    },
    couponAutoDis(data) {
      return Request.requestPost(Config.api.itemCouponAutoDis, data);
    },
    couponDistributeLog(data) {
      return Request.requestGet(Config.api.itemCouponDistributeLog, data);
    },
    couponDistributeStatistic(data) {
      return Request.requestGet(Config.api.itemCouponDistributeStatistic, data);
    },

    // 社区团购
    groupBuyQuery(data) {
      return Request.requestGet(Config.api.groupBuyQuery, data);
    },
    groupBuyLogQuery(data) {
      return Request.requestGet(Config.api.groupBuyLogQuery, data);
    },
    groupBuyItemList(data) {
      return Request.requestGet(Config.api.groupBuyItemList, data);
    },
    groupBuyDetail(data) {
      return Request.requestGet(Config.api.groupBuyDetail, data);
    },
    groupBuyStoreDetail(data) {
      return Request.requestGet(Config.api.groupBuyStoreDetail, data);
    },
    groupBuyStoreMemberList(data) {
      return Request.requestGet(Config.api.groupBuyStoreMemberList, data);
    },
    groupBuyDelete(data) {
      return Request.requestPost(Config.api.groupBuyDelete, data);
    },
    groupBuyCancel(data) {
      return Request.requestPost(Config.api.groupBuyCancel, data);
    },
    groupBuyAdd(data) {
      return Request.requestPost(Config.api.groupBuyAdd, data);
    },
    groupBuyEdit(data) {
      return Request.requestPost(Config.api.groupBuyEdit, data);
    },
    groupBuyActive(data) {
      return Request.requestPost(Config.api.groupBuyActive, data);
    },
    groupBuyStoreList(data) {
      return Request.requestGet(Config.api.groupBuyStoreList, data);
    }

}
