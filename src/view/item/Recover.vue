<template>
  <div>
    <query-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGlobal" page="recover"/>
    <table-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGlobal" page="recover"/>
    <detail-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemGlobal" page="recover"/>
  </div>
</template>

<script>
  import { QueryItemGlobal, TableItemGlobal, DetailItemGlobal } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemGlobal',
    components: {
      'query-item-global': QueryItemGlobal,
      'table-item-global': TableItemGlobal,
      'detail-item-global': DetailItemGlobal
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 回收站");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

