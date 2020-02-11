<template>
  <div>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QueryWarehouseQualityControl, TableWarehouseQualityControl, AddEditWarehouseQualityControl, PrintWarehouseStockPending } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'QualityControl',
    components: {
      'query-warehouse-quality-control': QueryWarehouseQualityControl,
      'table-warehouse-quality-control': TableWarehouseQualityControl,
      'add-edit-warehouse-quality-control': AddEditWarehouseQualityControl,
      'print-warehouse-stock-pending': PrintWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 品控入库");
    },
  };
</script>