<template>
  <div>
    <query-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierGPurchaseDistribute"/>
    <table-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierGPurchaseDistribute"/>
    <add-edit-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchaseDistribute"/>
    <form-supplier-g-purchase-distribute-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormSupplierGPurchaseDistributeAudit"/>
  </div>
</template>

<script>
  import { QuerySupplierGPurchaseDistribute, TableSupplierGPurchaseDistribute, AddEditSupplierGPurchaseDistribute, FormSupplierGPurchaseDistributeAudit} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchaseDistribute',
    components: {
      'query-supplier-g-purchase-distribute': QuerySupplierGPurchaseDistribute,
      'table-supplier-g-purchase-distribute': TableSupplierGPurchaseDistribute,
      'add-edit-supplier-g-purchase-distribute': AddEditSupplierGPurchaseDistribute,
      'form-supplier-g-purchase-distribute-audit': FormSupplierGPurchaseDistributeAudit
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 统采调拨单");
    },
  };
</script>