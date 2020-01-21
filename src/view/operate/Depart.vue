<template>
  <div>
    <query-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateDepart"/>
    <table-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateDepart"/>
    <detail-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepart"/>
    <detail-operate-depart-store :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepartStore"/>
    <detail-operate-depart-store-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepartStoreItem"/>
    <form-operate-depart-affirm :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateDepartAffirm"/>
    <detail-operate-depart-driver-track :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepartDriverTrack"/>
    <detail-operate-depart-stockout :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepartStockout"/>
    <detail-operate-depart-stockout-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepartStockoutDetail"/>
    <print-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintOperateDepart"/>
  </div>
</template>

<script>
  import {
    QueryOperateDepart,
    TableOperateDepart,
    DetailOperateDepart,
    DetailOperateDepartStore,
    DetailOperateDepartStoreItem,
    FormOperateDepartAffirm,
    DetailOperateDepartDriverTrack,
    DetailOperateDepartStockout,
    DetailOperateDepartStockoutDetail,
    PrintOperateDepart
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Depart',
    components: {
      'query-operate-depart': QueryOperateDepart,
      'table-operate-depart': TableOperateDepart,
      'detail-operate-depart': DetailOperateDepart,
      'detail-operate-depart-store': DetailOperateDepartStore,
      'detail-operate-depart-store-item': DetailOperateDepartStoreItem,
      'form-operate-depart-affirm': FormOperateDepartAffirm,
      'detail-operate-depart-driver-track': DetailOperateDepartDriverTrack,
      'detail-operate-depart-stockout': DetailOperateDepartStockout,
      'detail-operate-depart-stockout-detail': DetailOperateDepartStockoutDetail,
      'print-operate-depart': PrintOperateDepart
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 发车');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
