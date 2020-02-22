<template>
  <div>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending"/>
    <form-warehouse-quality-control-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControClose"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlD" fromPage="QualityControl"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlP" fromPage="QualityControl"/>
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
    DetailWarehouseQualityControlD,
    DetailWarehouseQualityControlP,
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
      'detail-warehouse-quality-control-d': DetailWarehouseQualityControlD,
      'detail-warehouse-quality-control-p': DetailWarehouseQualityControlP,
      'form-warehouse-quality-control-edit-num': FormWarehouseQualityControlEditNum,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 品控入库");
    },
  };
</script>