<template>
  <detail-layout title="司机轨迹" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    司机轨迹
        <!-- v-if="location.visible" -->
     <!-- <el-location
        :center="location.item.last_geo"
      /> -->
  </detail-layout>
</template>

<script>
  import { TableOperate ,Location} from '@/common';
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepartDriverTrack",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate,
      'el-location': Location,
    },
    data() {
      let initDetail = {
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        location:{}
      }
    },
    methods: {

      // showDetail(data){
      //   console.log(data);
        
      // }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
</style>
