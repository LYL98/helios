<template>
  <div>
    <query-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataWarehouse"/>
    <table-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataWarehouse"/>
    <detail-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailBasicDataWarehouse"/>
    <add-edit-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataWarehouse"/>
    <add-edit-warehouse-tray :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataWarehouseTray"/>
  </div>
</template>

<script>
  import { QueryBasicDataWarehouse, TableBasicDataWarehouse, AddEditBasicDataWarehouse, DetailBasicDataWarehouse, AddEditBasicDataWarehouseTray } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'WarehouseList',
    components: {
      'query-warehouse': QueryBasicDataWarehouse,
      'table-warehouse': TableBasicDataWarehouse,
      'detail-warehouse': DetailBasicDataWarehouse,
      'add-edit-warehouse': AddEditBasicDataWarehouse,
      'add-edit-warehouse-tray': AddEditBasicDataWarehouseTray
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 库列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

