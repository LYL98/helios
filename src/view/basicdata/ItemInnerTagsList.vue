<template>
  <div>
    <table-item-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataItemInnerTags"/>
    <add-edit-item-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataItemInnerTags"/>
  </div>
</template>

<script>
  import { TableBasicDataItemInnerTags, AddEditBasicDataItemInnerTags } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemInnerTagsList',
    components: {
      'table-item-inner-tags': TableBasicDataItemInnerTags,
      'add-edit-item-inner-tags': AddEditBasicDataItemInnerTags,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 商品内标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

