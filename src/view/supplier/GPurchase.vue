<template>
  <div>
    <query-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierGPurchase"/>
    <table-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierGPurchase"/>
    <add-edit-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchase"/>
    <form-supplier-g-purchase-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormSupplierGPurchaseAudit"/>
  </div>
</template>

<script>
  import { QuerySupplierGPurchase, TableSupplierGPurchase, AddEditSupplierGPurchase, FormSupplierGPurchaseAudit} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchase',
    components: {
      'query-supplier-g-purchase': QuerySupplierGPurchase,
      'table-supplier-g-purchase': TableSupplierGPurchase,
      'add-edit-supplier-g-purchase': AddEditSupplierGPurchase,
      'form-supplier-g-purchase-audit': FormSupplierGPurchaseAudit
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 统采订单");
    },
  };
</script>