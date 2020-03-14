<template>
  <sub-menu>
    <query-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseStockPending"/>
    <table-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseStockPending"/>
    <add-edit-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import { QueryWarehouseStockPending, TableWarehouseStockPending, AddEditWarehouseStockPending, PrintWarehouseStockPending } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'StockPending',
    components: {
      'query-warehouse-stock-pending': QueryWarehouseStockPending,
      'table-warehouse-stock-pending': TableWarehouseStockPending,
      'add-edit-warehouse-stock-pending': AddEditWarehouseStockPending,
      'print-warehouse-stock-pending': PrintWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 仓管入库");
    },
  };
</script>