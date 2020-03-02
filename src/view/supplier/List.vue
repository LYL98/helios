<template>
  <div>
    <query-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySupplierList"/>
    <table-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSupplierList"/>
    <add-edit-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSupplierList"/>
    <detail-supplier-list-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailSupplierListItem"/>
    <detail-supplier-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailSupplierList"/>
    <form-supplier-accont :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormSupplierAccount"/>
  </div>
</template>

<script>
  import { QuerySupplierList, TableSupplierList, AddEditSupplierList, DetailSupplierList, DetailSupplierListItem, FormSupplierAccount} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'SupplierList',
    components: {
      'query-supplier-list': QuerySupplierList,
      'table-supplier-list': TableSupplierList,
      'add-edit-supplier-list': AddEditSupplierList,
      'detail-supplier-list': DetailSupplierList,
      'detail-supplier-list-item': DetailSupplierListItem,
      'form-supplier-accont': FormSupplierAccount
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 供应商列表");
    },
  };
</script>