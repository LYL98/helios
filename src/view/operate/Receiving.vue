<template>
  <div>
    <query-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateReceiving"/>
    <table-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateReceiving"/>
    <detail-warehouse-inventory :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseInventory" fromPage="receiving"/>
    <form-warehouse-inventory-out-storage :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseInventoryOutStorage"/>
    <add-edit-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateReceiving"/>
  </div>
</template>

<script>
  import { QueryOperateReceiving, TableOperateReceiving, DetailWarehouseInventory, FormWarehouseInventoryOutStorage, AddEditOperateReceiving } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ReceivingList',
    components: {
      'query-operate-receiving': QueryOperateReceiving,
      'table-operate-receiving': TableOperateReceiving,
      'detail-warehouse-inventory': DetailWarehouseInventory,
      'form-warehouse-inventory-out-storage': FormWarehouseInventoryOutStorage,
      'add-edit-operate-receiving': AddEditOperateReceiving
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 收货');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
