<template>
  <div>
    <query-item-pricing :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryItemPricing"/>
    <table-item-pricing :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableItemPricing"/>
    <add-edit-item-pricing :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditItemPricing"/>
    <detail-item-pricing-record :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailItemPricingRecord"/>
  </div>
</template>

<script>
  import { QueryItemPricing, TableItemPricing, AddEditItemPricing, DetailItemPricingRecord } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemPricing',
    components: {
      'query-item-pricing': QueryItemPricing,
      'table-item-pricing': TableItemPricing,
      'add-edit-item-pricing': AddEditItemPricing,
      'detail-item-pricing-record': DetailItemPricingRecord
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 每日报价");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>