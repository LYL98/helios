<template>
  <div>
    <query-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGlobal" page="global"/>
    <table-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGlobal" page="global"/>
    <add-edit-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGlobal"/>
    <detail-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemGlobal" page="global"/>
    <detail-item-global-edit-record :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemGlobalEditRecord"/>
  </div>
</template>

<script>
  import { QueryItemGlobal, TableItemGlobal, AddEditItemGlobal, DetailItemGlobal, DetailItemGlobalEditRecord } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemGlobal',
    components: {
      'query-item-global': QueryItemGlobal,
      'table-item-global': TableItemGlobal,
      'add-edit-item-global': AddEditItemGlobal,
      'detail-item-global': DetailItemGlobal,
      'detail-item-global-edit-record': DetailItemGlobalEditRecord,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 商品池");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

