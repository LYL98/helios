<template>
  <div>
    <query-item-global :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryItemGlobal" page="global"/>
    <table-item-global :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableItemGlobal" page="global"/>
    <add-edit-item-global :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditItemGlobal"/>
    <detail-item-global :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemGlobal" page="global"/>
    <detail-item-global-edit-record :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemGlobalEditRecord"/>
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

