<template>
  <div>
    <query-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierList"/>
    <table-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierList" page="supplierList"/>
    <add-edit-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierList"/>
    <detail-supplier-list-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailSupplierListItem"/>
  </div>
</template>

<script>
  import { QuerySupplierList, TableSupplierList, AddEditSupplierList, DetailSupplierListItem} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'SupplierList',
    components: {
      'query-supplier-list': QuerySupplierList,
      'table-supplier-list': TableSupplierList,
      'add-edit-supplier-list': AddEditSupplierList,
      'detail-supplier-list-item': DetailSupplierListItem
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 供应商列表");
    },
  };
</script>