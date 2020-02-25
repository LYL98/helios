<template>
  <div>
    <query-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateTruckLoad"/>
    <table-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateTruckLoad"/>
    <detail-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateTruckLoad"/>
    <add-edit-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditOperateTruckLoad"/>
  </div>
</template>

<script>
  import { QueryOperateTruckLoad, TableOperateTruckLoad, DetailOperateTruckLoad, AddEditOperateTruckLoad } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'TruckLoad',
    components: {
      'query-operate-tuck-load': QueryOperateTruckLoad,
      'table-operate-tuck-load': TableOperateTruckLoad,
      'detail-operate-tuck-load': DetailOperateTruckLoad,
      'add-edit-operate-tuck-load': AddEditOperateTruckLoad
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 装车');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
