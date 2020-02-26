<template>
  <print-layout title="打印分拣码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div>
      <div>1/上饶线路</div>
      <div>100件</div>
      <div>1000108266</div>
    </div>
    <div v-for="(item, index) in dataItem" :key="index">
      <div>
        <span>18</span>
        <span>-</span>
        <span>12</span>
        <span>-</span>
        <span>10</span>
      </div>
      <qr-code :content="qrCodeContent(item)" v-if="isShow" :width="120" :height="120"/>
      <div style="font-size: 16px;">都昌百润超市</div>
      <div>1000108266</div>
      <div>2/3 蒲公英 2020-01-12</div>
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
  name: "PrintOperateSort",
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
      return `{"type":"sort","out_stock_id":${item.id}}`;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './print.scss';
</style>
