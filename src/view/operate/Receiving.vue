<template>
  <div>
    <query-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateReceiving"/>
    <table-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateReceiving"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory" fromPage="receiving"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
    <add-edit-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateReceiving"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlD" fromPage="Receiving"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlP" fromPage="Receiving"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControlEditNum"/>
  </div>
</template>

<script>
  import {
    QueryOperateReceiving,
    TableOperateReceiving,
    DetailWarehouseInventory,
    FormWarehouseInventoryOutStorage,
    AddEditOperateReceiving,
    DetailWarehouseQualityControlD,
    DetailWarehouseQualityControlP,
    FormWarehouseQualityControlEditNum
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Receiving',
    components: {
      'query-operate-receiving': QueryOperateReceiving,
      'table-operate-receiving': TableOperateReceiving,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage,
      'add-edit-operate-receiving': AddEditOperateReceiving,
      'detail-warehouse-quality-control-d': DetailWarehouseQualityControlD,
      'detail-warehouse-quality-control-p': DetailWarehouseQualityControlP,
      'form-warehouse-quality-control-edit-num': FormWarehouseQualityControlEditNum
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
