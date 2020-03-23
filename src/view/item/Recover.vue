<template>
  <sub-menu>
    <query-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGlobal" page="recover"/>
    <table-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGlobal" page="recover"/>
    <addEdit-item-global :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGlobal" page="recover"/>
  </sub-menu>
</template>

<script>
  import { QueryItemGlobal, TableItemGlobal, AddEditItemGlobal } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Recover',
    components: {
      'query-item-global': QueryItemGlobal,
      'table-item-global': TableItemGlobal,
      'addEdit-item-global': AddEditItemGlobal
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 回收站");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

