<template>
  <sub-menu>
    <table-item-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemFrame"/>
    <add-edit-item-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemFrame"/>
  </sub-menu>
</template>

<script>
  import { TableItemFrame, AddEditItemFrame } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Frame',
    components: {
      'table-item-frame': TableItemFrame,
      'add-edit-item-frame': AddEditItemFrame,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 筐信息列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
