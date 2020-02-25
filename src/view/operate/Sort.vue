<template>
  <div>
    <query-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateSort"/>
    <table-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateSort"/>
    <detail-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateSort"/>
    <add-edit-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateSort"/>
    <detail-operate-sort-city :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateSortCity"/>
    <print-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintOperateSort"/>
  </div>
</template>

<script>
  import { QueryOperateSort, TableOperateSort, DetailOperateSort, AddEditOperateSort, DetailOperateSortCity, PrintOperateSort } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Sort',
    components: {
      'query-operate-sort': QueryOperateSort,
      'table-operate-sort': TableOperateSort,
      'detail-operate-sort': DetailOperateSort,
      'add-edit-operate-sort': AddEditOperateSort,
      'detail-operate-sort-city': DetailOperateSortCity,
      'print-operate-sort': PrintOperateSort
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 分配');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
