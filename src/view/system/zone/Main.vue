<template>
  <sub-menu>
    <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
  </sub-menu>
</template>

<script>
  import Query from './Query';
  import Table from './Table';
  import AddEdit from './AddEdit';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Zone',
    components: {
      'query-view': Query,
      'table-view': Table,
      'add-edit-view': AddEdit,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("设置 - 片区");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

