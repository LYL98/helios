<template>
  <div>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl" fromPage="Receiving"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl" fromPage="Receiving"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl" fromPage="Receiving"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending" fromPage="Receiving"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="OperateReceiving" title="关闭"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlD" fromPage="Receiving"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlP" fromPage="Receiving"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControlEditNum" fromPage="Receiving"/>
  </div>
</template>

<script>
  import {
    QueryWarehouseQualityControl,
    TableWarehouseQualityControl,
    AddEditWarehouseQualityControl,
    PrintWarehouseStockPending,
    FormClose,
    DetailWarehouseQualityControlD,
    DetailWarehouseQualityControlP,
    FormWarehouseQualityControlEditNum
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Receiving',
    components: {
      'query-warehouse-quality-control': QueryWarehouseQualityControl,
      'table-warehouse-quality-control': TableWarehouseQualityControl,
      'add-edit-warehouse-quality-control': AddEditWarehouseQualityControl,
      'print-warehouse-stock-pending': PrintWarehouseStockPending,
      'form-close': FormClose,
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
