<template>
  <div>
    <query-item-tags :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryBasicDataItemTags"/>
    <table-item-tags :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableBasicDataItemTags"/>
    <add-edit-item-tags :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditBasicDataItemTags"/>
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
      documentTitle("信息 - 商品外标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

