<template>
  <sub-menu>
    <query-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGlobal" page="global"/>
    <table-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGlobal" page="global"/>
    <add-edit-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGlobal" page="global"/>
    <detail-item-global-edit-record :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemGlobalEditRecord" page="global"/>
    <form-item-global-supplier-type :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemGlobalSupplierType" page="global"/>
  </sub-menu>
</template>

<script>
  import { QueryItemGlobal, TableItemGlobal, AddEditItemGlobal, DetailItemGlobalEditRecord, FormItemGlobalSupplierType } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-global': QueryItemGlobal,
      'table-item-global': TableItemGlobal,
      'add-edit-item-global': AddEditItemGlobal,
      'detail-item-global-edit-record': DetailItemGlobalEditRecord,
      'form-item-global-supplier-type': FormItemGlobalSupplierType
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 商品池");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

