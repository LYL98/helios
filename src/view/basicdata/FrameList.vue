<template>
  <div>
    <table-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataFrame"/>
    <add-edit-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataFrame"/>
  </div>
</template>

<script>
  import { TableBasicDataFrame, AddEditBasicDataFrame } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FrameList',
    components: {
      'table-frame': TableBasicDataFrame,
      'add-edit-frame': AddEditBasicDataFrame,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 框信息列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
