import Vue from 'vue';
import Router from 'vue-router';
import { Http, Config } from '@/util';
import { MessageBox, Notification } from 'element-ui';

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

    /*供应商*/
    {
      path: '/supplier/list',
      name: 'SupplierList',
      component: () => import('@/view/supplier/List')
    },
    {
      path: '/supplier/gpurchase',
      name: 'SupplierGPurchase',
      component: () => import('@/view/supplier/GPurchase')
    },
    {
      path: '/supplier/gpurchase/distribute',
      name: 'SupplierGPurchaseDistribute',
      component: () => import('@/view/supplier/GPurchaseDistribute')
    },
    {
      path: '/supplier/localpurchase',
      name: 'SupplierLocalPurchase',
      component: () => import('@/view/supplier/LocalPurchase')
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
      component: () => import('@/view/merchant/Refund')
    },
    /*商品*/
    {
      path: '/item/global',
      name: 'ItemGlobal',
      component: () => import('@/view/item/Global')
    },
    {
      path: '/item/recover',
      name: 'ItemRecover',
      component: () => import('@/view/item/Recover')
    },
    {
      path: '/item/list',
      name: 'ItemList',
      component: () => import('@/view/item/List')
    },
    {
      path: '/item/audit/inner/tag',
      name: 'ItemAuditInnerTag',
      component: () => import('@/view/item/AuditInnerTag')
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
    {
      path: '/group/banner',
      name: 'GroupBanner',
      component: () => import('@/view/group/Banner')
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

    /*仓库*/
    {
      path: '/warehouse/stock/pending',
      name: 'WarehouseStockPending',
      component: () => import('@/view/warehouse/StockPending')
    },
    {
      path: '/warehouse/inventory',
      name: 'WarehouseInventory',
      component: () => import('@/view/warehouse/Inventory')
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
    {
      path: '/finance/s/b/detail',
      name: 'FinanceSBDetail',
      component: () => import('@/view/finance/SBDetail')
    },
    {
      path: '/finance/s/b/detail/audit',
      name: 'FinanceSBDetailAudit',
      component: () => import('@/view/finance/SBDetailAudit')
    },
    {
      path: '/finance/s/statement',
      name: 'FinanceSStatement',
      component: () => import('@/view/finance/SStatement')
    },

    /*统计*/
    {
      path: '/statistic/market',
      name: 'StatisticMarket',
      component: () => import('@/view/statistic/Market')
    },
    {
      path: '/statistic/market/class2',
      name: 'StatisticMarketClass2',
      component: () => import('@/view/statistic/MarketClass2')
    },
    {
      path: '/statistic/market/class3',
      name: 'StatisticMarketClass3',
      component: () => import('@/view/statistic/MarketClass3')
    },
    {
      path: '/statistic/market/class/item',
      name: 'StatisticMarketClassItem',
      component: () => import('@/view/statistic/MarketClassItem')
    },
    {
      path: '/statistic/market/class/item/store',
      name: 'StatisticMarketClassItemStore',
      component: () => import('@/view/statistic/MarketClassItemStore')
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
      path: '/basicdata/item/inner/tags/list',
      name: 'BasicDataItemInnerTagsList',
      component: () => import('@/view/basicdata/ItemInnerTagsList')
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
    {
      path: '/basicdata/storehouse/list',
      name: 'BasicDataStorehouseList',
      component: () => import('@/view/basicdata/StorehouseList')
    },
    {
      path: '/basicdata/warehouse/list',
      name: 'BasicDataWarehouseList',
      component: () => import('@/view/basicdata/WarehouseList')
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

let myInfo = {}, nextPage = ()=>{}, auth = {}, page = '', pageName = '';

//判断是否已登录
const getIsLogin = async ()=>{
  let res = await Http.get(Config.api.signIsLogin, {});
  if(res.code === 0){
    myInfo = res.data;
    getAuthorityList();//用户权限
  }else if(res.code === 200){
    router.replace({ name: "Login" });
  }else{
    MessageBox.alert(res.message, '提示', {
      type: 'error'
    });
  }
}

//路由跳转时是否有权限
const judgeAuth = ()=>{
  if(pageName === 'Home'){
    return true;
  }
  for(let a in auth){
    if(a === 'isAdmin'){
      return true;
    }else if(a === pageName){
      return true;
    }
  }
  return false;
}

//获取当前登录用户权限
const getAuthorityList = ()=>{
  let data = { permission_list: [] };
  if (myInfo) {
    data = myInfo;
  }
  let a = {};
  if(data.is_admin){
      a.isAdmin = true;
  }else{
      let pl = data.permission_list;
      if (pl && pl.length > 0) {
          for (let i = 0; i < pl.length; i++) {
            let p = pl[i].code;
            let url = pl[i].url;
            a[p] = url || true;
          }
      }
  }
  auth = a;
  Vue.use({
    install(Vue){
      Vue.prototype.$auth = a; //放入全局
      Vue.prototype.$myInfo = myInfo; //放入全局
    }
  });
  //如果没有权限
  if(!judgeAuth()){
    Notification.error({
      title: '提示',
      message: '您没有权限访问',
      offset: 50
    });
    //router.go(-1);
  }else{
    nextPage();
  }
}

//全局守卫
router.beforeEach((to, from, next) => {
  if(to.name !== 'Login'){
    page = to.path;
    pageName = to.name;
    nextPage = next;
    getIsLogin();
  }else{
    next();
  }
});

export default router;
