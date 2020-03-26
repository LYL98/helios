<template>
  <sub-menu>
    <query-item-pricing :getPageComponents="viewGetPageComponents" ref="QueryItemPricing"/>
    <table-item-pricing :getPageComponents="viewGetPageComponents" ref="TableItemPricing"/>
    <add-edit-item-pricing :getPageComponents="viewGetPageComponents" ref="AddEditItemPricing"/>
  </sub-menu>
</template>

<script>
  import QueryItemPricing from './QueryItemPricing';
  import TableItemPricing from './TableItemPricing';
  import AddEditItemPricing from './AddEditItemPricing';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-pricing': QueryItemPricing,
      'table-item-pricing': TableItemPricing,
      'add-edit-item-pricing': AddEditItemPricing
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 每日报价");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>