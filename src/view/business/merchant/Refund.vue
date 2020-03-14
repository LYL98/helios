<template>
  <sub-menu>
    <query-merchant-refund :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryMerchantRefund"/>
    <table-merchant-refund :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableMerchantRefund"/>
    <add-edit-merchant-refund :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditMerchantRefund"/>
    <detail-merchant-refund-log :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailMerchantRefundLog"/>
  </sub-menu>
</template>

<script>
  import { QueryMerchantRefund, TableMerchantRefund, AddEditMerchantRefund, DetailMerchantRefundLog } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'MerchantRefund',
    components: {
      'query-merchant-refund': QueryMerchantRefund,
      'table-merchant-refund': TableMerchantRefund,
      'add-edit-merchant-refund': AddEditMerchantRefund,
      'detail-merchant-refund-log': DetailMerchantRefundLog,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("业务 - 门店筐信息");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>