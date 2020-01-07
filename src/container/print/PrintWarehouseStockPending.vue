<template>
  <print-layout title="打印" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div>
      <p v-for="item in 26" :key="item">打印内容{{item}}</p>
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

export default {
  name: "PrintWarehouseStockPending",
  mixins: [printMixin],
  components: {
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
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './print.scss';
</style>
