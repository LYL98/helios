<template>
  <div>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending"/>
    <form-warehouse-quality-control-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControClose"/>
    <detail-warehouse-quality-control-a :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlA" fromPage="QualityControl"/>
    <detail-warehouse-quality-control-g :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlG" fromPage="QualityControl"/>
    <detail-warehouse-quality-control-l :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlL" fromPage="QualityControl"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControlEditNum"/>
  </div>
</template>

<script>
  import {
    QueryWarehouseQualityControl,
    TableWarehouseQualityControl,
    AddEditWarehouseQualityControl,
    PrintWarehouseStockPending,
    FormWarehouseQualityControClose,
    DetailWarehouseQualityControlA,
    DetailWarehouseQualityControlG,
    DetailWarehouseQualityControlL,
    FormWarehouseQualityControlEditNum
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'QualityControl',
    components: {
      'query-warehouse-quality-control': QueryWarehouseQualityControl,
      'table-warehouse-quality-control': TableWarehouseQualityControl,
      'add-edit-warehouse-quality-control': AddEditWarehouseQualityControl,
      'print-warehouse-stock-pending': PrintWarehouseStockPending,
      'form-warehouse-quality-control-close': FormWarehouseQualityControClose,
      'detail-warehouse-quality-control-a': DetailWarehouseQualityControlA,
      'detail-warehouse-quality-control-g': DetailWarehouseQualityControlG,
      'detail-warehouse-quality-control-l': DetailWarehouseQualityControlL,
      'form-warehouse-quality-control-edit-num': FormWarehouseQualityControlEditNum,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 品控入库");
    },
  };
</script>