<template>
  <sub-menu>
    <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
  </sub-menu>
</template>

<script>
  import Query from './Query';
  import Table from './Table';
  import AddEdit from './AddEdit';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'MerchantInnerTagsList',
    components: {
      'query-view': Query,
      'table-view': Table,
      'add-edit-view': AddEdit,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("业务 - 商户内标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

