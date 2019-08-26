<template>
  <div>
    <query-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupBuy" page="buyRecover"/>
    <table-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupBuy" page="buyRecover"/>
    <detail-group-buy :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupBuy" page="buyRecover"/>
  </div>
</template>

<script>
  import { TableGroupBuy, QueryGroupBuy, DetailGroupBuy } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "BuyRecover",
    mixins: [viewMixin],
    components: {
      'query-group-buy': QueryGroupBuy,
      'table-group-buy': TableGroupBuy,
      'detail-group-buy': DetailGroupBuy
    },
    created() {
      documentTitle('团购 - 商品恢复');
    }
  }
</script>

<style scoped>

</style>
