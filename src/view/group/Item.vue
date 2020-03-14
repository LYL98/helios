<template>
  <sub-menu>
    <add-edit-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupItem" page="item"/>
    <query-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupItem" page="item"/>
    <table-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupItem" page="item"/>
    <detail-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupItem" page="item"/>
    <detail-group-item-edit-log :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupItemEditLog"/>
  </sub-menu>
</template>

<script>
  import { AddEditGroupItem, TableGroupItem, QueryGroupItem, DetailGroupItem, DetailGroupItemEditLog } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "Item",
    mixins: [viewMixin],
    components: {
      'add-edit-group-item': AddEditGroupItem,
      'query-group-item': QueryGroupItem,
      'table-group-item': TableGroupItem,
      'detail-group-item': DetailGroupItem,
      'detail-group-item-edit-log': DetailGroupItemEditLog,
    },
    created() {
      documentTitle('团购 - 商品列表');
    }
  }
</script>

<style scoped>

</style>
