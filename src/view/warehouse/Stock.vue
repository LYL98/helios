<template>
  <div>
    <query-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseStock"/>
    <table-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseStock"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseStock"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QueryWarehouseStock, TableWarehouseStock, DetailWarehouseStock, PrintWarehouseStockPending } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Stock',
    components: {
      'query-warehouse-stock': QueryWarehouseStock,
      'table-warehouse-stock': TableWarehouseStock,
      'detail-warehouse-stock': DetailWarehouseStock,
      'print-warehouse-stock-pending': PrintWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 入库单");
    },
  };
</script>