<template>
  <div>
    <div v-if="subMenus.length > 0" class="app-my-sub-menu">
      <el-menu class="my-sub-menu" mode="horizontal" :default-active="pageData.name" router>
        <template v-for="(item, index) in subMenus">
          <el-menu-item :route="{name: item.name}" :index="item.name" :key="index">{{item.title}}</el-menu-item>
        </template>
      </el-menu>
    </div>
    <slot name="left-query"></slot>
    <slot name="right-query"></slot>
    <slot></slot>
  </div>
</template>

<script>
  import { Menu, MenuItem } from 'element-ui';
  export default {
    name: "SubMenu",
    components: {
      'el-menu': Menu,
      'el-menu-item': MenuItem,
    },
    inject: ['getSubMenuData', 'pageData'],
    props: {
      
    },
    data() {
      return {
        subMenus: []
      }
    },
    created() {
      this.$data.subMenus = this.getSubMenuData();
    },
    methods: {
      onExpandChange() {
        this.isExpand = !this.isExpand;
        this.$emit('expandChange', this.isExpand)
      }
    }
  }
</script>

<style lang="scss">
  /*三级菜单*/
  .my-sub-menu{
    margin-bottom: 16px !important;
    height: 48px;
    overflow: hidden;
    >.el-menu-item{
      height: 48px !important;
      line-height: 50px !important;
      padding: 0 26px;
    }
  }
</style>
