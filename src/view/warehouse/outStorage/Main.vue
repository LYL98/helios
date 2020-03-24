<template>
  <sub-menu>
    <query-warehouse-out-storage :getPageComponents="viewGetPageComponents" ref="QueryWarehouseOutStorage"/>
    <table-warehouse-out-storage :getPageComponents="viewGetPageComponents" ref="TableWarehouseOutStorage"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" ref="DetailWarehouseInventory" fromPage="OutStorage"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" ref="FormWarehouseInventoryOutStorage" fromPage="OutStorage"/>
  </sub-menu>
</template>

<script>
  import QueryWarehouseOutStorage from './QueryWarehouseOutStorage';
  import TableWarehouseOutStorage from './TableWarehouseOutStorage';
  import DetailWarehouseInventory from '@/view/warehouse/inventory/DetailWarehouseInventory';
  import FormWarehouseInventoryOutStorage from '@/view/warehouse/inventory/FormWarehouseInventoryOutStorage';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-out-storage': QueryWarehouseOutStorage,
      'table-warehouse-out-storage': TableWarehouseOutStorage,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage
    },
    mixins: [mainMixin],
    created() {
      documentTitle('仓库 - 出库计划');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
