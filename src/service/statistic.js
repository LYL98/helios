import { Config, Request } from '@/util';

export default {
    //统计分析 - 商品销售统计 - 分类统计
    statisticalOrderClassSum(data){
        return Request.requestGet(Config.api.statisticalOrderClassSum, data);
    },
    //统计分析 - 商品销售统计 - 商品统计
    statisticalOrderItemSum(data){
        return Request.requestGet(Config.api.statisticalOrderItemSum, data);
    },
    //统计分析 - 客户订单统计 - 片区汇总
    statisticalOrderGradeSum(data){
        return Request.requestGet(Config.api.statisticalOrderGradeSum, data);
    },
    //统计分析 - 客户订单统计 - 县域汇总
    statisticalOrderCitySum(data){
      return Request.requestGet(Config.api.statisticalOrderCitySum, data);
    },
    //统计分析 - 客户订单统计 - 商户汇总
    statisticalOrderMerchantSum(data){
        return Request.requestGet(Config.api.statisticalOrderMerchantSum, data);
    },
    //统计分析 - 营收趋势 - 订单金额
    statisticalOrderTotalPriceSum(data){
        return Request.requestGet(Config.api.statisticalOrderTotalPriceSum, data);
    },
    //统计分析 - 营收趋势 - 收款金额
    statisticalOrderPayPriceSum(data){
        return Request.requestGet(Config.api.statisticalOrderPayPriceSum, data);
    },
    //统计分析 - 营收趋势 - 订单量
    statisticalOrderCount(data){
        return Request.requestGet(Config.api.statisticalOrderCount, data);
    },
    //统计分析 - 营收趋势 - 客户单价
    statisticalOrderCustomerPrice(data){
        return Request.requestGet(Config.api.statisticalOrderCustomerPrice, data);
    },
    //统计分析 - 商品销售统计 - 门店销售情况
    statisticalOrderItemSaleStores(data) {
      return Request.requestGet(Config.api.statisticalOrderItemSaleStores, data);
    },
    //统计分析 - 客户订单统计 - 客户购买商品明细
    statisticalOrderStoreSaleItems(data) {
      return Request.requestGet(Config.api.statisticalOrderStoreSaleItems, data);
    },
    //统计分析 - 业务报表 - 四率表（县域）
    statisticalOrderFourRateCity(data) {
      return Request.requestGet(Config.api.statisticalOrderFourRateCity, data);
    },
    //统计分析 - 业务报表 - 四率表（片区）
    statisticalOrderFourRateZone(data) {
      return Request.requestGet(Config.api.statisticalOrderFourRateZone, data);
    },
    //统计分析 - 业务报表 - 业务波动表（县域）
    statisticalOrderTrendCity(data) {
      return Request.requestGet(Config.api.statisticalOrderTrendCity, data);
    },
    //统计分析 - 业务报表 - 业务波动表（片区）
    statisticalOrderTrendZone(data) {
      return Request.requestGet(Config.api.statisticalOrderTrendZone, data);
    },
    //统计分析 - 业务报表 - 客户分析表
    statisticalOrderStoreAnalysis(data) {
      return Request.requestGet(Config.api.statisticalOrderStoreAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 商品
    statisticalItemDailyAnalysis(data) {
      return Request.requestGet(Config.api.statisticalItemDailyAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 采购员
    statisticalItemDailyAnalysisBuyer(data) {
      return Request.requestGet(Config.api.statisticalItemDailyAnalysisBuyer, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 展示分类
    statisticalItemDailyAnalysisClass(data) {
      return Request.requestGet(Config.api.statisticalItemDailyAnalysisClass, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 商品
    statisticalItemTrendAnalysis(data) {
      return Request.requestGet(Config.api.statisticalItemTrendAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 采购员
    statisticalItemTrendAnalysisBuyer(data) {
      return Request.requestGet(Config.api.statisticalItemTrendAnalysisBuyer, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 展示分类
    statisticalItemTrendAnalysisClass(data) {
      return Request.requestGet(Config.api.statisticalItemTrendAnalysisClass, data);
    },
    //统计分析 - 商品报表 - 商品单品分析
    statisticalItemSingleAnalysis(data) {
      return Request.requestGet(Config.api.statisticalItemSingleAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品单品分析 - 默认商品
    statisticalItemSaleGreatest(data) {
      return Request.requestGet(Config.api.statisticalItemSaleGreatest, data);
    },
    //统计分析 - 运营统计
    statisticalSumBusinessDelivery(data) {
      return Request.requestGet(Config.api.statisticalSumBusinessDelivery, data);
    },
    //统计分析 - 团购统计 - 商品统计
    statisticalSumGroupBuyItem(data) {
      return Request.requestGet(Config.api.statisticalSumGroupBuyItem, data);
    },
    //统计分析 - 团购统计 - 团长统计
    statisticalSumGroupBuyCaptain(data) {
      return Request.requestGet(Config.api.statisticalSumGroupBuyCaptain, data);
    },
    //统计分析 - 团购统计 - 团长统计 - 未参团
    statisticalSumGroupBuyCaptainNoGroup(data) {
      return Request.requestGet(Config.api.statisticalSumGroupBuyCaptainNoGroup, data);
    },
    //统计分析 - 团购统计 - 团员统计
    statisticalSumGroupBuyMember(data) {
      return Request.requestGet(Config.api.statisticalSumGroupBuyMember, data);
    }
}
