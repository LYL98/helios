<template>
  <sub-menu>
    <query-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseInventoryMove"/>
    <table-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseInventoryMove"/>
    <detail-warehouse-inventory-move-check :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMoveCheck"/>
    <detail-warehouse-inventory-move-variation :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMoveVariation"/>
    <detail-warehouse-inventory-move-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMoveDistribute"/>
    <detail-warehouse-inventory-move-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMoveMove"/>
    <detail-warehouse-inventory-move-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMoveOutStorage"/>
    <detail-warehouse-inventory-move-putaway :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventoryMovePutaway"/>
  </sub-menu>
</template>
<script>
  import {
    QueryWarehouseInventoryMove,
    TableWarehouseInventoryMove,
    DetailWarehouseInventoryMoveCheck,
    DetailWarehouseInventoryMoveVariation,
    DetailWarehouseInventoryMoveDistribute,
    DetailWarehouseInventoryMoveMove,
    DetailWarehouseInventoryMoveOutStorage,
    DetailWarehouseInventoryMovePutaway
  } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-inventory-move': QueryWarehouseInventoryMove,
      'table-warehouse-inventory-move': TableWarehouseInventoryMove,
      'detail-warehouse-inventory-move-check': DetailWarehouseInventoryMoveCheck,
      'detail-warehouse-inventory-move-variation': DetailWarehouseInventoryMoveVariation,
      'detail-warehouse-inventory-move-distribute': DetailWarehouseInventoryMoveDistribute,
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