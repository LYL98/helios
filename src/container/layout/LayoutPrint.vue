<template>
  <div>
    <el-drawer :title="title" append-to-body :visible.sync="isShow" direction="ttb" :before-close="beforeClose" custom-class="my-print-drawer" :modal="false">
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
import { Drawer } from 'element-ui';

export default {
  name: "LayoutPrint",
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
  watch:{
    //判断显示
    isShow(a, b){
      let dom = document.getElementById('app-body');
      //如显示打印
      if(a){
        dom.style.display = 'none';
      }else{
        dom.style.display = 'block';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  /*弹框共用*/
  .my-print-drawer{
      position: relative;
      left: 0 !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 100% !important;
      outline: none;
      background: #fff;
      overflow: auto;
      //不出滚动条，打印不显示
      /*&::-webkit-scrollbar{
        display: none;
      }*/
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
  /*!* 执行打印命令时，非打印区域隐藏（不会被打印出来） *!*/
  /*@media print{*/
  /*    .el-drawer__header, #app-body {*/
  /*        display: none;*/
  /*    }*/
  /*    .el-drawer__wrapper{*/
  /*      position: relative;*/
  /*    }*/
  /*}*/
</style>
