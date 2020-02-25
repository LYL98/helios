<template>
  <div>
    <query-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateTruckLoad"/>
    <table-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateTruckLoad"/>
    <form-operate-tuck-load-affirm :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateTruckLoadAffirm"/>
  </div>
</template>

<script>
  import { QueryOperateTruckLoad, TableOperateTruckLoad, FormOperateTruckLoadAffirm } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'TruckLoad',
    components: {
      'query-operate-tuck-load': QueryOperateTruckLoad,
      'table-operate-tuck-load': TableOperateTruckLoad,
      'form-operate-tuck-load-affirm': FormOperateTruckLoadAffirm
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
