<template>
  <sub-menu>
    <template slot="left-query">
      <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="TruckLoadDelay"/>
    </template>
    <query-operate-truck-load-delay :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateTruckLoadDelay"/>
    <table-operate-truck-load-delay :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateTruckLoadDelay"/>
  </sub-menu>
</template>

<script>
  import { QueryOperateTruckLoadDelay, TableOperateTruckLoadDelay } from '@/container';
  import viewMixin from '@/view/view.mixin';
  import MenuQuery from './../sort/MenuQuery';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-truck-load-delay': QueryOperateTruckLoadDelay,
      'table-operate-truck-load-delay': TableOperateTruckLoadDelay
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 装车延时');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
