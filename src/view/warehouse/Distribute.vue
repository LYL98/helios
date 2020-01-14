<template>
  <div>
    <query-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseDistribute"/>
    <table-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseDistribute"/>
    <detail-warehouse-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseDistribute"/>
  </div>
</template>

<script>
  import { QueryWarehouseDistribute, TableWarehouseDistribute, DetailWarehouseDistribute } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchaseDistribute',
    components: {
      'query-warehouse-distribute': QueryWarehouseDistribute,
      'table-warehouse-distribute': TableWarehouseDistribute,
      'detail-warehouse-distribute': DetailWarehouseDistribute
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 调拨单");
    },
  };
</script>