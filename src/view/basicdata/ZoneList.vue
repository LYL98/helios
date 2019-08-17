<template>
  <div>
    <query-zone :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataZone"/>
    <table-zone :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataZone"/>
    <add-edit-zone :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataZone"/>
  </div>
</template>

<script>
  import { QueryBasicDataZone, TableBasicDataZone, AddEditBasicDataZone } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ZoneList',
    components: {
      'query-zone': QueryBasicDataZone,
      'table-zone': TableBasicDataZone,
      'add-edit-zone': AddEditBasicDataZone,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 片区列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

