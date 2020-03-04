<template>
  <sub-menu>
    <query-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemPricing"/>
    <table-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemPricing"/>
    <add-edit-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemPricing"/>
    <form-item-pricing-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemPricingEditNum"/>
  </sub-menu>
</template>

<script>
  import { QueryItemPricing, TableItemPricing, AddEditItemPricing, FormItemPricingEditNum } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Pricing',
    components: {
      'query-item-pricing': QueryItemPricing,
      'table-item-pricing': TableItemPricing,
      'add-edit-item-pricing': AddEditItemPricing,
      'form-item-pricing-edit-num': FormItemPricingEditNum
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