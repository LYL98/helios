<template>
  <div>
    <query-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupBuy" page="buy"/>
    <table-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupBuy" page="buy"/>
    <detail-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupBuy" page="buy"/>
  </div>
</template>

<script>
  import { TableGroupBuy, QueryGroupBuy, DetailGroupBuy } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "Buy",
    mixins: [viewMixin],
    components: {
      'query-group-buy': QueryGroupBuy,
      'table-group-buy': TableGroupBuy,
      'detail-group-buy': DetailGroupBuy
    },
    created() {
      documentTitle('团购 - 商品列表');
    }
  }
</script>

<style scoped>

</style>
