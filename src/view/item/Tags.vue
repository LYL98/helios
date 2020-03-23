<template>
  <sub-menu>
    <query-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemTags"/>
    <table-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemTags"/>
    <add-edit-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemTags"/>
  </sub-menu>
</template>

<script>
  import { QueryItemTags, TableItemTags, AddEditItemTags } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Tags',
    components: {
      'query-item-tags': QueryItemTags,
      'table-item-tags': TableItemTags,
      'add-edit-item-tags': AddEditItemTags,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 商品运营标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

