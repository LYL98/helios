<template>
  <sub-menu>
    <query-warehouse :getPageComponents="viewGetPageComponents" ref="Query"/>
    <table-warehouse :getPageComponents="viewGetPageComponents" ref="Table"/>
    <detail-warehouse :getPageComponents="viewGetPageComponents" ref="Detail"/>
    <add-edit-warehouse :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
    <add-edit-warehouse-tray :getPageComponents="viewGetPageComponents" ref="AddEditTray"/>
    <print-warehouse-tray :getPageComponents="viewGetPageComponents" ref="PrintTray"/>
  </sub-menu>
</template>

<script>
  import Query from './Query';
  import Table from './Table';
  import AddEdit from './AddEdit';
  import Detail from './Detail';
  import AddEditTray from './AddEditTray';
  import PrintTray from './PrintTray';
  import mainMixin from '@/share/mixin/main.mixin';

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
    mixins: [mainMixin],
    created() {
      documentTitle("仓库 - 库列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

