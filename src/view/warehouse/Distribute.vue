<template>
  <div>
    <query-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseDistribute"/>
    <table-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseDistribute"/>
    <detail-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseDistribute"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QueryWarehouseDistribute, TableWarehouseDistribute, DetailWarehouseDistribute, AddEditWarehouseStockPending } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchaseDistribute',
    components: {
      'query-warehouse-distribute': QueryWarehouseDistribute,
      'table-warehouse-distribute': TableWarehouseDistribute,
      'detail-warehouse-distribute': DetailWarehouseDistribute,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 调拨单");
    },
  };
</script>