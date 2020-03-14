<template>
  <detail-layout title="司机轨迹" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    司机轨迹
  </detail-layout>
</template>

<script>
  import { TableOperate } from '@/common';
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepartDriverTrack",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
