<template>
  <div>
    <query-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierGPurchase"/>
    <table-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierGPurchase"/>
    <add-edit-supplier-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierGPurchase"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="SupplierGPurchase" title="预采订单审核"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="SupplierGPurchase" title="关闭"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QuerySupplierGPurchase, TableSupplierGPurchase, AddEditSupplierGPurchase, FormAudit, FormClose, AddEditWarehouseStockPending} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchase',
    components: {
      'query-supplier-g-purchase': QuerySupplierGPurchase,
      'table-supplier-g-purchase': TableSupplierGPurchase,
      'add-edit-supplier-g-purchase': AddEditSupplierGPurchase,
      'form-audit': FormAudit,
      'form-close': FormClose,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("采购 - 预采");
    },
  };
</script>