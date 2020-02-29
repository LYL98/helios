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
            <el-dropdown-item command="reloadAuth" v-if="isDev">重载权限(仅供开发测试用)</el-dropdown-item>
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
  import { Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Backtop } from 'element-ui';
  import { Http, Config, Method, DataHandle } from '@/util';
  import { GlobalProvince, PwdModify } from '@/component';
  import AppJson from './App.json';

  export default {
    name: 'app',
    data() {
      let name = this.$router.history.current.name;
      return {
        isDev: Config.isDev,
        brand: {
          brand_name: '',
          brand_icon: ''
        },
        tencentPath: Config.tencentPath,
        menus: AppJson.menus,
        pageName: 'Login',
        auth: {}, //用户权限,
        myInfo: {}, //当前登录信息
      }
    },
    components: {
      'el-menu': Menu,
      'el-submenu': Submenu,
      'el-menu-item': MenuItem,
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
          //window.location.replace('/');
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },
      //重新登录
      async signLogin(){
        let data = Method.getLocalStorage('loginData');
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.signLogin, data);
        this.$loading({ isShow: false });
        if(res.code === 0){
          if(this.$route.name !== 'Home') this.$router.replace({ name: "Home" });
          //window.location.reload();
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
  @import './App.scss';
</style>
