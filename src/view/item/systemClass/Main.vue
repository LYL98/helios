<template>
  <sub-menu>
    <query-item-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemSystemClass"/>
    <table-item-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemSystemClass"/>
    <add-edit-item-system-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemSystemClass"/>
  </sub-menu>
</template>

<script>
  import { QueryItemSystemClass, TableItemSystemClass, AddEditItemSystemClass } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-system-class': QueryItemSystemClass,
      'table-item-system-class': TableItemSystemClass,
      'add-edit-item-system-class': AddEditItemSystemClass,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("信息 - 科学分类列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

