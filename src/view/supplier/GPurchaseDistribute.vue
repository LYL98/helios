<template>
  <div>
    <query-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierGPurchaseDistribute"/>
    <table-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierGPurchaseDistribute"/>
    <add-edit-supplier-g-purchase-distribute :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchaseDistribute"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="SupplierGPurchaseDistribute" title="统采调拨单审核"/>
  </div>
</template>

<script>
  import { QuerySupplierGPurchaseDistribute, TableSupplierGPurchaseDistribute, AddEditSupplierGPurchaseDistribute, FormAudit} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchaseDistribute',
    components: {
      'query-supplier-g-purchase-distribute': QuerySupplierGPurchaseDistribute,
      'table-supplier-g-purchase-distribute': TableSupplierGPurchaseDistribute,
      'add-edit-supplier-g-purchase-distribute': AddEditSupplierGPurchaseDistribute,
      'form-audit': FormAudit
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 统采调拨单");
    },
  };
</script>