<template>
  <div>
    <query-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierLocalPurchase"/>
    <table-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierLocalPurchase"/>
    <add-edit-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierLocalPurchase"/>
  </div>
</template>

<script>
  import { QuerySupplierLocalPurchase, TableSupplierLocalPurchase, AddEditSupplierLocalPurchase} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'LocalPurchase',
    components: {
      'query-supplier-local-purchase': QuerySupplierLocalPurchase,
      'table-supplier-local-purchase': TableSupplierLocalPurchase,
      'add-edit-supplier-local-purchase': AddEditSupplierLocalPurchase
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 地采订单");
    },
  };
</script>