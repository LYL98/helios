<template>
  <sub-menu>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" ref="QueryWarehouseQualityControl" fromPage="QualityControl"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" ref="TableWarehouseQualityControl" fromPage="QualityControl"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" ref="AddEditWarehouseQualityControl" fromPage="QualityControl"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" ref="PrintWarehouseStockPending" fromPage="QualityControl"/>
    <form-close :getPageComponents="viewGetPageComponents" ref="FormClose" page="WarehouseQualityControl" title="关闭"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" ref="DetailWarehouseQualityControlD" fromPage="QualityControl"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" ref="DetailWarehouseQualityControlP" fromPage="QualityControl"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" ref="FormWarehouseQualityControlEditNum" fromPage="QualityControl"/>
  </sub-menu>
</template>

<script>
  import { FormClose } from '@/container';
  import QueryWarehouseQualityControl from './QueryWarehouseQualityControl';
  import TableWarehouseQualityControl from './TableWarehouseQualityControl';
  import AddEditWarehouseQualityControl from './AddEditWarehouseQualityControl';
  import DetailWarehouseQualityControlD from './DetailWarehouseQualityControlD';
  import DetailWarehouseQualityControlP from './DetailWarehouseQualityControlP';
  import FormWarehouseQualityControlEditNum from './FormWarehouseQualityControlEditNum';
  import PrintWarehouseStockPending from '@/view/warehouse/stockPending/PrintWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
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
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 品控入库");
    },
  };
</script>