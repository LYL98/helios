<template>
  <div>
    <query-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseInventory"/>
    <table-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseInventory"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory"/>
    <form-warehouse-inventory-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryDistribute"/>
    <form-warehouse-inventory-check :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryCheck"/>
    <form-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryMove"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage" fromPage="Inventory"/>
    <form-warehouse-inventory-variation :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryVariation"/>
    <detail-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGPurchase" fromPage="Inventory"/>
    <detail-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemLocalPurchase" fromPage="Inventory"/>
  </div>
</template>

<script>
  import {
    QueryWarehouseInventory,
    TableWarehouseInventory,
    DetailWarehouseInventory,
    FormWarehouseInventoryDistribute,
    FormWarehouseInventoryCheck,
    FormWarehouseInventoryMove,
    FormWarehouseInventoryOutStorage,
    FormWarehouseInventoryVariation,
    AddEditItemGPurchase,
    AddEditItemLocalPurchase
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Inventory',
    components: {
      'query-warehouse-inventory': QueryWarehouseInventory,
      'table-warehouse-inventory': TableWarehouseInventory,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-distribute': FormWarehouseInventoryDistribute,
      'form-warehouse-inventory-check': FormWarehouseInventoryCheck,
      'form-warehouse-inventory-move': FormWarehouseInventoryMove,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage,
      'form-warehouse-inventory-variation': FormWarehouseInventoryVariation,
      'detail-item-g-purchase': AddEditItemGPurchase,
      'detail-item-local-purchase': AddEditItemLocalPurchase
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 库存");
    }
  };
</script>