<template>
  <print-layout title="打印托盘码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div v-for="(item, index) in dataItem" :key="index" class="flex-coliumn-center" style="width: 60mm; height: 40mm;">
      <qr-code :content="qrCodeContent(item)" v-if="isShow" :width="100" :height="100"/>
      <div style="font-size: 16px; font-weight: 600;">{{item.code}}</div>
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
import printMixin from '@/container/print/print.mixin';
import { Http, Config } from '@/util';
import { QrCode } from '@/common';

export default {
  name: "PrintTray",
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
  @import '@/container/print/print.scss';
</style>
