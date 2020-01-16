<template>
  <div>
    <query-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateSort"/>
    <table-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateSort"/>
    <detail-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateSort"/>
    <add-edit-operate-sort :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateSort"/>
  </div>
</template>

<script>
  import { QueryOperateSort, TableOperateSort, DetailOperateSort, AddEditOperateSort } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Sort',
    components: {
      'query-operate-sort': QueryOperateSort,
      'table-operate-sort': TableOperateSort,
      'detail-operate-sort': DetailOperateSort,
      'add-edit-operate-sort': AddEditOperateSort
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 分拣');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
