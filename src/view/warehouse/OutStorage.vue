<template>
  <div>
    <query-warehouse-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseOutStorage"/>
    <table-warehouse-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseOutStorage"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory" fromPage="OutStorage"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
  </div>
</template>

<script>
  import {
    QueryWarehouseOutStorage,
    TableWarehouseOutStorage,
    DetailWarehouseInventory,
    FormWarehouseInventoryOutStorage
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'OutStorage',
    components: {
      'query-warehouse-out-storage': QueryWarehouseOutStorage,
      'table-warehouse-out-storage': TableWarehouseOutStorage,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage
    },
    mixins: [viewMixin],
    created() {
      documentTitle('仓库 - 出库计划');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
