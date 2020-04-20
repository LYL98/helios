<template>
  <sub-menu>
    <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <out-storage-view :getPageComponents="viewGetPageComponents" ref="OutStorage"/>
  </sub-menu>
</template>

<script>
  import Query from './query';
  import Table from './table';
  import OutStorage from './out-storage';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-view': Query,
      'table-view': Table,
      'out-storage-view': OutStorage
    },
    mixins: [mainMixin],
    created() {
      documentTitle('仓库 - 出库计划 - 调拨出库');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
