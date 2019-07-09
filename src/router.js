import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/view/home/Dashboard')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/Login')
    },

    /*客户*/
    {
      path: '/merchant/store/query',
      name: 'MerchantStoreQuery',
      component: () => import(/* webpackChunkName: "merchant" */ '@/view/merchant/List')
    },
    {
      path: '/merchant/refund/query',
      name: 'MerchantRefundQuery',
      component: () => import(/* webpackChunkName: "merchant" */ '@/view/merchant/RefundList')
    },
    /*采购*/
    {
      path: '/purchase/supplier/query',
      name: 'PurchaseSupplierQuery',
      component: () => import(/* webpackChunkName: "purchase" */ '@/view/purchase/SupplierList')
    },
    {
      path: '/purchase/item/query',
      name: 'PurchaseItemQuery',
      component: () => import(/* webpackChunkName: "purchase" */ '@/view/purchase/ItemList')
    },
    {
      path: '/purchase/warehouse/query',
      name: 'PurchaseWarehouseQuery',
      component: () => import(/* webpackChunkName: "purchase" */ '@/view/purchase/WarehouseList')
    },
    {
      path: '/purchase/finance/query',
      name: 'PurchaseFinanceQuery',
      component: () => import(/* webpackChunkName: "purchase" */ '@/view/purchase/FinanceList')
    },
    /*商品*/
    {
      path: '/item/list',
      name: 'ItemList',
      component: () => import(/* webpackChunkName: "item" */ '@/view/item/List')
    },
    {
      path: '/item/pricing',
      name: 'ItemPricing',
      component: () => import(/* webpackChunkName: "item" */ '@/view/item/Pricing')
    },
    /*营销*/
    {
      path: '/marketing/scope/promotion/query',
      name: 'MarketingScopePromotionQuery',
      component: () => import(/* webpackChunkName: "marketing" */ '@/view/marketing/ScopePromotionList')
    },
    {
      path: '/marketing/coupon/query',
      name: 'MarketingCouponQuery',
      component: () => import(/* webpackChunkName: "marketing" */ '@/view/marketing/CouponList')
    },
    /*团购*/
    {
      path: '/group/buy/query',
      name: 'GroupBuyQuery',
      component: () => import(/* webpackChunkName: "group" */ '@/view/group/Buy')
    },
    {
      path: '/group/head/query',
      name: 'GroupHeadQuery',
      component: () => import(/* webpackChunkName: "group" */ '@/view/group/Head')
    },
    {
      path: '/group/member/query',
      name: 'GroupMemberQuery',
      component: () => import(/* webpackChunkName: "group" */ '@/view/group/Member')
    },
    {
      path: '/group/order/query',
      name: 'GroupOrderQuery',
      component: () => import(/* webpackChunkName: "group" */ '@/view/group/Order')
    },
    /*订单*/
    {
      path: '/order/list',
      name: 'OrderList',
      component: () => import(/* webpackChunkName: "order" */ '@/view/order/List')
    },
    {
      path: '/order/after_sale',
      name: 'OrderAfterSale',
      component: () => import(/* webpackChunkName: "order" */ '@/view/order/AfterSale')
    },

    /*配送*/
    {
      path: '/operate/receiving',
      name: 'OperateReceiving',
      component: () => import(/* webpackChunkName: "operate" */ '@/view/operate/Receiving')
    },
    {
      path: '/operate/line/list',
      name: 'OperateLineList',
      component: () => import(/* webpackChunkName: "operate" */ '@/view/operate/LineList')
    },
    {
      path: '/operate/refund/frame',
      name: 'OperateRefundFrame',
      component: () => import(/* webpackChunkName: "operate" */ '@/view/operate/RefundFrame')
    },

    /*财务*/
    {
      path: '/finance/balance/query',
      name: 'FinanceBalanceQuery',
      component: () => import(/* webpackChunkName: "finance" */ '@/view/finance/BalanceList')
    },
    {
      path: '/finance/approve/query',
      name: 'FinanceApproveQuery',
      component: () => import(/* webpackChunkName: "finance" */ '@/view/finance/ApproveList')
    },

    /*统计*/
    {
      path: '/statistic/market',
      name: 'StatisticMarket',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/Market')
    },
    {
      path: '/statistic/market/class',
      name: 'StatisticMarketClass',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/MarketClass')
    },
    {
      path: '/statistic/market/class/item',
      name: 'StatisticMarketClassItem',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/MarketClassItem')
    },
    {
      path: '/statistic/client',
      name: 'StatisticClient',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/Client')
    },
    {
      path: '/statistic/client/zone',
      name: 'StatisticClientZone',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/ClientZone')
    },
    {
      path: '/statistic/client/zone/store',
      name: 'StatisticClientZoneStore',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/ClientZoneStore')
    },
    {
      path: '/statistic/client/zone/store/item',
      name: 'StatisticClientZoneStoreItem',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/ClientZoneStoreItem')
    },
    {
      path: '/statistic/OperationStatistics',
      name: 'StatisticOperation',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/OperationStatistics')
    },
    {
      path: '/statistic/export/print',
      name: 'StatisticExportPrint',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/ExportPrint')
    },
    {
      path: '/statistic/operationStatement/business',
      name: 'BusinessOperationStatement',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/BusinessOperationStatement')
    },
    {
      path: '/statistic/operationStatement/item',
      name: 'ItemOperationStatement',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/ItemOperationStatement')
    },
    {
      path: '/statistic/GroupBuyStatement',
      name: 'GroupBuyStatement',
      component: () => import(/* webpackChunkName: "statistic" */ '@/view/statistic/GroupBuyStatement')
    },

    /*基础信息*/
    {
      path: '/basicdata/system/class/list',
      name: 'BasicDataSystemClassList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/SystemClassList')
    },
    {
      path: '/basicdata/display/class/list',
      name: 'BasicDataDisplayClassList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/DisplayClassList')
    },
    {
      path: '/basicdata/frame/list',
      name: 'BasicDataFrameList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/FrameList')
    },
    {
      path: '/basicdata/item/tags/list',
      name: 'BasicDataItemTagsList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/ItemTagsList')
    },
    {
      path: '/basicdata/province/list',
      name: 'BasicDataProvinceList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/ProvinceList')
    },
    {
      path: '/basicdata/zone/list',
      name: 'BasicDataZoneList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/ZoneList')
    },
    {
      path: '/basicdata/city/list',
      name: 'BasicDataCityList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/CityList')
    },
    {
      path: '/basicdata/grade/list',
      name: 'BasicDataGradeList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/GradeList')
    },
    {
      path: '/basicdata/merchant/inner/tag/list',
      name: 'BasicDataMerchantInnerTagsList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/MerchantInnerTagsList')
    },
    {
      path: '/basicdata/merchant/outer/tag/list',
      name: 'BasicDataMerchantOuterTagsList',
      component: () => import(/* webpackChunkName: "basicdata" */ '@/view/basicdata/MerchantOuterTagsList')
    },
    /*系统设置*/
    {
      path: '/system/role/list',
      name: 'SystemRoleList',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/RoleList')
    },
    {
      path: '/system/operator/list',
      name: 'SystemOperatorList',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/OperatorList')
    },
    {
      path: '/system/setting',
      name: 'SystemSetting',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/Setting')
    },
    {
      path: '/system/setting/custom',
      name: 'SystemSettingCustom',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/SettingCustom')
    },
    {
      path: '/system/banner/list',
      name: 'SystemBannerList',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/BannerList')
    },
    {
      path: '/system/brand/settings',
      name: 'SystemBrandSettings',
      component: () => import(/* webpackChunkName: "system" */ '@/view/system/BrandSettings')
    },
  ]
});

//全局守卫
/*router.beforeEach((to, from, next) => {
  if(to.name !== 'Login' && to.name !== 'SimulateLogin' && to.name !== 'Hint'){
    Indicator.open();
    //判断是否登录
    Account.getSignIsLogin().then((res)=>{
      if(res.code === 0){
        let rd = res.data;
        let d = Method.getLocalStorage('appleLoginInfo');
        if(d){
          if(d.id !== rd.id){
            Method.setLocalStorage('appleLoginInfo', rd);
          }
        }else{
          Method.setLocalStorage('appleLoginInfo', rd);
        }
        next();
        window.scrollTo(0,0);
      }else{
        Config.accreditLogin();
      }
      Indicator.close();
    });
  }else{
    next();
    window.scrollTo(0,0);
  }
});*/

export default router;
