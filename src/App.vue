<template>
  <div id="app-body">
    <div id="app" v-if="pageName !== 'Login'" style="min-width: 1000px;">
      <div id="head-div">
        <div id="logo-div" class="ellipsis">
          {{brand.brand_name + '运营中心'}}
        </div>
        <div class="global-province" v-if="pageName !== 'Login'">
          <my-global-province/>
        </div>
        <el-dropdown trigger="click" placement="bottom" class="f-r login-username" @command="clickDropdown">
          <div style="display: flex; align-items: center;">
            <img v-if="myInfo.avatar && myInfo.avatar !== ''" :src="tencentPath + myInfo.avatar" alt="avatar" width="24" height="24" style="margin-right: 8px; border-radius: 12px">
            <img v-else src="@/assets/img/default_avatar.png" alt="avatar" width="24" height="24" style="margin-right: 8px; border-radius: 12px">
            {{myInfo.realname}}
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="nav-menu-div">
        <div id="menu-div">
          <el-menu
            router
            unique-opened
            :default-active="pageName"
            menu-trigger="click"
            background-color="#262626"
            style="border-right: 0"
            text-color="#bbb"
            active-text-color="#00ADE7"
          >
            <el-menu-item class="home" index="Home" :route="{name: 'Home'}" v-if="auth.isAdmin || auth.Home">
              <i class="iconfont menu-icon">&#xe751;</i>
              <span>首页</span>
            </el-menu-item>

            <!--动态菜单-->
            <template v-for="(item, index) in menus">
              <el-submenu :index="item.name" :key="index" v-if="auth.isAdmin || auth[item.name]">
                <template slot="title">
                  <i class="iconfont menu-icon" v-html="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <template v-for="(m, i) in item.children">
                  <el-menu-item :index="m.name" :key="i" :route="{name: m.name}" v-if="auth.isAdmin || auth[m.name]"><span>{{m.title}}</span></el-menu-item>
                </template>
              </el-submenu>
            </template>

          </el-menu>
        </div>
      </div>
      <div id="router-view-div" style="min-width: 1000px;">
        <router-view/>
      </div>
    </div>
    <div v-else>
      <router-view/>
    </div>
    <!--回到顶部-->
    <el-backtop :right="5" :bottom="84"><i class="el-icon-caret-top"></i></el-backtop>
  </div>
</template>

<script>
  import { Menu, Submenu, MenuItem, MenuItemGroup, Dropdown, DropdownMenu, DropdownItem, Notification, MessageBox, Backtop} from 'element-ui';
  import {Http, Config, Method, DataHandle} from '@/util';
  import {GlobalProvince, PwdModify} from '@/component';

  export default {
    name: 'app',
    data() {
      let name = this.$router.history.current.name;
      return {
        brand: {
          brand_name: '',
          brand_icon: ''
        },
        tencentPath: Config.tencentPath,
        menus:[{
          title: '客户',
          icon: '&#xe736;',
          name: 'Merchant',
          children: [{
            title: '门店列表',
            name: 'MerchantStoreQuery'
          },{
            title: '门店筐信息',
            name: 'MerchantRefundQuery'
          }]
        },{
          title: '商品',
          icon: '&#xe73e;',
          name: 'Item',
          children: [{
            title: '商品池',
            name: 'ItemGlobal'
          },{
            title: '商品列表',
            name: 'ItemList'
          },{
            title: '每日报价',
            name: 'ItemPricing'
          },{
            title: '商品价格标签审核',
            name: 'ItemAuditInnerTag'
          },{
            title: '回收站',
            name: 'ItemRecover'
          }]
        },{
          title: '营销',
          icon: '&#xe64c;',
          name: 'Marketing',
          children: [{
            title: '全场营销',
            name: 'MarketingScopePromotionQuery'
          },{
            title: '优惠券',
            name: 'MarketingCouponQuery'
          }]
        },{
          title: '订单',
          icon: '&#xe737;',
          name: 'Order',
          children: [{
            title: '订单列表',
            name: 'OrderList'
          },{
            title: '售后列表',
            name: 'OrderAfterSale'
          }]
        },{
          title: '采购',
          icon: '&#xe736;',
          name: 'Purchase',
          children: [{
            title: '统采订单',
            name: 'SupplierGPurchase'
          },{
            title: '地采订单',
            name: 'SupplierLocalPurchase'
          }]
        },{
          title: '供应商',
          icon: '&#xe736;',
          name: 'Supplier',
          children: [{
            title: '供应商列表',
            name: 'SupplierList'
          }]
        },{
          title: '团购',
          icon: '&#xe652;',
          name: 'Group',
          children: [{
            title: '团购活动',
            name: 'GroupActivity'
          },{
            title: '商品列表',
            name: 'GroupItem'
          },{
            title: '用户订单',
            name: 'GroupOrderQuery'
          },{
            title: '门店订单',
            name: 'GroupStoreOrder'
          },{
            title: '团购门店',
            name: 'GroupHeadQuery'
          },{
            title: '团员列表',
            name: 'GroupMemberQuery'
          },{
            title: '团购统计',
            name: 'GroupBuyStatement'
          },{
            title: '商品分类',
            name: 'GroupItemClass'
          },{
            title: '回收站',
            name: 'GroupItemRecoverList'
          },{
            title: 'Banner管理',
            name: 'GroupBanner'
          }]
        },{
          title: '仓库',
          icon: '&#xe75f;',
          name: 'Warehouse',
          children: [{
            title: '待入库',
            name: 'WarehouseStockPending'
          },{
            title: '入库单',
            name: 'WarehouseStock'
          },{
            title: '库存',
            name: 'WarehouseInventory'
          },{
            title: '调拨单',
            name: 'WarehouseDistribute'
          }]
        },{
          title: '场地',
          icon: '&#xe75f;',
          name: 'Operate',
          children: [{
            title: '收货',
            name: 'OperateReceiving'
          },{
            title: '线路规划',
            name: 'OperateLineList'
          },{
            title: '退筐',
            name: 'OperateRefundFrame'
          }]
        },{
          title: '财务',
          icon: '&#xe64e;',
          name: 'Finance',
          children: [{
            title: '客户财务管理',
            name: 'FinanceBalanceQuery'
          },{
            title: '财务审核',
            name: 'FinanceApproveQuery'
          },{
            title: '供应商流水',
            name: 'FinanceSBDetail'
          },{
            title: '供应商流水审核',
            name: 'FinanceSBDetailAudit'
          },{
            title: '供应商对账单',
            name: 'FinanceSStatement'
          }]
        },{
          title: '统计',
          icon: '&#xe7ab;',
          name: 'Statistic',
          children: [{
            title: '商品销售统计',
            name: 'StatisticMarket'
          },{
            title: '客户订单统计',
            name: 'StatisticClient'
          },{
            title: '运营统计',
            name: 'StatisticOperation'
          },{
            title: '导出、打印',
            name: 'StatisticExportPrint'
          },{
            title: '业务运营报表',
            name: 'BusinessOperationStatement'
          },{
            title: '商品运营报表',
            name: 'ItemOperationStatement'
          }]
        },{
          title: '信息',
          icon: '&#xe73b;',
          name: 'BasicData',
          children: [{
            title: '科学分类列表',
            name: 'BasicDataSystemClassList'
          },{
            title: '展示分类列表',
            name: 'BasicDataDisplayClassList'
          },{
            title: '筐信息列表',
            name: 'BasicDataFrameList'
          },{
            title: '商品标签',
            name: 'BasicDataItemTagsList'
          },{
            title: '商品价格标签',
            name: 'BasicDataItemInnerTagsList'
          },{
            title: '省列表',
            name: 'BasicDataProvinceList'
          },{
            title: '片区列表',
            name: 'BasicDataZoneList'
          },{
            title: '县域列表',
            name: 'BasicDataCityList'
          },{
            title: '仓列表',
            name: 'BasicDataStorehouseList'
          },{
            title: '库列表',
            name: 'BasicDataWarehouseList'
          },{
            title: '商户等级列表',
            name: 'BasicDataGradeList'
          },{
            title: '商户内标签列表',
            name: 'BasicDataMerchantInnerTagsList'
          },{
            title: '商户外标签列表',
            name: 'BasicDataMerchantOuterTagsList'
          }]
        },{
          title: '设置',
          icon: '&#xe74c;',
          name: 'System',
          children: [{
            title: '角色列表',
            name: 'SystemRoleList'
          },{
            title: '运营人员列表',
            name: 'SystemOperatorList'
          },{
            title: '运营配置',
            name: 'SystemSetting'
          },{
            title: '个性化设置',
            name: 'SystemSettingCustom'
          },{
            title: 'Banner管理',
            name: 'SystemBannerList'
          }]
        }],
        pageName: 'Login',
        auth: {}, //用户权限,
        myInfo: {}, //当前登录信息
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
      'el-backtop': Backtop,
      'my-global-province': GlobalProvince,
    },
    created() {
      this.$getBrand().then(res => {
        this.$data.brand = res;
      });
    },
    methods: {
      //下拉菜单
      clickDropdown(command) {
        let that = this;
        if (command === 'loginOut') {
          MessageBox.confirm('您确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loginOut();
          }).catch(() => {
            // console.log('取消');
          });
        } else if (command === 'editPassword') {
          PwdModify.show(); //修改密码
        }
      },
      //登出
      async loginOut(){
        this.$loading({ isShow: true });
        let res = await Http.get(Config.api.signLogout, {});
        this.$loading({ isShow: false });
        if(res.code === 0){
          if(Method.isFullScreen()) Method.closeFullScreen(); //退出全屏
          this.$router.replace({ name: "Login" });
          //window.location.replace('/');
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },
    },
    watch: {
      //监听路由变化
      $route(a, b){
        this.$data.pageName = a.name;
        this.$data.auth = this.$auth || {};
        this.$data.myInfo = this.$myInfo || {};
      },
    }
  }

</script>

<style lang="scss">

  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }
  html{
    height: 100%;
  }

  body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, div, dl, dt, dd, ul, ol, li, pre, form, fieldset, lengend, button, input, textarea, th, td {
    margin: 0;
    padding: 0;
  }

  /*body*/
  body {
    font: 14px "Microsoft YaHei", 微软雅黑, "Arail"; /* letter-spacing: 1px; */
    background: #f7f7f8;
    height: 100%;
    //overflow-y: scroll;
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

  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    thead {
      font-size: 14px;
    }
  }

  /*链接样式*/
  .link-active:active {
    background: #f3f4f6;
  }

  .f-l { float: left; }
  .f-r {float: right;}

  .t-l {text-align: left;}
  .t-c {text-align: center;}
  .t-r {text-align: right;}

  .over-h {overflow: hidden;}
  .d-b {display: block;}
  .b-b-b {background-repeat: no-repeat; background-size: cover; background-position: center center;}
  .b-c-fff {background-color: #fff;}

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

  #app-body{
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-width: 1000px;
    box-sizing: border-box;
  }
  
  #app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  #head-div {
    background-color: #fff;
    height: 41px;
    color: #5A5D64;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 6;
    border-bottom: 1px solid #ececec;
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
    >.global-province {
      float: left;
      margin-left: 16px;
    }

    >.login-username {
      height: 42px;
      line-height: 42px;
      cursor: pointer;
      margin-right: 15px;
      color: #5A5D64;
    }
  }

  /*菜单*/
  #nav-menu-div {
    width: 180px;
    background-color: #262626;
    position: fixed;
    z-index: 2;
    top: 42px;
    left: 0;
    bottom: 0;
    #menu-div{
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    i {
      color: #bbb;
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
      background-color: #262626 !important;
      width: 180px;
      span {
        margin-left: 4px;
      }
    }

    li.el-menu-item.home {
      background-color: #262626 !important;
    }

    li.el-menu-item:hover {
      background-color: #050507 !important;
    }

    .el-menu--horizontal {
      border-bottom: 0;
    }
  }

  /*页面容器*/
  #router-view-div {
    padding: 16px;
    min-width: 1000px;
    box-sizing: border-box;
    background-color: #f7f7f8;
    margin: 42px 0 0 182px;
    .breadcrumb {
      padding: 0px 16px;
      /*background-color: #fff;*/
    }
    .query, .container-query {
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

  .subtitle{
    color: #5A5D64;
    margin-left: 30px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .custom-form{
    width: 90%;
    max-width: 1400px;
    .el-form-item__label{
      color: #909399 !important;
      font-size: 14px !important;
    }
    .el-form-item__content{
      .el-input{
        position: relative;
        top: -4px;
      }
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

  //共用价格颜色
  .price {
    color: #ff5252;
  }

  /*提示*/
  .span-help-tooltip{
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    color: #999;
    border: 1px solid #999;
    font-size: 12px;
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

  .el-transfer__button {
      display: block !important;
      margin: 0 auto 10px !important;
      padding: 10px !important;
      border-radius: 50% !important;
      color: #fff !important;
      font-size: 0 !important;
  }

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

  /*共用表格操作按钮*/
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

  .load-none {
    text-align: center;
    color: #999;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-top: 48px;
  }

  .el-table.list-table {
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

  //金额正负
  .amount{
    >.up{
      color: #F8931D;
      &::before{
        content: '+';
        margin-right: 2px;
      }
    }
    >.down{
        color: #76C627;
        &::before{
          content: '-';
          margin-right: 2px;
        }
    }
  }

</style>
