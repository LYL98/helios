<template>
  <sub-menu>
    <table-item-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemFrame"/>
    <add-edit-item-frame :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemFrame"/>
  </sub-menu>
</template>

<script>
  import TableItemFrame from './TableItemFrame';
  import AddEditItemFrame from './AddEditItemFrame';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'table-item-frame': TableItemFrame,
      'add-edit-item-frame': AddEditItemFrame,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("信息 - 筐信息列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
