<template>
  <div>
    <query-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemList"/>
    <table-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemList"/>
    <add-edit-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemList"/>
    <detail-item-list-edit-record :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemListEditRecord"/>
    <form-item-list-edit-class-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemListEditClassTag"/>
    <form-item-list-edit-inner-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemListEditInnerTag"/>
  </div>
</template>

<script>
  import { QueryItemList, TableItemList, AddEditItemList, DetailItemList, DetailItemListEditRecord, FormItemListEditClassTag, FormItemListEditInnerTag } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemList',
    components: {
      'query-item-list': QueryItemList,
      'table-item-list': TableItemList,
      'add-edit-item-list': AddEditItemList,
      'detail-item-list-edit-record': DetailItemListEditRecord,
      'form-item-list-edit-class-tag': FormItemListEditClassTag,
      'form-item-list-edit-inner-tag': FormItemListEditInnerTag
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 商品列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>