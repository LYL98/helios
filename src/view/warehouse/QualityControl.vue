<template>
  <div>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl" fromPage="QualityControl"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl" fromPage="QualityControl"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl" fromPage="QualityControl"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending" fromPage="QualityControl"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="WarehouseQualityControl" title="关闭"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlD" fromPage="QualityControl"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlP" fromPage="QualityControl"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControlEditNum" fromPage="QualityControl"/>
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
    name: 'QualityControl',
    components: {
      'query-warehouse-quality-control': QueryWarehouseQualityControl,
      'table-warehouse-quality-control': TableWarehouseQualityControl,
      'add-edit-warehouse-quality-control': AddEditWarehouseQualityControl,
      'print-warehouse-stock-pending': PrintWarehouseStockPending,
      'form-close': FormClose,
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