<template>
  <sub-menu>
    <query-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateLine"/>
    <table-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateLine"/>
    <add-edit-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateLine"/>
    <print-operate-line :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintOperateLine"/>
    <detail-operate-line-driver :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateLineDriver"/>
  </sub-menu>
</template>

<script>
  import QueryOperateLine from './QueryOperateLine';
  import TableOperateLine from './TableOperateLine';
  import AddEditOperateLine from './AddEditOperateLine';
  import PrintOperateLine from './PrintOperateLine';
  import DetailOperateLineDriver from './DetailOperateLineDriver';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-operate-line': QueryOperateLine,
      'table-operate-line': TableOperateLine,
      'add-edit-operate-line': AddEditOperateLine,
      'print-operate-line': PrintOperateLine,
      'detail-operate-line-driver': DetailOperateLineDriver
    },
    mixins: [mainMixin],
    created() {
      documentTitle('场地 - 线路规划');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
