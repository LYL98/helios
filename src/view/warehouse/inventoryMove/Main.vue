<template>
  <sub-menu>
    <query-warehouse-inventory-move :getPageComponents="viewGetPageComponents" ref="QueryWarehouseInventoryMove"/>
    <table-warehouse-inventory-move :getPageComponents="viewGetPageComponents" ref="TableWarehouseInventoryMove"/>
    <detail-warehouse-inventory-move-in-storage :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMoveInStorage"/>
    <detail-warehouse-inventory-move-check :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMoveCheck"/>
    <detail-warehouse-inventory-move-variation :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMoveVariation"/>
    <detail-warehouse-inventory-move-move :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMoveMove"/>
    <detail-warehouse-inventory-move-out-storage :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMoveOutStorage"/>
    <detail-warehouse-inventory-move-putaway :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventoryMovePutaway"/>
  </sub-menu>
</template>
<script>
  import QueryWarehouseInventoryMove from './QueryWarehouseInventoryMove';
  import TableWarehouseInventoryMove from './TableWarehouseInventoryMove';
  import DetailWarehouseInventoryMoveInStorage from './DetailWarehouseInventoryMoveInStorage';
  import DetailWarehouseInventoryMoveCheck from './DetailWarehouseInventoryMoveCheck';
  import DetailWarehouseInventoryMoveVariation from './DetailWarehouseInventoryMoveVariation';
  import DetailWarehouseInventoryMoveMove from './DetailWarehouseInventoryMoveMove';
  import DetailWarehouseInventoryMoveOutStorage from './DetailWarehouseInventoryMoveOutStorage';
  import DetailWarehouseInventoryMovePutaway from './DetailWarehouseInventoryMovePutaway';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-inventory-move': QueryWarehouseInventoryMove,
      'table-warehouse-inventory-move': TableWarehouseInventoryMove,
      'detail-warehouse-inventory-move-in-storage': DetailWarehouseInventoryMoveInStorage,
      'detail-warehouse-inventory-move-check': DetailWarehouseInventoryMoveCheck,
      'detail-warehouse-inventory-move-variation': DetailWarehouseInventoryMoveVariation,
      'detail-warehouse-inventory-move-move': DetailWarehouseInventoryMoveMove,
      'detail-warehouse-inventory-move-out-storage': DetailWarehouseInventoryMoveOutStorage,
      'detail-warehouse-inventory-move-putaway': DetailWarehouseInventoryMovePutaway
    },
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 库存变动记录");
    },
  };
</script>