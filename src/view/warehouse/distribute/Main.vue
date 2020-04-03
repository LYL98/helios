<template>
  <sub-menu>
    <query-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseDistribute"/>
    <table-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseDistribute"/>
    <detail-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseDistribute"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import QueryWarehouseDistribute from './QueryWarehouseDistribute';
  import TableWarehouseDistribute from './TableWarehouseDistribute';
  import DetailWarehouseDistribute from './DetailWarehouseDistribute';
  import AddEditWarehouseStockPending from '@/view/warehouse/stockPending/AddEditWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-distribute': QueryWarehouseDistribute,
      'table-warehouse-distribute': TableWarehouseDistribute,
      'detail-warehouse-distribute': DetailWarehouseDistribute,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 调拨单");
    },
  };
</script>