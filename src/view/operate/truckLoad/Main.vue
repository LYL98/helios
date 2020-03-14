<template>
  <sub-menu>
    <template slot="left-query">
      <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="TruckLoad"/>
    </template>
    <query-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateTruckLoad"/>
    <table-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateTruckLoad"/>
    <form-operate-tuck-load-affirm :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateTruckLoadAffirm"/>
    <detail-operate-tuck-load :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateTruckLoad"/>
    <form-operate-tuck-load-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateTruckLoadEditNum"/>
  </sub-menu>
</template>

<script>
  import { QueryOperateTruckLoad, TableOperateTruckLoad, FormOperateTruckLoadAffirm, DetailOperateTruckLoad, FormOperateTruckLoadEditNum } from '@/container';
  import MenuQuery from './../sort/MenuQuery';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-tuck-load': QueryOperateTruckLoad,
      'table-operate-tuck-load': TableOperateTruckLoad,
      'form-operate-tuck-load-affirm': FormOperateTruckLoadAffirm,
      'detail-operate-tuck-load': DetailOperateTruckLoad,
      'form-operate-tuck-load-edit-num': FormOperateTruckLoadEditNum
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
