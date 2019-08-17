<template>
  <div>
    <query-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateReceiving"/>
    <table-operate-receiving :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateReceiving"/>
    <form-operate-receiving-allot :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateReceivingAllot"/>
    <form-operate-receiving-number :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateReceivingNumber"/>
    <detail-operate-receiving-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateReceivingAudit"/>
  </div>
</template>

<script>
  import { QueryOperateReceiving, TableOperateReceiving, FormOperateReceivingAllot, FormOperateReceivingNumber, DetailOperateReceivingAudit } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ReceivingList',
    components: {
      'query-operate-receiving': QueryOperateReceiving,
      'table-operate-receiving': TableOperateReceiving,
      'form-operate-receiving-allot': FormOperateReceivingAllot,
      'form-operate-receiving-number': FormOperateReceivingNumber,
      'detail-operate-receiving-audit': DetailOperateReceivingAudit
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
