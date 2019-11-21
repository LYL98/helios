<template>
  <div>
    <query-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemPricing"/>
    <table-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemPricing"/>
    <add-edit-item-pricing :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemPricing"/>
  </div>
</template>

<script>
  import { QueryItemPricing, TableItemPricing, AddEditItemPricing } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemPricing',
    components: {
      'query-item-pricing': QueryItemPricing,
      'table-item-pricing': TableItemPricing,
      'add-edit-item-pricing': AddEditItemPricing
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