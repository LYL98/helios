<template>
  <print-layout title="打印托盘码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div v-for="(item, index) in dataItem" :key="index" style="width: 225px; height: 150px; overflow: hidden;">
      <div class="flex-column-center">
        <qr-code :content="qrCodeContent(item)" v-if="isShow" :width="90" :height="90"/>
        <div style="font-size: 16px; font-weight: 600; line-height: 20px">{{item.code}}</div>
      </div>
      <div style="page-break-after: always;" v-if="index < dataItem.length - 1"></div>
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
  mounted() {
    this.link = document.createElement('link');
    this.link.rel = 'stylesheet';
    this.link.href = './size-60-40.css';
    let head = document.getElementsByTagName('head')[0];
    head && head.appendChild(this.link);
  },
  beforeDestroy() {
    if (this.link) {
      let head = document.getElementsByTagName('head')[0];
      head && head.removeChild(this.link);
    }
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
  .flex-column-center {
    height: 150px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

</style>
