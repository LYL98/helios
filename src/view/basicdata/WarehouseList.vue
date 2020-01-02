<template>
  <div>
    <query-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataWarehouse"/>
    <table-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataWarehouse"/>
    <add-edit-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataWarehouse"/>
  </div>
</template>

<script>
  import { QueryBasicDataWarehouse, TableBasicDataWarehouse, AddEditBasicDataWarehouse } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'WarehouseList',
    components: {
      'query-warehouse': QueryBasicDataWarehouse,
      'table-warehouse': TableBasicDataWarehouse,
      'add-edit-warehouse': AddEditBasicDataWarehouse,
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

