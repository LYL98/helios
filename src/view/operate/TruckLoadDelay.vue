<template>
  <div>
    <query-operate-truck-load-delay :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateTruckLoadDelay"/>
    <table-operate-truck-load-delay :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateTruckLoadDelay"/>
  </div>
</template>

<script>
  import { QueryOperateTruckLoadDelay, TableOperateTruckLoadDelay } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'TruckLoadDelay',
    components: {
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
