<template>
  <div>
    <query-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateLine"/>
    <table-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateLine"/>
    <add-edit-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateLine"/>

  </div>
</template>

<script>
  import { QueryOperateLine, TableOperateLine, AddEditOperateLine } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'LineList',
    components: {
      'query-operate-line': QueryOperateLine,
      'table-operate-line': TableOperateLine,
      'add-edit-operate-line': AddEditOperateLine,
    },
    mixins: [viewMixin],
    created() {
      documentTitle('配送 - 线路规划');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
