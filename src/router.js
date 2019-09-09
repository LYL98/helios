import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/view/home/Dashboard')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('@/Login')
    },

    /*客户*/
    {
      path: '/merchant/store/query',
      name: 'MerchantStoreQuery',
      component: () => import('@/view/merchant/List')
    },
    {
      path: '/merchant/refund/query',
      name: 'MerchantRefundQuery',
      component: () => import('@/view/merchant/RefundList')
    },
    /*采购*/
    {
      path: '/purchase/supplier/query',
      name: 'PurchaseSupplierQuery',
      component: () => import('@/view/purchase/SupplierList')
    },
    {
      path: '/purchase/item/query',
      name: 'PurchaseItemQuery',
      component: () => import('@/view/purchase/ItemList')
    },
    {
      path: '/purchase/warehouse/query',
      name: 'PurchaseWarehouseQuery',
      component: () => import('@/view/purchase/WarehouseList')
    },
    {
      path: '/purchase/finance/query',
      name: 'PurchaseFinanceQuery',
      component: () => import('@/view/purchase/FinanceList')
    },
    /*商品*/
    {
      path: '/item/list',
      name: 'ItemList',
      component: () => import('@/view/item/List')
    },
    {
      path: '/item/pricing',
      name: 'ItemPricing',
      component: () => import('@/view/item/Pricing')
    },
    /*营销*/
    {
      path: '/marketing/scope/promotion/query',
      name: 'MarketingScopePromotionQuery',
      component: () => import('@/view/marketing/ScopePromotionList')
    },
    {
      path: '/marketing/coupon/query',
      name: 'MarketingCouponQuery',
      component: () => import('@/view/marketing/CouponList')
    },
    /*团购*/
    {
      path: '/group/activity',
      name: 'GroupActivity',
      component: () => import('@/view/group/Activity')
    },
    {
      path: '/group/item/class',
      name: 'GroupItemClass',
      component: () => import('@/view/group/ItemClass')
    },
    {
      path: '/group/item',
      name: 'GroupItem',
      component: () => import('@/view/group/Item')
    },
    {
      path: '/group/item/recover',
      name: 'GroupItemRecoverList',
      component: () => import('@/view/group/ItemRecover')
    },
    {
      path: '/group/head/query',
      name: 'GroupHeadQuery',
      component: () => import('@/view/group/Head')
    },
    {
      path: '/group/member/query',
      name: 'GroupMemberQuery',
      component: () => import('@/view/group/Member')
    },
    {
      path: '/group/order/query',
      name: 'GroupOrderQuery',
      component: () => import('@/view/group/Order')
    },
    {
      path: '/group/store/order',
      name: 'GroupStoreOrder',
      component: () => import('@/view/group/StoreOrder')
    },
    /*订单*/
    {
      path: '/order/list',
      name: 'OrderList',
      component: () => import('@/view/order/List')
    },
    {
      path: '/order/after_sale',
      name: 'OrderAfterSale',
      component: () => import('@/view/order/AfterSale')
    },

    /*配送*/
    {
      path: '/operate/receiving',
      name: 'OperateReceiving',
      component: () => import('@/view/operate/Receiving')
    },
    {
      path: '/operate/line/list',
      name: 'OperateLineList',
      component: () => import('@/view/operate/LineList')
    },
    {
      path: '/operate/refund/frame',
      name: 'OperateRefundFrame',
      component: () => import('@/view/operate/RefundFrame')
    },

    /*财务*/
    {
      path: '/finance/balance/query',
      name: 'FinanceBalanceQuery',
      component: () => import('@/view/finance/BalanceList')
    },
    {
      path: '/finance/approve/query',
      name: 'FinanceApproveQuery',
      component: () => import('@/view/finance/ApproveList')
    },

    /*统计*/
    {
      path: '/statistic/market',
      name: 'StatisticMarket',
      component: () => import('@/view/statistic/Market')
    },
    {
      path: '/statistic/market/class',
      name: 'StatisticMarketClass',
      component: () => import('@/view/statistic/MarketClass')
    },
    {
      path: '/statistic/market/class/item',
      name: 'StatisticMarketClassItem',
      component: () => import('@/view/statistic/MarketClassItem')
    },
    {
      path: '/statistic/client',
      name: 'StatisticClient',
      component: () => import('@/view/statistic/Client')
    },
    {
      path: '/statistic/client/zone',
      name: 'StatisticClientZone',
      component: () => import('@/view/statistic/ClientZone')
    },
    {
      path: '/statistic/client/zone/store',
      name: 'StatisticClientZoneStore',
      component: () => import('@/view/statistic/ClientZoneStore')
    },
    {
      path: '/statistic/client/zone/store/item',
      name: 'StatisticClientZoneStoreItem',
      component: () => import('@/view/statistic/ClientZoneStoreItem')
    },
    {
      path: '/statistic/OperationStatistics',
      name: 'StatisticOperation',
      component: () => import('@/view/statistic/OperationStatistics')
    },
    {
      path: '/statistic/export/print',
      name: 'StatisticExportPrint',
      component: () => import('@/view/statistic/ExportPrint')
    },
    {
      path: '/statistic/operationStatement/business',
      name: 'BusinessOperationStatement',
      component: () => import('@/view/statistic/BusinessOperationStatement')
    },
    {
      path: '/statistic/operationStatement/item',
      name: 'ItemOperationStatement',
      component: () => import('@/view/statistic/ItemOperationStatement')
    },
    {
      path: '/statistic/GroupBuyStatement',
      name: 'GroupBuyStatement',
      component: () => import('@/view/statistic/GroupBuyStatement')
    },

    /*基础信息*/
    {
      path: '/basicdata/system/class/list',
      name: 'BasicDataSystemClassList',
      component: () => import('@/view/basicdata/SystemClassList')
    },
    {
      path: '/basicdata/display/class/list',
      name: 'BasicDataDisplayClassList',
      component: () => import('@/view/basicdata/DisplayClassList')
    },
    {
      path: '/basicdata/frame/list',
      name: 'BasicDataFrameList',
      component: () => import('@/view/basicdata/FrameList')
    },
    {
      path: '/basicdata/item/tags/list',
      name: 'BasicDataItemTagsList',
      component: () => import('@/view/basicdata/ItemTagsList')
    },
    {
      path: '/basicdata/province/list',
      name: 'BasicDataProvinceList',
      component: () => import('@/view/basicdata/ProvinceList')
    },
    {
      path: '/basicdata/zone/list',
      name: 'BasicDataZoneList',
      component: () => import('@/view/basicdata/ZoneList')
    },
    {
      path: '/basicdata/city/list',
      name: 'BasicDataCityList',
      component: () => import('@/view/basicdata/CityList')
    },
    {
      path: '/basicdata/grade/list',
      name: 'BasicDataGradeList',
      component: () => import('@/view/basicdata/GradeList')
    },
    {
      path: '/basicdata/merchant/inner/tag/list',
      name: 'BasicDataMerchantInnerTagsList',
      component: () => import('@/view/basicdata/MerchantInnerTagsList')
    },
    {
      path: '/basicdata/merchant/outer/tag/list',
      name: 'BasicDataMerchantOuterTagsList',
      component: () => import('@/view/basicdata/MerchantOuterTagsList')
    },
    /*系统设置*/
    {
      path: '/system/role/list',
      name: 'SystemRoleList',
      component: () => import('@/view/system/RoleList')
    },
    {
      path: '/system/operator/list',
      name: 'SystemOperatorList',
      component: () => import('@/view/system/OperatorList')
    },
    {
      path: '/system/setting',
      name: 'SystemSetting',
      component: () => import('@/view/system/Setting')
    },
    {
      path: '/system/setting/custom',
      name: 'SystemSettingCustom',
      component: () => import('@/view/system/SettingCustom')
    },
    {
      path: '/system/banner/list',
      name: 'SystemBannerList',
      component: () => import('@/view/system/BannerList')
    },
    {
      path: '/system/brand/settings',
      name: 'SystemBrandSettings',
      component: () => import('@/view/system/BrandSettings')
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
