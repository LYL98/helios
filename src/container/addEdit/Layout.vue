<template>
  <div>
    <!--drawer-->
    <el-drawer v-if="type === 'drawer'" :title="title" :visible.sync="isShow" direction="ttb" :before-close="beforeClose" size="100%" custom-class="my-add-edit-drawer">
      <slot></slot>
    </el-drawer>

    <!--dialog-->
    <el-dialog v-else-if="type === 'dialog'" :title="title" :visible="isShow" :before-close="beforeClose">
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
import { Drawer, Dialog } from 'element-ui';

export default {
  name: "Layout",
  components: {
    'el-drawer': Drawer,
    'el-dialog': Dialog
  },
  props: {
    type: { type: String, default: 'drawer' }, //页面类型
    isShow: { type: Boolean, default: false }, //是否显示
    title: { type: String, default: '' }, //标题
    beforeClose: { type: Function }, //关闭前
  },
  data(){
    return{
      
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  /*弹框共用*/
  .my-add-edit-drawer{
      left: 180px !important;
      top: 42px !important;
      width: calc(100% - 180px) !important;
      height: calc(100% - 42px) !important;
      >.el-drawer__header{
          font-size: 18px;
          border-bottom: 1px solid #ececec;
          margin: 0 !important;
          padding: 8px 16px !important;
      }
      >.el-drawer__body{
          overflow: auto !important;
          padding: 15px 0;
          min-width: 1000px;
      }
  }
</style>
