<template>
  <sub-menu>
    <query-item-tags-price :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemTagsPrice"/>
    <table-item-tags-price :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemTagsPrice"/>
    <add-edit-item-tags-price :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemTagsPrice"/>
  </sub-menu>
</template>

<script>
  import { QueryItemTagsPrice, TableItemTagsPrice, AddEditItemTagsPrice } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-tags-price': QueryItemTagsPrice,
      'table-item-tags-price': TableItemTagsPrice,
      'add-edit-item-tags-price': AddEditItemTagsPrice,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 商品价格标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

