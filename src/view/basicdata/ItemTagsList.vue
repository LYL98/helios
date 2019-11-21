<template>
  <div>
    <query-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataItemTags"/>
    <table-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataItemTags"/>
    <add-edit-item-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataItemTags"/>
  </div>
</template>

<script>
  import { QueryBasicDataItemTags, TableBasicDataItemTags, AddEditBasicDataItemTags } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemTagsList',
    components: {
      'query-item-tags': QueryBasicDataItemTags,
      'table-item-tags': TableBasicDataItemTags,
      'add-edit-item-tags': AddEditBasicDataItemTags,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 商品标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

