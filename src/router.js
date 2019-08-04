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
    }else if(auth[a] === page){
      return true;
    }
  }
  return false;
}

//获取当前登录用户权限
const getAuthorityList = ()=>{
  let data = { permissions: [] };
  if (myInfo) {
      data = myInfo;
  }
  let a = {};
  if(data.is_admin){
      a.isAdmin = true;
  }else{
      let pl = data.permissions;
      if (pl && pl.length > 0) {
          for (let i = 0; i < pl.length; i++) {
            let p = pl[i].code;
            let url = pl[i].url;
            a[p.toLocaleLowerCase()] = url || true;
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
