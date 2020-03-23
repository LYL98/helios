<template>
  <sub-menu>
    <query-item-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemDisplayClass"/>
    <table-item-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemDisplayClass"/>
    <add-edit-item-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemDisplayClass"/>
  </sub-menu>
</template>

<script>
  import { QueryItemDisplayClass, TableItemDisplayClass, AddEditItemDisplayClass } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'DisplayClass',
    components: {
      'query-item-display-class': QueryItemDisplayClass,
      'table-item-display-class': TableItemDisplayClass,
      'add-edit-item-display-class': AddEditItemDisplayClass,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 展示分类");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

