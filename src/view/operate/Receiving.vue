<template>
  <div>
    <query-operate-receiving :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryOperateReceiving"/>
    <table-operate-receiving :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableOperateReceiving"/>
    <add-edit-operate-receiving :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditOperateReceiving"/>
  </div>
</template>

<script>
  import { QueryOperateReceiving, TableOperateReceiving, AddEditOperateReceiving } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ReceivingList',
    components: {
      'query-operate-receiving': QueryOperateReceiving,
      'table-operate-receiving': TableOperateReceiving,
      'add-edit-operate-receiving': AddEditOperateReceiving,
    },
    mixins: [viewMixin],
    created() {
      let that = this;
      documentTitle('配送 - 收货');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
