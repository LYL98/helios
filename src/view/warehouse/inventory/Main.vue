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
    <detail-item-g-purchase :getPageComponents="viewGetPageComponents" ref="AddEditItemGPurchase" fromPage="Inventory"/>
    <detail-item-local-purchase :getPageComponents="viewGetPageComponents" ref="AddEditItemLocalPurchase" fromPage="Inventory"/>
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
  import AddEditItemGPurchase from '@/view/item/gPurchase/AddEditItemGPurchase';
  import AddEditItemLocalPurchase from '@/view/item/localPurchase/AddEditItemLocalPurchase';
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
      'form-warehouse-inventory-variation': FormWarehouseInventoryVariation,
      'detail-item-g-purchase': AddEditItemGPurchase,
      'detail-item-local-purchase': AddEditItemLocalPurchase
    },
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 库存");
    }
  };
</script>