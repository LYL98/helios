<template>
  <sub-menu>
    <query-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="Query"/>
    <table-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="Table"/>
    <detail-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="Detail"/>
    <add-edit-warehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEdit"/>
    <add-edit-warehouse-tray :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditTray"/>
    <print-warehouse-tray :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintTray"/>
  </sub-menu>
</template>

<script>
  import Query from './Query';
  import Table from './Table';
  import AddEdit from './AddEdit';
  import Detail from './Detail';
  import AddEditTray from './AddEditTray';
  import PrintTray from './PrintTray';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'WarehouseList',
    components: {
      'query-warehouse': Query,
      'table-warehouse': Table,
      'detail-warehouse': Detail,
      'add-edit-warehouse': AddEdit,
      'add-edit-warehouse-tray': AddEditTray,
      'print-warehouse-tray': PrintTray
    },
    mixins: [viewMixin],
    created() {
      documentTitle("仓库 - 库列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

