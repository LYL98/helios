<template>
  <sub-menu>
    <template slot="left-query">
      <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="Sort"/>
    </template>
    <query-operate-sort :getPageComponents="viewGetPageComponents" ref="QueryOperateSort"/>
    <table-operate-sort :getPageComponents="viewGetPageComponents" ref="TableOperateSort"/>
    <detail-operate-sort :getPageComponents="viewGetPageComponents" ref="DetailOperateSort"/>
    <add-edit-operate-sort :getPageComponents="viewGetPageComponents" ref="AddEditOperateSort"/>
    <detail-operate-sort-city :getPageComponents="viewGetPageComponents" ref="DetailOperateSortCity"/>
    <print-operate-sort :getPageComponents="viewGetPageComponents" ref="PrintOperateSort"/>
  </sub-menu>
</template>

<script>
  import QueryOperateSort from './QueryOperateSort';
  import TableOperateSort from './TableOperateSort';
  import DetailOperateSort from './DetailOperateSort';
  import AddEditOperateSort from './AddEditOperateSort';
  import DetailOperateSortCity from './DetailOperateSortCity';
  import PrintOperateSort from './PrintOperateSort';
  import mainMixin from '@/share/mixin/main.mixin';
  import MenuQuery from './MenuQuery';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-sort': QueryOperateSort,
      'table-operate-sort': TableOperateSort,
      'detail-operate-sort': DetailOperateSort,
      'add-edit-operate-sort': AddEditOperateSort,
      'detail-operate-sort-city': DetailOperateSortCity,
      'print-operate-sort': PrintOperateSort
    },
    mixins: [mainMixin],
    created() {
      documentTitle('场地 - 分配');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
