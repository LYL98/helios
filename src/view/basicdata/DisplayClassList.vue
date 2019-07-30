<template>
  <div>
    <query-city :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryBasicDataCity"/>
    <table-city :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableBasicDataCity"/>
    <add-edit-city :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditBasicDataCity"/>
  </div>
</template>

<script>
  import { QueryBasicDataCity, TableBasicDataCity, AddEditBasicDataCity } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'CityList',
    components: {
      'query-city': QueryBasicDataCity,
      'table-city': TableBasicDataCity,
      'add-edit-city': AddEditBasicDataCity,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 县域列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

