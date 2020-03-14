<template>
  <sub-menu>
    <query-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemList" fromPage="ListForSale"/>
    <table-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemList" fromPage="ListForSale"/>
    <add-edit-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemList"/>
    <detail-item-list-edit-record :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemListEditRecord"/>
    <form-item-list-edit-inner-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemListEditInnerTag"/>
  </sub-menu>
</template>

<script>
  import { QueryItemList, TableItemList, AddEditItemList, DetailItemList, DetailItemListEditRecord, FormItemListEditInnerTag } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ListForSale',
    components: {
      'query-item-list': QueryItemList,
      'table-item-list': TableItemList,
      'add-edit-item-list': AddEditItemList,
      'detail-item-list-edit-record': DetailItemListEditRecord,
      'form-item-list-edit-inner-tag': FormItemListEditInnerTag
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 待售商品");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>