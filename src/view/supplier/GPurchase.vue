<template>
  <div>
    <query-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierGPurchase"/>
    <table-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierGPurchase"/>
    <add-edit-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchase"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="SupplierGPurchase" title="统采订单审核"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QuerySupplierGPurchase, TableSupplierGPurchase, AddEditSupplierGPurchase, FormAudit, AddEditWarehouseStockPending} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchase',
    components: {
      'query-supplier-g-purchase': QuerySupplierGPurchase,
      'table-supplier-g-purchase': TableSupplierGPurchase,
      'add-edit-supplier-g-purchase': AddEditSupplierGPurchase,
      'form-audit': FormAudit,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("采购 - 统采订单");
    },
  };
</script>