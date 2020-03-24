<template>
  <sub-menu>
    <query-warehouse-stock-pending :getPageComponents="viewGetPageComponents" ref="QueryWarehouseStockPending"/>
    <table-warehouse-stock-pending :getPageComponents="viewGetPageComponents" ref="TableWarehouseStockPending"/>
    <add-edit-warehouse-stock-pending :getPageComponents="viewGetPageComponents" ref="AddEditWarehouseStockPending"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" ref="PrintWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import QueryWarehouseStockPending from './QueryWarehouseStockPending';
  import TableWarehouseStockPending from './TableWarehouseStockPending';
  import AddEditWarehouseStockPending from './AddEditWarehouseStockPending';
  import PrintWarehouseStockPending from './PrintWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-stock-pending': QueryWarehouseStockPending,
      'table-warehouse-stock-pending': TableWarehouseStockPending,
      'add-edit-warehouse-stock-pending': AddEditWarehouseStockPending,
      'print-warehouse-stock-pending': PrintWarehouseStockPending
    },
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 仓管入库");
    },
  };
</script>