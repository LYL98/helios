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
  import QueryOperateTruckLoadDelay from './QueryOperateTruckLoadDelay';
  import TableOperateTruckLoadDelay from './TableOperateTruckLoadDelay';
  import MenuQuery from '@/view/operate/sort/MenuQuery';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-truck-load-delay': QueryOperateTruckLoadDelay,
      'table-operate-truck-load-delay': TableOperateTruckLoadDelay
    },
    mixins: [mainMixin],
    created() {
      documentTitle('场地 - 装车延时');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
