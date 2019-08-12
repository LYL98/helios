<template>
  <div>
    <query-item-list :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryItemList"/>
    <table-item-list :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableItemList"/>
    <add-edit-item-list :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditItemList"/>
    <detail-item-list :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemList"/>
    <detail-item-list-edit-record :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemListEditRecord"/>
    <form-item-list-edit-class-tag :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="FormItemListEditClassTag"/>
    <form-item-list-edit-inner-tag :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="FormItemListEditInnerTag"/>
    <detail-item-list-audit-inner-tag :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemListAuditInnerTag"/>
  </div>
</template>

<script>
  import { QueryItemList, TableItemList, AddEditItemList, DetailItemList, DetailItemListEditRecord, FormItemListEditClassTag, FormItemListEditInnerTag, DetailItemListAuditInnerTag } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemList',
    components: {
      'query-item-list': QueryItemList,
      'table-item-list': TableItemList,
      'add-edit-item-list': AddEditItemList,
      'detail-item-list': DetailItemList,
      'detail-item-list-edit-record': DetailItemListEditRecord,
      'form-item-list-edit-class-tag': FormItemListEditClassTag,
      'form-item-list-edit-inner-tag': FormItemListEditInnerTag,
      'detail-item-list-audit-inner-tag': DetailItemListAuditInnerTag
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