<template>
  <div>
    <el-drawer :title="title" :visible.sync="isShow" direction="ttb" :before-close="beforeClose" size="100%" custom-class="my-print-drawer">
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
import { Drawer } from 'element-ui';

export default {
  name: "LayoutOverall",
  components: {
    'el-drawer': Drawer
  },
  props: {
    isShow: { type: Boolean, default: false }, //是否显示
    title: { type: String, default: '' }, //标题
    beforeClose: { type: Function }, //关闭前
  },
  data(){
    return {

    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  /*弹框共用*/
  .my-print-drawer{
      left: 0 !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 100% !important;
      outline: none;
      background: #fff;
      >.el-drawer__header{
          font-size: 18px;
          border-bottom: 1px solid #ececec;
          margin: 0 !important;
          padding: 8px 16px !important;
          >span{
            outline: none;
          }
      }
      >.el-drawer__body{
          padding: 0;
      }
  }
  /* 执行打印命令时，非打印区域隐藏（不会被打印出来） */
  @media print{
      .el-drawer__header {
          display: none;
      }
  }
</style>
