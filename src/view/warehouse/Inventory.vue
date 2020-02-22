<template>
  <div>
    <query-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseInventory"/>
    <table-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseInventory"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory"/>
    <form-warehouse-inventory-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryDistribute"/>
    <form-warehouse-inventory-check :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryCheck"/>
    <form-warehouse-inventory-move :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryMove"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
    <form-warehouse-inventory-variation :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryVariation"/>
    <detail-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchase" fromPage="Inventory"/>
    <detail-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierLocalPurchase" fromPage="Inventory"/>
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
    AddEditSupplierGPurchase,
    AddEditSupplierLocalPurchase
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
      'detail-supplier-g-purchase': AddEditSupplierGPurchase,
      'detail-supplier-local-purchase': AddEditSupplierLocalPurchase
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 库存");
    }
  };
</script>