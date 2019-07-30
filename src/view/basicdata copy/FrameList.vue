<template>
  <div>
    <table-frame-list :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableBasicDataFrame"/>
    <add-edit-frame :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditBasicDataFrame"/>
  </div>
</template>

<script>
  import { TableBasicDataFrame, AddEditBasicDataFrame } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FrameList',
    components: {
      'table-frame-list': TableBasicDataFrame,
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
