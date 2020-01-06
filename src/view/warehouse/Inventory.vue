<template>
  <div>
    <query-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseInventory"/>
    <table-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseInventory"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory"/>
  </div>
</template>

<script>
  import { QueryWarehouseInventory, TableWarehouseInventory, DetailWarehouseInventory } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Inventory',
    components: {
      'query-warehouse-inventory': QueryWarehouseInventory,
      'table-warehouse-inventory': TableWarehouseInventory,
      'detail-warehouse-inventory': DetailWarehouseInventory
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 库存");
    },
  };
</script>