<template>
  <div>
    <query-province :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryBasicDataProvince"/>
    <table-province :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableBasicDataProvince"/>
    <add-edit-province :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditBasicDataProvince"/>
  </div>
</template>

<script>
  import { QueryBasicDataProvince, TableBasicDataProvince, AddEditBasicDataProvince } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Province',
    components: {
      'query-province': QueryBasicDataProvince,
      'table-province': TableBasicDataProvince,
      'add-edit-province': AddEditBasicDataProvince,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 省列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

