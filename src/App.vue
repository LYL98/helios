<template>
  <div>
    <div id="app" v-if="pageName && pageName !== 'Login'" @click="openCloseFullScreen(true)" :style="`min-width: ${needAdaptIpad ? 950 : 1300}px;`">
      <div v-if="isInit" class="init-div"></div>
      <div id="head-div">
        <div id="logo-div" class="ellipsis" :style="`transition: width .2s; ${isHideMenu && 'width: 54px;'}`">
          {{ !isHideMenu ? globalBrand.brand_name + '运营中心' : '' }}
        </div>
        <div class="global-province" v-if="pageName && pageName !== 'Login'">
          <my-global-province/>
        </div>
        <el-dropdown trigger="click" placement="bottom" class="f-r login-username" @command="clickDropdown">
          <div style="display: flex; align-items: center;">
            <img v-if="loginInfo.avatar && loginInfo.avatar !== ''" :src="tencentPath + loginInfo.avatar" alt="avatar" width="24" height="24" style="margin-right: 8px; border-radius: 12px">
            <img v-else src="@/assets/img/default_avatar.png" alt="avatar" width="24" height="24" style="margin-right: 8px; border-radius: 12px">
            {{loginInfo.realname}}
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="content-div">
        <div id="nav-menu-div"
             :style="`transition: width .2s;height: ${windowHeight - 42}px;${isHideMenu && 'width: 54px;'}`">
          <div id="menu-div" :style="`height: ${windowHeight - 42}px;`">
            <el-menu
              router
              unique-opened
              :default-active="pageName"
              :collapse="isHideMenu"
              menu-trigger="click"
              background-color="#20232C"
              :mode="isHideMenu ? 'horizontal':'vertical'"
              style="border-right: 0"
              text-color="#fff"
              active-text-color="#00ADE7"
            >
              <el-menu-item class="home" index="Home" :route="{name: 'Home'}" v-if="auth.isAdmin || auth.Home">
                <i class="iconfont menu-icon">&#xe751;</i>
                <span style="margin-left: 10px;">首页</span>
              </el-menu-item>

              <el-submenu index="Merchant" v-if="auth.isAdmin || auth.Merchant">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe736;</i>
                  <span>客户</span>
                </template>
                <el-menu-item index="MerchantStoreQuery" :route="{name: 'MerchantStoreQuery'}"
                              v-if="auth.isAdmin || auth.MerchantStoreQuery"><span>门店列表</span></el-menu-item>
                <el-menu-item index="MerchantRefundQuery" :route="{name: 'MerchantRefundQuery'}"
                              v-if="auth.isAdmin || auth.MerchantRefundQuery"><span>门店框信息</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Purchase" v-if="auth.isAdmin || auth.Purchase">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe64b;</i>
                  <span>采购</span>
                </template>
                <el-menu-item index="PurchaseSupplierQuery" :route="{name: 'PurchaseSupplierQuery'}"
                              v-if="auth.isAdmin || auth.PurchaseSupplierQuery"><span>供应商管理</span></el-menu-item>
                <el-menu-item index="PurchaseItemQuery" :route="{name: 'PurchaseItemQuery'}"
                              v-if="auth.isAdmin || auth.PurchaseItemQuery"><span>采购商品管理</span></el-menu-item>
                <el-menu-item index="PurchaseWarehouseQuery" :route="{name: 'PurchaseWarehouseQuery'}"
                              v-if="auth.isAdmin || auth.PurchaseWarehouseQuery"><span>采购仓管审核</span></el-menu-item>
                <el-menu-item index="PurchaseFinanceQuery" :route="{name: 'PurchaseFinanceQuery'}"
                              v-if="auth.isAdmin || auth.PurchaseFinanceQuery"><span>采购财务审核</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Item" v-if="auth.isAdmin || auth.Item">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe73e;</i>
                  <span>商品</span>
                </template>
                <el-menu-item index="ItemList" :route="{name: 'ItemList'}" v-if="auth.isAdmin || auth.ItemList"><span>商品列表</span>
                </el-menu-item>
                <el-menu-item index="ItemPricing" :route="{name: 'ItemPricing'}"
                              v-if="auth.isAdmin || auth.ItemPricing"><span>每日报价</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Marketing" v-if="auth.isAdmin || auth.Marketing">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe64c;</i>
                  <span>营销</span>
                </template>
                <el-menu-item index="MarketingScopePromotionQuery" :route="{name: 'MarketingScopePromotionQuery'}"
                              v-if="auth.isAdmin || auth.MarketingScopePromotionQuery"><span>全场营销</span></el-menu-item>
                <el-menu-item index="MarketingCouponQuery" :route="{name: 'MarketingCouponQuery'}"
                              v-if="auth.isAdmin || auth.MarketingCouponQuery"><span>优惠券</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Group" v-if="auth.isAdmin || auth.Group">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe652;</i>
                  <span>团购</span>
                </template>
                <el-menu-item index="GroupBuyQuery" :route="{name: 'GroupBuyQuery'}"
                              v-if="auth.isAdmin || auth.GroupBuyQuery"><span>商品列表</span></el-menu-item>
                <el-menu-item index="GroupHeadQuery" :route="{name: 'GroupHeadQuery'}"
                              v-if="auth.isAdmin || auth.GroupHeadQuery"><span>团购门店</span></el-menu-item>
                <el-menu-item index="GroupMemberQuery" :route="{name: 'GroupMemberQuery'}"
                              v-if="auth.isAdmin || auth.GroupMemberQuery"><span>团员列表</span></el-menu-item>
                <el-menu-item index="GroupOrderQuery" :route="{name: 'GroupOrderQuery'}"
                              v-if="auth.isAdmin || auth.GroupOrderQuery"><span>订单列表</span></el-menu-item>
                <el-menu-item index="GroupBuyStatement" :route="{name: 'GroupBuyStatement'}"
                              v-if="auth.isAdmin || auth.GroupBuyStatement"><span>团购统计</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Order" v-if="auth.isAdmin || auth.Order">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe737;</i>
                  <span>订单</span>
                </template>
                <el-menu-item index="OrderList" :route="{name: 'OrderList'}" v-if="auth.isAdmin || auth.OrderList">
                  <span>订单列表</span></el-menu-item>
                <el-menu-item index="OrderAfterSale" :route="{name: 'OrderAfterSale'}"
                              v-if="auth.isAdmin || auth.OrderAfterSale"><span>售后列表</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Operate" v-if="auth.isAdmin || auth.Operate">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe75f;</i>
                  <span>配送</span>
                </template>
                <el-menu-item index="OperateReceiving" :route="{name: 'OperateReceiving'}"
                              v-if="auth.isAdmin || auth.OperateReceiving"><span>收货</span></el-menu-item>
                <el-menu-item index="OperateLineList" :route="{name: 'OperateLineList'}"
                              v-if="auth.isAdmin || auth.OperateLineList"><span>线路规划</span></el-menu-item>
                <el-menu-item index="OperateRefundFrame" :route="{name: 'OperateRefundFrame'}"
                              v-if="auth.isAdmin || auth.OperateRefundFrame"><span>退框</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Finance" v-if="auth.isAdmin || auth.Finance">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe64e;</i>
                  <span>财务</span>
                </template>
                <el-menu-item index="FinanceBalanceQuery" :route="{name: 'FinanceBalanceQuery'}"
                              v-if="auth.isAdmin || auth.FinanceBalanceQuery"><span>客户财务管理</span></el-menu-item>
                <el-menu-item index="FinanceApproveQuery" :route="{name: 'FinanceApproveQuery'}"
                              v-if="auth.isAdmin || auth.FinanceApproveQuery"><span>财务审核</span></el-menu-item>
              </el-submenu>

              <el-submenu index="Statistic" v-if="auth.isAdmin || auth.Statistic">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe7ab;</i>
                  <span>统计</span>
                </template>
                <el-menu-item index="StatisticMarket" :route="{name: 'StatisticMarket'}"
                              v-if="auth.isAdmin || auth.StatisticMarket"><span>商品销售统计</span></el-menu-item>
                <el-menu-item index="StatisticClient" :route="{name: 'StatisticClient'}"
                              v-if="auth.isAdmin || auth.StatisticClient"><span>客户订单统计</span></el-menu-item>
                <el-menu-item index="StatisticOperation" :route="{name: 'StatisticOperation'}"
                              v-if="auth.isAdmin || auth.StatisticOperation"><span>运营统计</span></el-menu-item>
                <el-menu-item index="StatisticExportPrint" :route="{name: 'StatisticExportPrint'}"
                              v-if="auth.isAdmin || auth.StatisticExportPrint"><span>导出、打印</span></el-menu-item>
                <el-menu-item index="BusinessOperationStatement" :route="{name: 'BusinessOperationStatement'}"
                              v-if="auth.isAdmin || auth.BusinessOperationStatement"><span>业务运营报表</span></el-menu-item>
                <el-menu-item index="ItemOperationStatement" :route="{name: 'ItemOperationStatement'}"
                              v-if="auth.isAdmin || auth.ItemOperationStatement"><span>商品运营报表</span></el-menu-item>
              </el-submenu>

              <el-submenu index="BasicData" v-if="auth.isAdmin || auth.BasicData">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe73b;</i>
                  <span>信息</span>
                </template>
                <el-menu-item index="BasicDataSystemClassList" :route="{name: 'BasicDataSystemClassList'}"
                              v-if="auth.isAdmin || auth.BasicDataSystemClassList"><span>科学分类列表</span></el-menu-item>
                <el-menu-item index="BasicDataDisplayClassList" :route="{name: 'BasicDataDisplayClassList'}"
                              v-if="auth.isAdmin || auth.BasicDataDisplayClassList"><span>展示分类列表</span></el-menu-item>
                <el-menu-item index="BasicDataFrameList" :route="{name: 'BasicDataFrameList'}"
                              v-if="auth.isAdmin || auth.BasicDataFrameList"><span>框信息列表</span></el-menu-item>
                <el-menu-item index="BasicDataItemTagsList" :route="{name: 'BasicDataItemTagsList'}"
                              v-if="auth.isAdmin || auth.BasicDataItemTagsList"><span>商品标签列表</span></el-menu-item>
                <el-menu-item index="BasicDataProvinceList" :route="{name: 'BasicDataProvinceList'}"
                              v-if="auth.isAdmin || auth.BasicDataProvinceList"><span>省列表</span></el-menu-item>
                <el-menu-item index="BasicDataZoneList" :route="{name: 'BasicDataZoneList'}"
                              v-if="auth.isAdmin || auth.BasicDataZoneList"><span>片区列表</span></el-menu-item>
                <el-menu-item index="BasicDataCityList" :route="{name: 'BasicDataCityList'}"
                              v-if="auth.isAdmin || auth.BasicDataCityList"><span>县域列表</span></el-menu-item>
                <el-menu-item index="BasicDataGradeList" :route="{name: 'BasicDataGradeList'}"
                              v-if="auth.isAdmin || auth.BasicDataGradeList"><span>商户等级列表</span></el-menu-item>
                <el-menu-item index="BasicDataMerchantInnerTagsList" :route="{name: 'BasicDataMerchantInnerTagsList'}"
                              v-if="auth.isAdmin || auth.BasicDataMerchantInnerTagsList"><span>商户内标签列表</span>
                </el-menu-item>
                <el-menu-item index="BasicDataMerchantOuterTagsList" :route="{name: 'BasicDataMerchantOuterTagsList'}"
                              v-if="auth.isAdmin || auth.BasicDataMerchantOuterTagsList"><span>商户外标签列表</span>
                </el-menu-item>
                <el-menu-item index="BasicDataItemCommonDescription" :route="{name: 'BasicDataItemCommonDescription'}"
                              v-if="auth.isAdmin || auth.BasicDataItemCommonDescription"><span>商品统一描述</span>
                </el-menu-item>
              </el-submenu>

              <el-submenu index="System" v-if="auth.isAdmin || auth.System">
                <template slot="title">
                  <i class="iconfont menu-icon">&#xe74c;</i>
                  <span>设置</span>
                </template>
                <el-menu-item index="SystemRoleList" :route="{name: 'SystemRoleList'}"
                              v-if="auth.isAdmin || auth.SystemRoleList"><span>角色列表</span></el-menu-item>
                <el-menu-item index="SystemOperatorList" :route="{name: 'SystemOperatorList'}"
                              v-if="auth.isAdmin || auth.SystemOperatorList"><span>运营人员列表</span></el-menu-item>
                <el-menu-item index="SystemSetting" :route="{name: 'SystemSetting'}"
                              v-if="auth.isAdmin || auth.SystemSetting"><span>运营配置</span></el-menu-item>
                <el-menu-item index="SystemBannerList" :route="{name: 'SystemBannerList'}"
                              v-if="auth.isAdmin || auth.SystemBannerList"><span>Banner管理</span></el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <div
            id="show-hide-menu"
            @click="toggerShowHideMenu"
            :style="`transition: width .2s; ${isHideMenu && 'left: 52px;'}`">
            <img v-if="isHideMenu" src="@/assets/img/menu-open.png">
            <img v-else src="@/assets/img/menu-close.png">
          </div>
        </div>
        <div id="router-view-div" :style="`height: ${windowHeight - 42}px; min-width: ${needAdaptIpad ? 770 : 1100}px;`">
          <router-view/>
        </div>
      </div>
    </div>
    <div v-else id="app">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Loading,
    Notification,
    MessageBox
  } from 'element-ui';
  import {Config, Method, DataHandle} from '@/util';
  import {GlobalProvince, PwdModify} from '@/common';

  let LoadingInstance;

  export default {
    name: 'app',
    data() {
      let appSetting = Method.getPageSetting('App'); //获取页面设置

      let isPad = false; //判断是否安卓
      let ua = navigator.userAgent;
      if (ua.indexOf('Android') > 0 || ua.indexOf('iPad') > 0) {
        isPad = true;
      }
      let name = this.$router.history.current.name;
      return {
        tencentPath: Config.tencentPath,
        isHideMenu: appSetting.isHideMenu ? true : false,
        menuIndex: 1,
        menuSubIndex: 0,
        pageName: name,
        isPad: isPad,
        isInit: true
      }
    },
    components: {
      'el-menu': Menu,
      'el-submenu': Submenu,
      'el-menu-item': MenuItem,
      'el-menu-item-group': MenuItemGroup,
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'my-global-province': GlobalProvince
    },
    created() {
      this.getBrand();
      let that = this;
      //that.judgeIsLogin();//判断是否登录
      let WH = DataHandle.getWindowHeight();
      that.windowInnerHeight(WH);
      window.onresize = () => {
        let WH = DataHandle.getWindowHeight();
        let WH2 = DataHandle.getWindowScreenHeight();
        let {isPad} = that;
        that.windowInnerHeight(Method.isFullScreen() ? WH2 : WH);
      };
    },
    computed: {
      ...mapGetters({
        loading: 'loading',
        message: 'message',
        loginInfo: 'loginInfo',
        auth: 'globalAuth',
        windowHeight: 'windowHeight',
        globalBrand: 'globalBrand',
      }),
      needAdaptIpad: {
        get() {
          return this.isPad && ['ItemPricing', 'OperateReceiving'].some(item => item === this.$data.pageName);
        }
      }
    },
    methods: {
      //判断登录
      judgeIsLogin() {
        let that = this;
        let pageName = that.$router.history.current.name;
        that.$data.pageName = pageName;
        if (pageName !== 'Login') {
          that.isLogin((data, state) => {
            if (state === 'success') {
              let {isInit} = this;
              if (isInit) that.$data.isInit = false;

              Method.setLocalStorage('appleLoginInfo', data);
              that.getAuthorityList();//用户权限
            }
          });
        }
      },
      //获取当前登录用户权限
      getAuthorityList() {
        let that = this;
        let {pageName, loginInfo} = that;
        let data = {permission_list: []};
        if (loginInfo) data = loginInfo;
        let auth = {};
        if (data.is_admin) {
          auth.isAdmin = true;
        } else {
          let pl = data.permission_list;
          if (pl && pl.length > 0) {
            for (let i = 0; i < pl.length; i++) {
              let p = pl[i].code;
              if (p) auth[p] = true;
            }
          }
        }
        that.setGlobalAuth(auth);//设置全局权限
        Method.setSessionStorage('appleGlobalAuth', auth); //缓存

        //如果没有权限
        if (!that.judgeAuth()) {
          Notification.error({
            title: '提示',
            message: '您没有权限访问',
            offset: 50
          });
          that.$router.go(-1);
        }
      },
      //路由跳转时是否有权限
      judgeAuth() {
        let that = this;
        let {pageName, auth} = that;

        if (pageName === 'Home') {
          return true;
        }

        for (let a in auth) {
          if (a === 'isAdmin' || a === pageName) {
            return true;
          }
        }

        return false;
      },
      //下拉菜单
      clickDropdown(command) {
        let that = this;
        if (command === 'loginOut') {
          MessageBox.confirm('您确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.loginLoginOut(() => {
              that.openCloseFullScreen(false); //退出全屏
              window.location.replace('/');
            });
          })
            .catch(() => {
              // console.log('取消');
            });
        } else if (command === 'editPassword') {
          PwdModify.show(); //修改密码
        }
      },
      //全屏
      openCloseFullScreen(isFull) {
        let that = this;
        let {isPad} = that;
        if (isPad) {
          isFull ? Method.openFullScreen() : Method.closeFullScreen();
        }
      },
      //显示或隐藏菜单
      toggerShowHideMenu() {
        this.$data.isHideMenu = !this.$data.isHideMenu;
        Method.setPageSetting('App', {isHideMenu: this.$data.isHideMenu});
      },
      ...mapActions(['isLogin', 'loginLoginOut', 'setGlobalAuth', 'windowInnerHeight', 'getBrand'])
    },
    watch: {
      //监听路由变化
      $route() {
        this.judgeIsLogin();//判断是否登录
      },
      globalBrand(a, b) {
        if (a.brand_name) {
          documentTitle(`${a.brand_name}运营中心`);
          localStorage.setItem('globalBrand', JSON.stringify(a))
        }
      },
      //监听message变化
      message(a, b) {
        if (a.type === 'error') {
          MessageBox.alert(a.message, a.title, {
            type: 'error'
          });
        } else {
          Notification[a.type]({
            title: a.title,
            message: a.message,
            offset: 50
          });
        }
      },
      //监听loading变华
      loading(a, b) {
        if (a.isShow && a.isWhole) {
          LoadingInstance = Loading.service({
            background: 'rgba(255, 255, 255, 0.2)'
          });
        } else {
          LoadingInstance && LoadingInstance.close();
        }
      }
    }
  }

</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-width: 1300px;
    box-sizing: border-box;
    > .init-div {
      background: #fff;
      position: fixed;
      z-index: 2;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }
  }

  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }

  body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, div, dl, dt, dd, ul, ol, li, pre, form, fieldset, lengend, button, input, textarea, th, td {
    margin: 0;
    padding: 0;
  }

  /*body*/
  body {
    font: 14px "Microsoft YaHei", 微软雅黑, "Arail"; /* letter-spacing: 1px; */
    background: #fff;
  }

  fieldset, img {
    border: 0;
  }

  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #b2b2b2;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #b2b2b2;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #b2b2b2;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #b2b2b2;
  }

  ::-ms-clear {
    display: none;
  }

  ::-ms-reveal {
    display: none;
  }

  .remove-scrollbar::-webkit-scrollbar {
    width: 0px
  }

  /*去除滚动条,依然可滚动*/
  input, button, select, textarea {
    outline: none;
  }

  ul, li {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    color: $--color-primary;
  }

  a:active {
    opacity: 0.7;
  }

  #nav-menu-div ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    thead {
      font-size: 14px;
    }
  }

  /* 定义省略文本的全局样式 */
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*链接样式*/
  .link-active:active {
    background: #f3f4f6;
  }

  /*字体大小*/
  .f-s8 {
    font-size: 8px !important;
  }

  .f-s10 {
    font-size: 10px !important;
  }

  .f-s11 {
    font-size: 11px !important;
  }

  .f-s12 {
    font-size: 12px !important;
  }

  .f-s13 {
    font-size: 13px !important;
  }

  .f-s14 {
    font-size: 14px !important;
  }

  .f-s16 {
    font-size: 16px !important;
  }

  .f-s18 {
    font-size: 18px !important;
  }

  .f-s20 {
    font-size: 20px !important;
  }

  .f-s24 {
    font-size: 24px !important;
  }

  .f-s28 {
    font-size: 28px !important;
  }

  .f-s30 {
    font-size: 30px !important;
  }

  .f-s32 {
    font-size: 32px !important;
  }

  .f-s36 {
    font-size: 36px !important;
  }

  .main-padding {
    padding: 0 15px;
  }

  .f-l {
    float: left;
  }

  .f-r {
    float: right;
  }

  .t-l {
    text-align: left;
  }

  .t-c {
    text-align: center;
  }

  .t-r {
    text-align: right;
  }

  .over-h {
    overflow: hidden;
  }

  .d-b {
    display: block;
  }

  .b-b-b {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .b-c-fff {
    background-color: #fff;
  }

  /*文本自动换行*/
  .pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }

  /*不换行*/
  .no-pre {
    white-space: nowrap;
  }

  /*文字太宽加....*/
  .add-dot {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .add-dot2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  @font-face {
    font-family: 'iconfont';  /* project id 789867 */
    src: url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.eot');
    src: url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.woff') format('woff'),
    url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_789867_hsq6v2egcsq.svg#iconfont') format('svg');
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  #head-div {
    background-color: #fff;
    height: 42px;
    color: #5A5D64;

    #logo-div {
      height: 42px;
      line-height: 42px;
      width: 180px;
      background-color: #00ADE7;
      float: left;
      text-align: center;
      font-size: 18px;
      font-weight: 900;
      color: #fff;
    }

    /*全局省份*/
    .global-province {
      float: left;
      margin-left: 16px;
    }

    .login-username {
      height: 42px;
      line-height: 42px;
      cursor: pointer;
      margin-right: 60px;
    }
  }

  /* 自定义form表单中，由自定义验证规则引发的, 添加必选标记！ */
  .required .el-form-item__label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }

  /* 当宽度超过设定值时，自动换行 */
  .el-popover--plain {
    word-wrap: break-word;
  }

  /* 自定义状态标签tag的类名 regular */
  .el-tag--regular {
    color: #73767D !important;
    background-color: rgba(115, 118, 125, 0.15) !important;
    border-color: rgba(115, 118, 125, 0.25) !important;
  }

  /* 重绘 tabs 选项卡 在 type="border-card" 时的样式 */
  .custom-tabs {
    background: transparent !important;
    border: 0 !important;
    &.el-tabs--border-card {
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    .el-tabs__content {
      padding: 0 !important;
    }
    .el-tabs__header {
      background-color: transparent !important;
      border-bottom: 0 !important;
      .el-tabs__item {
        border: 0 !important;
        font-size: 12px !important;
      }
    }
  }

  .custom-form{
    .el-form-item__label{
      color: #909399 !important;
      font-size: 14px !important;
    }
  }

  .custom-form-operating-config{
    .el-form-item__label {
      color: #73767D !important;
      font-size: 12px !important;
    }
  }

  .custom-form-detail {
    .el-form-item__label{
      color: #909399 !important;
      font-size: 14px !important;
    }
    .el-form-item{
      margin-bottom: 0 !important;
    }
  }

  .custom-input{
    .el-input__inner {
      border-color: red !important;
    }
  }

  .custom-collapse{
    border: none !important;
    .el-collapse-item__wrap{
      border: none !important;
    }
    .el-collapse-item__header {
      border: none !important;
      line-height: 28px;
      font-size: 12px;
      font-weight: normal;
      height: 28px;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }

  .custom-table-row{
    height: 44px !important;
  }

  .custom-statistics-tabs{
    .el-tabs__header{
      background: white;
      margin: 0;
    }
    .el-tabs__nav{
      margin-left: 20px;
      .el-tabs__item{
        font-size: 12px;
        color: #5A5D64;
      }
      .el-tabs__item.is-active {
        color: #00ADE7 !important;
        font-weight: 700;
        font-size: 14px;
      }
      .el-tabs__active-bar{
        height: 1px !important;
      }
    }
    .el-tabs__nav-wrap::after{
      height: 1px
    }
  }

  .dialog-query-item-date{
    .el-range-input{
      width: 60% !important;
    }
    .el-range-separator{
      padding: 0 4px !important;
    }
  }

  //筛选区响应式 start------------------------------
  .custom-el-button{
    padding: 9px 10px !important;
  }

  .query-item-reset{
    margin-left: 20px !important;
  }
  .query-item-reset-offset{
    margin-left: -70px !important;
  }
  .query-item-input{
    width: 270px !important;
  }
  .query-item-select{
    .el-input__inner{
      width: 270px !important;
    }
  }
  .query-item-date{
    min-width: 270px;
    max-width: 270px;
    .el-range-input{
      width: 60% !important;
    }
    .el-range-separator{
      padding: 0 4px !important;
    }
  }
  .query-item-button-group{
    min-width: 270px;
  }

  .query-item-button{
    width: 90px
  }
  @media only screen and (max-width: 1500px) {
    .query-item-reset{
      margin-left: 12px !important;
    }
    .query-item-reset-offset{
      margin-left: -58px !important;
    }
    .query-item-input{
      width: 210px !important;
    }
    .query-item-select{
      .el-input__inner{
        width: 210px !important;
      }
    }
    .query-item-date{
      min-width: 210px;
      max-width: 210px;
      .el-range-input{
        width: 50% !important;
      }
      .el-range-separator{
        padding: 0 4px !important;
      }
      .el-range__close-icon{
        width: 6px !important;
      }
    }
    .query-item-button-group{
      min-width: 210px;
    }
    .query-item-button {
      width: 70px
    }
  }

  @media only screen and (min-width: 1500px) {
    .query-item-input{
      width: 225px !important;
    }
    .query-item-select{
      .el-input__inner{
        width: 225px !important;
      }
    }
    .query-item-date{
      min-width: 225px;
      max-width: 225px;
    }
    .query-item-button-group{
      min-width: 225px;
    }
    .query-item-button {
      width: 75px
    }
  }

  @media only screen and (min-width: 1750px) {
    .query-item-input{
      width: 240px !important;
    }
    .query-item-select{
      .el-input__inner{
        width: 240px !important;
      }
    }
    .query-item-date{
      min-width: 240px;
      max-width: 240px;
    }
    .query-item-button-group{
      min-width: 240px;
    }
    .query-item-button {
      width: 80px
    }
  }

  @media only screen and (min-width: 1920px) {
    .query-item-input{
      width: 270px !important;
    }
    .query-item-select{
      .el-input__inner{
        width: 270px !important;
      }
    }
    .query-item-date{
      min-width: 270px;
      max-width: 270px;
    }
    .query-item-button-group{
      min-width: 270px;
    }

    .query-item-button{
      width: 90px
    }
  }

  //筛选区响应式 end------------------------------

  #content-div {
    display: flex;
    background-color: #f7f7f8;
    #nav-menu-div {
      flex: initial;
      width: 180px;
      background-color: #20232C;
      position: relative;

      #menu-div {
        overflow-y: auto;
        overflow-x: hidden;
      }

      i {
        color: #fff;
      }

      li.el-submenu {
        background-color: #101116 !important;

        span {
          margin-left: 6px;
        }

        .el-menu-item.is-active {
          padding-left: 0px !important;
        }

        .el-menu-item.is-active::before {
          content: '';
          display: inline-block;
          height: 18px;
          border-left: 4px solid #00ADE7;
        }

        .el-menu-item.is-active span {
          margin-left: 40px !important;
        }

        .el-menu--popup {
          width: 180px !important;
        }
      }

      li.el-menu-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #2B2F39 !important;
        width: 180px;
        span {
          margin-left: 4px;
        }
      }

      li.el-menu-item.home {
        background-color: #20232C !important;
      }

      li.el-menu-item:hover {
        background-color: #050507 !important;
      }

      #show-hide-menu {
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 12px;
        height: 76px;
        background-color: #20232C;
        border-radius: 0 20px 20px 0;
        position: absolute;
        top: 44vh;
        left: 178px;
      }

      .el-menu--horizontal {
        border-bottom: 0;
      }
    }

    #router-view-div {
      flex: 1;
      padding: 16px;
      min-width: 1120px;
      box-sizing: border-box;
      .breadcrumb {
        padding: 0px 16px;
        /*background-color: #fff;*/
      }
      .query {
        font-size: 12px;
        padding: 16px 16px;
        margin-bottom: 16px;
        background-color: #fff;
      }
      .operate {
        text-align: right;
        padding: 0 16px;
        margin-bottom: 16px;
      }
      .operate.space-between {
        display: flex;
        justify-content: space-between;
      }
      .footer {
        padding: 8px 20px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  //共用价格颜色
  .price {
    color: #ff5252;
  }

  .color-red {
    color: #ff3724;
  }

  .color-green {
    color: #00d600;
  }

  //共用右边选择菜单
  .right-select-item-body {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .3);

    .right-select-item {
      position: fixed;
      top: 0;
      right: 0px;
      bottom: 0;
      background: #fff;
      width: 260px;
      animation: right-select-menu .3s;
      -webkit-animation: right-select-menu .3s;

      .title {
        border-bottom: 1px solid #f3f4f6;
        color: #999;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
      }

      .content {
        position: absolute;
        overflow-y: auto;
        top: 41px;
        bottom: 47px;
        width: 260px;
      }

      .bottom {
        position: absolute;
        bottom: 0;
        width: 240px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f3f4f6;
        padding: 0 10px;
        height: 46px;
        line-height: 46px;

        div {
          flex: 1;
          text-align: center;

          button {
            width: 100%;
          }
        }

        .interval {
          flex: initial !important;
          width: 10px;
        }
      }
    }
  }


  @keyframes right-select-menu {
    from {
      right: -260px;
    }
    to {
      right: 0px;
    }
  }

  @-webkit-keyframes right-select-menu {
    from {
      right: -260px;
    }
    to {
      right: 0px;
    }
  }

  /*背景平铺及居中*/
  .b-b-b {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  /*穿梭框*/
  .el-transfer-panel__list {
    .el-transfer-panel__item {
      display: block !important;
      margin-left: 0px !important;
    }
  }

  .el-transfer-panel__filter {
    width: auto !important;
  }

  /*.el-transfer__button {
      display: block !important;
      margin: 0 auto !important;
      padding: 10px !important;
      border-radius: 50% !important;
      color: #fff !important;
      font-size: 0 !important;
    }*/

  /*我的弹层*/
  .my-dialog {
    .el-dialog {
      width: 97%;
      min-width: 840px;
      margin: 20px auto 0 !important;

      .el-dialog__body {
        padding: 0 20px;
      }
    }
  }

  .el-dialog__wrapper {
    height: 100%;
  }

  .el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 500;
  }

  .el-dialog__body {
    padding-top: 20px;
  }

  /*共用搜索表单*/
  .form-search {
    padding: 15px 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ececec;
    overflow: hidden;
    background: #fff;
  }

  /*共用表格头部*/
  .table-head {
    margin-bottom: 10px;
  }

  /*共用表格操作按钮*/
  .optionButton > i {
    margin-right: 5px;
    cursor: pointer;
  }

  .optionButton > a {
    font-size: 12px;
    color: $--color-primary;
    cursor: pointer;
    display: block;
  }

  .table-action {
    display: flex;

    li + li {
      margin-left: 5px;
    }

    a {
      font-size: 12px;
      text-decoration: underline;
    }

    a:hover {
      font-weight: 900;
    }
  }

  /*共用表格底部操作及分页*/
  .table-bottom {
    padding-top: 12px;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
  }

  .table-pagination {
    text-align: right;
    flex: 1;
  }

  .load-more {
    text-align: center;
    color: #999;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
  }

  .load-none {
    text-align: center;
    color: #999;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-top: 48px;
  }

  .el-table.list-table {
    padding: 0 20px;
    background-color: #fff;
  }

  .el-table .highlight-row {
    /* 旧语法，带前缀并且已经废弃，以支持老版本的浏览器 */
    /*background: -prefix-linear-zgradient(top, #FBFBFD, #F4F4F9);*/

    /* 新语法，不带前缀，以支持标准兼容的浏览器（Opera 12.1， IE 10， Firefox 16， Chrome 26， Safari 6.1） */
    background: linear-gradient(to bottom, #FBFBFD, #F4F4F9);
  }
  .el-table .stripe-row {
    /*background: #f9f9f9;*/
    background: #FBFBFD;
  }
  .el-table .default-row {
    background: #fff;
  }

  .el-table .el-table__row {
    border: none;
  }

  .el-table td, .el-table th.is-leaf {
     border-bottom: none !important;
  }

  .statistics-table-list-container{
    background: #fff;
    padding: 0 20px;
  }

  .custom-breadcrumb{
    .el-breadcrumb__inner {
      font-weight: 700 !important;
      /*text-decoration: none;*/
      /*-webkit-transition: color .2s cubic-bezier(.645,.045,.355,1);*/
      /*transition: color .2s cubic-bezier(.645,.045,.355,1);*/
      color: #303133 !important;

      /*color: #606266;*/
    }
    .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a {
      font-weight: normal !important;
      text-decoration: none !important;
      color: #606266 !important;
    }
  }

</style>
