<template>
  <print-layout title="打印线路码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div>
      <qr-code :content="qrCodeContent" v-if="isShow" :width="240" :height="240"/>
      <div style="font-size: 16px;">{{detail.title}}</div>
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
  name: "PrintOperateLine",
  mixins: [printMixin],
  components: {
    'qr-code': QrCode
  },
  created(){
  },
  data() {
    let initDetail = {
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    };
  },
  computed: {
    //内容
    qrCodeContent: {
      get(){
        let { detail } = this;
        return `{"type":"line","id":${detail.id}}`;
      }
    }
  },
  methods: {
    
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './print.scss';
</style>
