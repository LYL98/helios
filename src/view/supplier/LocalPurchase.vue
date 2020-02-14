<template>
  <div>
    <query-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierLocalPurchase"/>
    <table-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierLocalPurchase"/>
    <add-edit-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierLocalPurchase"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="SupplierLocalPurchase" title="地采订单审核"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QuerySupplierLocalPurchase, TableSupplierLocalPurchase, AddEditSupplierLocalPurchase, FormAudit, AddEditWarehouseStockPending} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'LocalPurchase',
    components: {
      'query-supplier-local-purchase': QuerySupplierLocalPurchase,
      'table-supplier-local-purchase': TableSupplierLocalPurchase,
      'add-edit-supplier-local-purchase': AddEditSupplierLocalPurchase,
      'form-audit': FormAudit,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("采购 - 地采订单");
    },
  };
</script>