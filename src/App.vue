<template>
  <div id="app-body">
    <div id="app" v-if="pageData.name !== 'Login'" style="min-width: 1000px;">
      <div id="nav-menu-div">
        <div id="login-username">
          <div class="username-avatar">
            <img v-if="myInfo.avatar && myInfo.avatar !== ''" :src="tencentPath + myInfo.avatar" alt="avatar" width="54" height="54">
            <img v-else src="@/assets/img/default_avatar.png" alt="avatar" width="54" height="54">
          </div>
          <el-dropdown trigger="click" placement="bottom" @command="clickDropdown">
            <div class="username">
              <div class="str add-dot">{{myInfo.realname}}</div>
              <div class="icon"><i class="el-icon-arrow-down"></i></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
              <el-dropdown-item command="reloadAuth" v-if="isDev">重载权限(仅供开发测试用)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div id="menu-div">
          <el-menu
            :router="false"
            unique-opened
            :default-active="getMenuIndex"
            menu-trigger="click"
            background-color="#20232C"
            style="border-right: 0"
            text-color="#D1D4DB"
            active-text-color="#D1D4DB"
          >
            <!--:route="{name: 'Home'}"-->
            <el-menu-item class="home" index="Home" v-if="auth.isAdmin || auth.Home" @click="(e) => clickMenu(e, { name: 'Home' })">
              <i class="iconfont menu-icon">&#xe751;</i>
              <span>首页</span>
            </el-menu-item>

            <!--运营菜单-->
            <template v-if="selectMenu === 'operate'">
              <template v-for="(item, index) in menus">
                <el-submenu :index="item.name" :key="index" v-if="auth.isAdmin || auth[item.name]">
                  <template slot="title">
                    <i class="iconfont menu-icon" v-html="item.icon"></i>
                    <span>{{item.title}}</span>
                  </template>
                  <template v-for="(m, i) in item.children">
                    <el-menu-item :index="m.name" :key="i" v-if="auth.isAdmin || auth[m.name]" @click="(e) => clickMenu(e, m)"><span>{{m.title}}</span></el-menu-item>
                  </template>
                </el-submenu>
              </template>
            </template>

            <!--团购菜单-->
            <template v-else-if="selectMenu === 'gbuy'">
              <template v-for="(item, index) in gmenus">
                <el-menu-item :index="item.name" :key="index" v-if="auth.isAdmin || auth[item.name]" @click="(e) => clickMenu(e, item)">
                  <i class="iconfont menu-icon" v-html="item.icon"></i>
                  <span>{{item.title}}</span>
                </el-menu-item>
              </template>
            </template>

          </el-menu>
        </div>
        <div id="go-g-buy" v-if="authList.length > 1">
          <div v-if="selectMenu === 'operate'" class="btn" @click="changeMenuType('gbuy')">进入团购中心</div>
          <div v-else-if="selectMenu === 'gbuy'" class="btn" @click="changeMenuType('operate')">进入运营中心</div>
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
  import { Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Backtop, Form, Notification } from 'element-ui';
  import { Http, Config, Method, DataHandle } from '@/util';
  import { PwdModify } from '@/component';
  import AppJson from './App.json';

  export default {
    name: 'app',
    components: {
      'el-menu': Menu,
      'el-submenu': Submenu,
      'el-menu-item': MenuItem,
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-backtop': Backtop
    },
    data() {
      return {
        isDev: Config.isDev,
        tencentPath: Config.tencentPath,
        authList: [],
        menus: AppJson.menus,
        gmenus: AppJson.gmenus,
        selectMenu: '',
        pageData: {
          name: 'Login'
        },
        auth: {}, //用户权限,
        myInfo: {}, //当前登录信息
        globalQuery: {}, //三级菜单专用query保持
      }
    },
    created() {

    },
    computed: {
      //index
      getMenuIndex: {
        get(){
          let { pageData, menus } = this;
          let data = {};
          const fun = (item) =>{
            for(let i = 0; i < item.length; i++){
              if(item[i].name === pageData.name){
                data = item[i];
                break;
              }
              if(item[i].children && item[i].children.length > 0){
                fun(item[i].children);
              }
            }
          }
          fun(menus);
          if(data.upName) return data.upName;
          return pageData.name;
        }
      },
    },
    provide(){
      let that = this;
      return {
        //获取三级菜单
        getSubMenuData(){
          let { pageData, menus, auth } = that;
          let upMenu = [];
          const fun = (item) =>{
            for(let i = 0; i < item.length; i++){
              if(item[i].name === pageData.name){
                item[i].upName ? upMenu = item : [];
                break;
              }
              if(item[i].children && item[i].children.length > 0){
                fun(item[i].children);
              }
            }
          }
          fun(menus);
          //判断权限
          if(!auth.isAdmin){
            upMenu = upMenu.filter(item => auth[item.name]);
          }
          return upMenu;
        },
        //保持搜索条件
        setGlobalQuery(query){
          that.$data.globalQuery = query;
        },
        //获取保持搜索条件
        getGlobalQuery(){
          return that.globalQuery;
        }
      }
    },
    methods: {
      //切换菜单类型
      changeMenuType(type){
        this.$data.selectMenu = type;
        if(this.$route.name !== 'Home') this.$router.replace({ name: "Home" });
      },
      //选择菜单
      clickMenu(e, item){
        //临时解决
        if(item.name === 'OperateTruckLoadMain'){
          this.$data.globalQuery = {};
        }

        let { auth, pageData } = this;
        let name = item.name;
        let type = item.type;
        if(item.children){
          for(let i = 0; i < item.children.length; i++){
            if(auth.isAdmin || auth[item.children[i].name]){
              name = item.children[i].name;
              type = item.children[i].name;
              break;
            }
          }
        }
        if(pageData.name === name) return; //如果跳同一个页面，停止
        //如果是二级主菜单，未找到有权限的子菜单
        if(type === 'main'){
          Notification.error({
            title: '提示',
            message: '您没有权限访问',
            offset: 50
          });
          return;
        }
        this.$router.push({ name });
      },
      //下拉菜单
      clickDropdown(command) {
        let that = this;
        if (command === 'loginOut') {
          this.$messageBox.confirm('您确认离开？', '提示', {
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
        } else if (command === 'reloadAuth') {
          that.signLogin();
        }
      },
      //登出
      async loginOut(){
        this.$loading({ isShow: true });
        let res = await Http.get(Config.api.signLogout, {});
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.$router.replace({ name: "Login" });
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },
      //重新登录
      async signLogin(){
        let data = Method.getLocalStorage('loginData');
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.signLogin, data, {throttle: false});
        this.$loading({ isShow: false });
        if(res.code === 0){
          if(this.$route.name !== 'Home') this.$router.replace({ name: "Home" });
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },
    },
    watch: {
      //监听路由变化
      $route(to, from){
        this.$data.pageData = to;
        this.$data.auth = this.$auth || {};
        this.$data.myInfo = this.$myInfo || {};
        let { auth } = this, authList = [], operate = false, gbuy = false;
        if(auth.isAdmin){
          authList = ['operate', 'gbuy'];
          operate = true;
          gbuy = true;
        }else{
          for(let item in auth){
            if(item.indexOf('Group') < 0 && item !== 'Home') operate = true;
            if(item === 'Group') gbuy = true;
          }
          if(operate) authList.push('operate');
          if(gbuy) authList.push('gbuy');
        }

        let { selectMenu } = this;
        if(from.name === 'Login') selectMenu = '';
        if((to.name.indexOf('Group') === 0 && gbuy) || selectMenu === 'gbuy'){
          selectMenu = 'gbuy';
        }else if(operate){
          selectMenu = 'operate';
        }
        this.$data.selectMenu = selectMenu;
        this.$data.authList = authList;
      },
    }
  }

</script>

<style lang="scss">
  @import './App.scss';
</style>
