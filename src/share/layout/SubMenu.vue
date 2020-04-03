<template>
  <div>
    <div v-if="subMenus.length > 0" class="app-my-sub-menu">
      <div class="my-sub-menu">
        <div class="left"><slot name="left-query"></slot></div>
        <div class="menu">
          <router-link :class="`menu-item ${pageName === item.name && 'active'}`" v-for="(item, index) in subMenus" :to="{name: item.name}" :key="index">{{item.title}}</router-link>
        </div>
        <div class="right"><slot name="right-query"></slot></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "SubMenu",
    components: {
    },
    inject: ['getSubMenuData'],
    props: {
      
    },
    data() {
      return {
        subMenus: [],
        pageName: ''
      }
    },
    created() {
      this.$data.subMenus = this.getSubMenuData();
      this.$data.pageName = this.$route.name;
    },
    methods: {
    },
  }
</script>

<style lang="scss" scoped>
  /*三级菜单*/
  .my-sub-menu{
    height: 48px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    background: #fff;
    padding: 0 10px;
    position: relative;
    >.menu{
      flex: 1;
      display: flex;
      >.menu-item{
        padding: 0 20px;
        height: 48px;
        line-height: 48px;
        position: relative;
        color: #73767D;
        font-size: 14px;
        &.active{
          color: #00ADE7;
          font-weight: bold;
          font-size: 16px;
          &::after{
            content: ' ';
            border-bottom: 2px solid #00ADE7;
            position: absolute;
            left: 25px;
            bottom: 0;
            right: 25px;
          }
        }
      }
    }
  }
</style>
