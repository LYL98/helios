<template>
  <sub-menu>
    <query-warehouse-inventory :getPageComponents="viewGetPageComponents" ref="QueryWarehouseInventory"/>
    <table-warehouse-inventory :getPageComponents="viewGetPageComponents" ref="TableWarehouseInventory"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventory"/>
    <form-warehouse-inventory-distribute :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryDistribute"/>
    <form-warehouse-inventory-check :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryCheck"/>
    <form-warehouse-inventory-move :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryMove"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryOutStorage"/>
    <form-warehouse-inventory-variation :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryVariation"/>
  </sub-menu>
</template>

<script>
  import QueryWarehouseInventory from './QueryWarehouseInventory';
  import TableWarehouseInventory from './TableWarehouseInventory';
  import DetailWarehouseInventory from './DetailWarehouseInventory';
  import FormWarehouseInventoryDistribute from './FormWarehouseInventoryDistribute';
  import FormWarehouseInventoryCheck from './FormWarehouseInventoryCheck';
  import FormWarehouseInventoryMove from './FormWarehouseInventoryMove';
  import FormWarehouseInventoryOutStorage from './FormWarehouseInventoryOutStorage';
  import FormWarehouseInventoryVariation from './FormWarehouseInventoryVariation';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-inventory': QueryWarehouseInventory,
      'table-warehouse-inventory': TableWarehouseInventory,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-distribute': FormWarehouseInventoryDistribute,
      'form-warehouse-inventory-check': FormWarehouseInventoryCheck,
      'form-warehouse-inventory-move': FormWarehouseInventoryMove,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage,
      'form-warehouse-inventory-variation': FormWarehouseInventoryVariation
    },
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 库存");
    }
  };
</script>