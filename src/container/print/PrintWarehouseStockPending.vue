<template>
  <print-layout title="打印商品码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="width: 60mm; height: 40mm;" class="flex-coliumn-center">
      <qr-code :content="qrCodeContent" v-if="isShow" :width="90" :height="90"/>
      <div style="font-size: 16px; font-weight: 600; line-height: 20px">{{detail.item_code}}</div>
      <div style="font-size: 12px;">{{(detail.item_title + '最长字符限制最长字符限制最长字符限制最长字符限制').slice(0, 18)}}</div>
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
  name: "PrintWarehouseStockPending",
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
        return `{"type":"item","sub_item_id":${detail.item_id},"item_code":${detail.item_code},"order_id":${detail.id},"order_type":"${(detail.order_type || 'distribute')}","batch_code":"${detail.batch_code}"}`;
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

  .overflow-ellipsis {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
