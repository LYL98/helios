<template>
  <div>
    <query-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseInventoryMove"/>
    <table-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseInventoryMove"/>
    <detail-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMove"/>
  </div>
</template>

<script>
  import { QueryWarehouseInventoryMove, TableWarehouseInventoryMove, DetailWarehouseInventoryMove } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'InventoryMoveMove',
    components: {
      'query-warehouse-inventory-move': QueryWarehouseInventoryMove,
      'table-warehouse-inventory-move': TableWarehouseInventoryMove,
      'detail-warehouse-inventory-move': DetailWarehouseInventoryMove
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 库存变动记录");
    },
  };
</script>