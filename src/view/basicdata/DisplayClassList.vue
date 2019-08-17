<template>
  <div>
    <query-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataDisplayClass"/>
    <table-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataDisplayClass"/>
    <add-edit-display-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataDisplayClass"/>
  </div>
</template>

<script>
  import { QueryBasicDataDisplayClass, TableBasicDataDisplayClass, AddEditBasicDataDisplayClass } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'DisplayClassList',
    components: {
      'query-display-class': QueryBasicDataDisplayClass,
      'table-display-class': TableBasicDataDisplayClass,
      'add-edit-display-class': AddEditBasicDataDisplayClass,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 展示分类列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

