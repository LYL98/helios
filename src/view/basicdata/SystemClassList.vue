<template>
  <div>
    <query-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataSystemClass"/>
    <table-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataSystemClass"/>
    <add-edit-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataSystemClass"/>
  </div>
</template>

<script>
  import { QueryBasicDataSystemClass, TableBasicDataSystemClass, AddEditBasicDataSystemClass } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'SystemClassList',
    components: {
      'query-system-class': QueryBasicDataSystemClass,
      'table-system-class': TableBasicDataSystemClass,
      'add-edit-system-class': AddEditBasicDataSystemClass,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 科学分类列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

