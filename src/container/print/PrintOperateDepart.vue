<template>
  <print-layout title="打印门店收货表" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div v-for="(item, index) in dataItem" :key="index">
      <div style="font-size: 16px;">{{index}}、{{item.line.title}}</div>
    </div>
    <div class="bottom-btn-body">
      <div class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        <el-button size="medium" type="primary" @click.native="handlePrint">打 印</el-button>
      </div>
    </div>
  </print-layout>
</template>

<script>
import printMixin from '@/share/mixin/print.mixin';
import { Http, Config } from '@/util';

export default {
  name: "PrintOperateDepart",
  mixins: [printMixin],
  components: {
  },
  created(){
  },
  data() {
    let initDetail = {}
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: []
    };
  },
  methods: {
    //显示打印(供外部也调用)
    showPrint(data){
      this.$data.dataItem = data;
      this.$data.isShow = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/print.scss';
</style>
