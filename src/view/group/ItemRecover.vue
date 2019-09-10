<template>
  <div>
    <query-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupItem" page="recover"/>
    <table-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupItem" page="recover"/>
    <detail-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupItem" page="recover"/>
  </div>
</template>

<script>
  import { TableGroupItem, QueryGroupItem, DetailGroupItem } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "ItemRecover",
    mixins: [viewMixin],
    components: {
      'query-group-item': QueryGroupItem,
      'table-group-item': TableGroupItem,
      'detail-group-item': DetailGroupItem
    },
    created() {
      documentTitle('团购 - 商品恢复');
    }
  }
</script>

<style scoped>

</style>
