import { Config, Http } from '@/util';

export default {
    //统计分析 - 商品销售统计 - 分类统计
    statisticalOrderClassSum(data){
        return Http.get(Config.api.statisticalOrderClassSum, data);
    },
    //统计分析 - 商品销售统计 - 商品统计
    statisticalOrderItemSum(data){
        return Http.get(Config.api.statisticalOrderItemSum, data);
    },
    //统计分析 - 客户订单统计 - 片区汇总
    statisticalOrderGradeSum(data){
        return Http.get(Config.api.statisticalOrderGradeSum, data);
    },
    //统计分析 - 客户订单统计 - 县域汇总
    statisticalOrderCitySum(data){
      return Http.get(Config.api.statisticalOrderCitySum, data);
    },
    //统计分析 - 客户订单统计 - 商户汇总
    statisticalOrderMerchantSum(data){
        return Http.get(Config.api.statisticalOrderMerchantSum, data);
    },
    //统计分析 - 营收趋势 - 订单金额
    statisticalOrderTotalPriceSum(data){
        return Http.get(Config.api.statisticalOrderTotalPriceSum, data);
    },
    //统计分析 - 营收趋势 - 收款金额
    statisticalOrderPayPriceSum(data){
        return Http.get(Config.api.statisticalOrderPayPriceSum, data);
    },
    //统计分析 - 营收趋势 - 订单量
    statisticalOrderCount(data){
        return Http.get(Config.api.statisticalOrderCount, data);
    },
    //统计分析 - 营收趋势 - 客户单价
    statisticalOrderCustomerPrice(data){
        return Http.get(Config.api.statisticalOrderCustomerPrice, data);
    },
    //统计分析 - 商品销售统计 - 门店销售情况
    statisticalOrderItemSaleStores(data) {
      return Http.get(Config.api.statisticalOrderItemSaleStores, data);
    },
    //统计分析 - 客户订单统计 - 客户购买商品明细
    statisticalOrderStoreSaleItems(data) {
      return Http.get(Config.api.statisticalOrderStoreSaleItems, data);
    },
    //统计分析 - 业务报表 - 四率表（县域）
    statisticalOrderFourRateCity(data) {
      return Http.get(Config.api.statisticalOrderFourRateCity, data);
    },
    //统计分析 - 业务报表 - 四率表（片区）
    statisticalOrderFourRateZone(data) {
      return Http.get(Config.api.statisticalOrderFourRateZone, data);
    },
    //统计分析 - 业务报表 - 业务波动表（县域）
    statisticalOrderTrendCity(data) {
      return Http.get(Config.api.statisticalOrderTrendCity, data);
    },
    //统计分析 - 业务报表 - 业务波动表（片区）
    statisticalOrderTrendZone(data) {
      return Http.get(Config.api.statisticalOrderTrendZone, data);
    },
    //统计分析 - 业务报表 - 客户分析表
    statisticalOrderStoreAnalysis(data) {
      return Http.get(Config.api.statisticalOrderStoreAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 商品
    statisticalItemDailyAnalysis(data) {
      return Http.get(Config.api.statisticalItemDailyAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 采购员
    statisticalItemDailyAnalysisBuyer(data) {
      return Http.get(Config.api.statisticalItemDailyAnalysisBuyer, data);
    },
    //统计分析 - 商品报表 - 商品每日分析 - 展示分类
    statisticalItemDailyAnalysisClass(data) {
      return Http.get(Config.api.statisticalItemDailyAnalysisClass, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 商品
    statisticalItemTrendAnalysis(data) {
      return Http.get(Config.api.statisticalItemTrendAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 采购员
    statisticalItemTrendAnalysisBuyer(data) {
      return Http.get(Config.api.statisticalItemTrendAnalysisBuyer, data);
    },
    //统计分析 - 商品报表 - 商品波动分析 - 展示分类
    statisticalItemTrendAnalysisClass(data) {
      return Http.get(Config.api.statisticalItemTrendAnalysisClass, data);
    },
    //统计分析 - 商品报表 - 商品单品分析
    statisticalItemSingleAnalysis(data) {
      return Http.get(Config.api.statisticalItemSingleAnalysis, data);
    },
    //统计分析 - 商品报表 - 商品单品分析 - 默认商品
    statisticalItemSaleGreatest(data) {
      return Http.get(Config.api.statisticalItemSaleGreatest, data);
    },
    //统计分析 - 运营统计
    statisticalSumBusinessDelivery(data) {
      return Http.get(Config.api.statisticalSumBusinessDelivery, data);
    },
    //统计分析 - 团购统计 - 商品统计
    statisticalSumGroupBuyItem(data) {
      return Http.get(Config.api.statisticalSumGroupBuyItem, data);
    },
    //统计分析 - 团购统计 - 团长统计
    statisticalSumGroupBuyCaptain(data) {
      return Http.get(Config.api.statisticalSumGroupBuyCaptain, data);
    },
    //统计分析 - 团购统计 - 团长统计 - 未参团
    statisticalSumGroupBuyCaptainNoGroup(data) {
      return Http.get(Config.api.statisticalSumGroupBuyCaptainNoGroup, data);
    },
    //统计分析 - 团购统计 - 团员统计
    statisticalSumGroupBuyMember(data) {
      return Http.get(Config.api.statisticalSumGroupBuyMember, data);
    }
}
