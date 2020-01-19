<template>
  <print-layout title="打印订单码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div v-for="(item, index) in dataItem" :key="index">
      <qr-code :content="qrCodeContent(item)" v-if="isShow" :width="240" :height="240"/>
      <div style="font-size: 16px;">{{item.code}}</div>
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
import printMixin from './print.mixin';
import { Http, Config } from '@/util';
import { QrCode } from '@/common';

export default {
  name: "PrintOperateDepart",
  mixins: [printMixin],
  components: {
    'qr-code': QrCode
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
    },
    qrCodeContent(item){
      return `{"type":"tray","id":${item.id}}`;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './print.scss';
</style>
