<template>
  <div>
    <query-merchant-refund :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="QueryMerchantRefund"/>
    <table-merchant-refund :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableMerchantRefund"/>
    <add-edit-merchant-refund :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditMerchantRefund"/>
    <detail-merchant-refund-log :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="DetailMerchantRefundLog"/>
  </div>
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
      documentTitle("门店 - 门店框信息");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>