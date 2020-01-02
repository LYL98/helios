<template>
  <div>
    <query-storehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataStorehouse"/>
    <table-storehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataStorehouse"/>
    <add-edit-storehouse :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataStorehouse"/>
  </div>
</template>

<script>
  import { QueryBasicDataStorehouse, TableBasicDataStorehouse, AddEditBasicDataStorehouse } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'StorehouseList',
    components: {
      'query-storehouse': QueryBasicDataStorehouse,
      'table-storehouse': TableBasicDataStorehouse,
      'add-edit-storehouse': AddEditBasicDataStorehouse,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 仓列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

