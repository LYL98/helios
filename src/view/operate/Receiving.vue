<template>
  <div>
    <query-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateReceiving"/>
    <table-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateReceiving"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory" fromPage="receiving"/>
    <form-operate-receiving-allot :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateReceivingAllot"/>
    <form-operate-receiving-number :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateReceivingNumber"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
  </div>
</template>

<script>
  import { QueryOperateReceiving, TableOperateReceiving, DetailWarehouseInventory, FormOperateReceivingAllot, FormOperateReceivingNumber, FormWarehouseInventoryOutStorage } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ReceivingList',
    components: {
      'query-operate-receiving': QueryOperateReceiving,
      'table-operate-receiving': TableOperateReceiving,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-operate-receiving-allot': FormOperateReceivingAllot,
      'form-operate-receiving-number': FormOperateReceivingNumber,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 收货');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
