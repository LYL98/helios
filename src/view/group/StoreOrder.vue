<template>
  <div>
    <query-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupStoreOrder"/>
    <table-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupStoreOrder"/>
    <detail-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupStoreOrder"/>
  </div>
</template>

<script>
  import { TableGroupStoreOrder, QueryGroupStoreOrder, DetailGroupStoreOrder } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "StoreOrder",
    mixins: [viewMixin],
    components: {
      'query-group-store-order': QueryGroupStoreOrder,
      'table-group-store-order': TableGroupStoreOrder,
      'detail-group-store-order': DetailGroupStoreOrder
    },
    created() {
      documentTitle('团购 - 门店订单');
    }
  }
</script>

<style scoped>

</style>
