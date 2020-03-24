<template>
  <sub-menu>
    <query-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupStoreOrder"/>
    <table-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupStoreOrder"/>
    <detail-group-store-order :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupStoreOrder"/>
  </sub-menu>
</template>

<script>
  import TableGroupStoreOrder from './TableGroupStoreOrder';
  import QueryGroupStoreOrder from './QueryGroupStoreOrder';
  import DetailGroupStoreOrder from './DetailGroupStoreOrder';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "StoreOrder",
    mixins: [mainMixin],
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
