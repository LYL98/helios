import Vue from 'vue';
import Router from 'vue-router';
import { Http, Config, Method } from '@/util';
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
      component: () => import('@/view/Login')
    },

    /*商品*/
    {
      path: '/item/global',
      name: 'ItemGlobal',
      component: () => import('@/view/item/global/Main')
    },
    {
      path: '/item/recover',
      name: 'ItemRecover',
      component: () => import('@/view/item/recover/Main')
    },
    {
      path: '/item/system/class',
      name: 'ItemSystemClass',
      component: () => import('@/view/item/systemClass/Main')
    },
    {
      path: '/item/frame',
      name: 'ItemFrame',
      component: () => import('@/view/item/frame/Main')
    },
    {
      path: '/item/list',
      name: 'ItemList',
      component: () => import('@/view/item/list/Main')
    },
    {
      path: '/item/list/for/sale',
      name: 'ItemListForSale',
      component: () => import('@/view/item/listForSale/Main')
    },
    {
      path: '/item/pricing',
      name: 'ItemPricing',
      component: () => import('@/view/item/pricing/Main')
    },
    {
      path: '/item/supplier',
      name: 'ItemSupplier',
      component: () => import('@/view/item/supplier/Main')
    },
    {
      path: '/item/tags/price',
      name: 'ItemTagsPrice',
      component: () => import('@/view/item/tagsPrice/Main')
    },
    {
      path: '/item/tags',
      name: 'ItemTags',
      component: () => import('@/view/item/tags/Main')
    },
    {
      path: '/item/display/class',
      name: 'ItemDisplayClass',
      component: () => import('@/view/item/displayClass/Main')
    },
    {
      path: '/item/gpurchase',
      name: 'ItemGPurchase',
      component: () => import('@/view/item/gPurchase/Main')
    },
    {
      path: '/item/localpurchase',
      name: 'ItemLocalPurchase',
      component: () => import('@/view/item/localPurchase/Main')
    },
    {
      path: '/item/sup-distribute-plan',
      name: 'ItemSupDistributePlan',
      component: () => import('@/view/item/distribute/distribute-plan')
    },
    {
      path: '/item/sup-distribute-waybill',
      name: 'ItemSupDistributeWaybill',
      component: () => import('@/view/item/distribute/distribute-waybill')
    },

    /*业务*/
    {
      path: '/business/merchant/store/query',
      name: 'MerchantStoreQuery',
      component: () => import('@/view/business/merchant/List')
    },
    {
      path: '/business/merchant/refund/query',
      name: 'MerchantRefundQuery',
      component: () => import('@/view/business/merchantRefund/Refund')
    },
    {
      path: '/business/merchant/grade',
      name: 'MerchantGrade',
      component: () => import('@/view/business/merchantGrade/Main')
    },
    {
      path: '/business/merchant/inner/tag',
      name: 'MerchantInnerTags',
      component: () => import('@/view/business/merchantInnerTags/Main')
    },
    {
      path: '/business/merchant/outer/tag',
      name: 'MerchantOuterTags',
      component: () => import('@/view/business/merchantOuterTags/Main')
    },
    {
      path: '/business/order/list',
      name: 'OrderList',
      component: () => import('@/view/business/order/List')
    },
    {
      path: '/business/order/after_sale',
      name: 'OrderAfterSale',
      component: () => import('@/view/business/afterSale/AfterSale')
    },
    {
      path: '/business/marketing/scope/promotion/query',
      name: 'MarketingScopePromotionQuery',
      component: () => import('@/view/business/marketing/ScopePromotionList')
    },
    {
      path: '/business/marketing/coupon/query',
      name: 'MarketingCouponQuery',
      component: () => import('@/view/business/marketing/CouponList')
    },
    {
      path: '/business/banner',
      name: 'Banner',
      component: () => import('@/view/business/banner/Main')
    },
    {
      path: '/business/marketing-strategy/city',
      name: 'MarketingStrategyCity',
      component: () => import('@/view/business/marketingStrategy/city')
    },
    {
      path: '/business/marketing-strategy/step',
      name: 'MarketingStrategyStep',
      component: () => import('@/view/business/marketingStrategy/step')
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

    /*仓库*/
    {
      path: '/warehouse/quality/control',
      name: 'WarehouseQualityControl',
      component: () => import('@/view/warehouse/qualityControl/Main')
    },
    {
      path: '/warehouse/stock/pending',
      name: 'WarehouseStockPending',
      component: () => import('@/view/warehouse/stockPending/Main')
    },
    {
      path: '/warehouse/inventory',
      name: 'WarehouseInventory',
      component: () => import('@/view/warehouse/inventory/Main')
    },
    {
      path: '/warehouse/inventory/move',
      name: 'WarehouseInventoryMove',
      component: () => import('@/view/warehouse/inventoryMove/Main')
    },
    {
      path: '/warehouse/out/storage',
      name: 'WarehouseOutStorage',
      component: () => import('@/view/warehouse/outStorage/Main')
    },
    {
      path: '/warehouse/distribute',
      name: 'WarehouseDistribute',
      component: () => import('@/view/warehouse/distribute/Main')
    },
    {
      path: '/warehouse/list',
      name: 'WarehouseList',
      component: () => import('@/view/warehouse/list/Main')
    },

    /*场地*/
    {
      path: '/operate/receiving',
      name: 'OperateReceiving',
      component: () => import('@/view/operate/receiving/Main')
    },
    {
      path: '/operate/sort',
      name: 'OperateSort',
      component: () => import('@/view/operate/sort/Main')
    },
    {
      path: '/operate/truck/load',
      name: 'OperateTruckLoad',
      component: () => import('@/view/operate/truckLoad/Main')
    },
    {
      path: '/operate/truck/load/delay',
      name: 'OperateTruckLoadDelay',
      component: () => import('@/view/operate/truckLoadDelay/Main')
    },
    {
      path: '/operate/depart',
      name: 'OperateDepart',
      component: () => import('@/view/operate/depart/Main')
    },
    {
      path: '/operate/line/list',
      name: 'OperateLineList',
      component: () => import('@/view/operate/line/Main')
    },
    {
      path: '/operate/deliver',
      name: 'Deliver',
      component: () => import('@/view/operate/deliver/deliver')
    },
    {
      path: '/operate/refund/frame',
      name: 'OperateRefundFrame',
      component: () => import('@/view/operate/refundFrame/Main')
    },

    /*财务*/
    {
      path: '/finance/approve/query',
      name: 'FinanceApproveQuery',
      component: () => import('@/view/finance/approve/Main')
    },
    {
      path: '/finance/balance/query',
      name: 'FinanceBalanceQuery',
      component: () => import('@/view/finance/balance/Main')
    },
    {
      path: '/finance/s/b/detail',
      name: 'FinanceSBDetail',
      component: () => import('@/view/finance/sBDetail/Main')
    },
    {
      path: '/finance/s/b/detail/audit',
      name: 'FinanceSBDetailAudit',
      component: () => import('@/view/finance/sBDetailAudit/Main')
    },
    {
      path: '/finance/s/statement',
      name: 'FinanceSStatement',
      component: () => import('@/view/finance/sStatement/Main')
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
      path: '/statistic/client/province',
      name: 'StatisticClientProvince',
      component: () => import('@/view/statistic/ClientProvince')
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

    /*系统设置*/
    {
      path: '/system/role',
      name: 'SystemRoleList',
      component: () => import('@/view/system/role/Main')
    },
    {
      path: '/system/operator/list',
      name: 'SystemOperatorList',
      component: () => import('@/view/system/operator/Main')
    },
    {
      path: '/system/province',
      name: 'Province',
      component: () => import('@/view/system/province/Main')
    },
    {
      path: '/system/storehouse',
      name: 'Storehouse',
      component: () => import('@/view/system/storehouse/Main')
    },
    {
      path: '/system/setting',
      name: 'Setting',
      component: () => import('@/view/system/setting/Main')
    },
    {
      path: '/system/zone',
      name: 'Zone',
      component: () => import('@/view/system/zone/Main')
    },
    {
      path: '/system/city',
      name: 'City',
      component: () => import('@/view/system/city/Main')
    },
    {
      path: '/system/setting/custom',
      name: 'SettingCustom',
      component: () => import('@/view/system/settingCustom/Main')
    },
    {
      path: '/system/brand/settings',
      name: 'SystemBrandSettings',
      component: () => import('@/view/system/brandSettings/Main')
    },
  ]
});

let myInfo = {}, nextPage = ()=>{}, auth = {}, page = '', pageName = '';

//判断是否已登录
const getIsLogin = async ()=>{

  // 判断内存中，登录态是否超时
  if (myInfo.id && myInfo._tokenExpirationDate > new Date().getTime()) {

    if (judgeAuth()) {
      nextPage();
    } else {
      Notification.error({
        title: '提示',
        message: '您没有权限访问',
        offset: 50
      });
    }

    return;
  }

  myInfo = {}; // 如果内存中的登录态已经失效，则初始化登录信息。

  let res = await Http.get(Config.api.signIsLogin, {});
  if(res.code === 0){
    myInfo = res.data;
    myInfo._tokenExpirationDate = new Date().getTime() + 12 * 3600 * 1000;
    getAuthorityList();//用户权限
  }else if(res.code !== 200){
    //不包括登录已失效
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

      // $province 缓存 用户选中的区域
      // 如果为空，则默认使用权限所在区域
      // 如果为空，则该字段缓存的省code就为空
      let province = Method.getLocalStorage('globalProvince');
      Vue.prototype.$province = province.code ? province : {province_code: myInfo.province_code};
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
