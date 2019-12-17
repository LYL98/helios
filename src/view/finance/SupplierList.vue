<template>
  <div>
    <query-finance-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSupplierList"/>
    <table-finance-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSupplierList" page="supplierList"/>
    <add-edit-finance-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSupplierList"/>
  </div>
</template>

<script>
  import { QueryFinanceSupplierList, TableFinanceSupplierList, AddEditFinanceSupplierList} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FinanceSupplierList',
    components: {
      'query-finance-supplier-list': QueryFinanceSupplierList,
      'table-finance-supplier-list': TableFinanceSupplierList,
      'add-edit-finance-supplier-list': AddEditFinanceSupplierList,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 供应商列表");
    },
  };
</script>