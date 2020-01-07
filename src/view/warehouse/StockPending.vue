<template>
  <div>
    <query-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseStockPending"/>
    <table-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseStockPending"/>
    <add-edit-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QueryWarehouseStockPending, TableWarehouseStockPending, AddEditWarehouseStockPending } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'StockPending',
    components: {
      'query-warehouse-stock-pending': QueryWarehouseStockPending,
      'table-warehouse-stock-pending': TableWarehouseStockPending,
      'add-edit-warehouse-stock-pending': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 待入库");
    },
  };
</script>