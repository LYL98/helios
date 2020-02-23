<template>
  <div>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory" fromPage="Receiving"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
  </div>
</template>

<script>
  import {
    DetailWarehouseInventory,
    FormWarehouseInventoryOutStorage
  } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'OutStorage',
    components: {
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage
    },
    mixins: [viewMixin],
    created() {
      documentTitle('仓库 - 出库计划');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
