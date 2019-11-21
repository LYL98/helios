<template>
  <div>
    <query-item-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataItemInnerTags"/>
    <table-item-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataItemInnerTags"/>
    <add-edit-item-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataItemInnerTags"/>
  </div>
</template>

<script>
  import { QueryBasicDataItemInnerTags, TableBasicDataItemInnerTags, AddEditBasicDataItemInnerTags } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemInnerTagsList',
    components: {
      'query-item-inner-tags': QueryBasicDataItemInnerTags,
      'table-item-inner-tags': TableBasicDataItemInnerTags,
      'add-edit-item-inner-tags': AddEditBasicDataItemInnerTags,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 商品加价标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

