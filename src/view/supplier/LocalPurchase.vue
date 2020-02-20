<template>
  <div>
    <query-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierLocalPurchase"/>
    <table-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierLocalPurchase"/>
    <add-edit-supplier-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierLocalPurchase"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="SupplierLocalPurchase" title="关闭"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </div>
</template>

<script>
  import { QuerySupplierLocalPurchase, TableSupplierLocalPurchase, AddEditSupplierLocalPurchase, FormClose, AddEditWarehouseStockPending} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'LocalPurchase',
    components: {
      'query-supplier-local-purchase': QuerySupplierLocalPurchase,
      'table-supplier-local-purchase': TableSupplierLocalPurchase,
      'add-edit-supplier-local-purchase': AddEditSupplierLocalPurchase,
      'form-close': FormClose,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("采购 - 反采订单");
    },
  };
</script>