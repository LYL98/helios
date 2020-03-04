<template>
  <div>
    <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
  </div>
</template>

<script>
  import Query from './Query';
  import Table from './Table';
  import AddEdit from './AddEdit';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Province',
    components: {
      'query-view': Query,
      'table-view': Table,
      'add-edit-view': AddEdit,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("设置 - 省");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

