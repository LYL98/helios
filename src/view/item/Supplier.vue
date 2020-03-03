<template>
  <div>
    <query-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemSupplier"/>
    <table-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemSupplier"/>
    <add-edit-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemSupplier"/>
    <detail-item-supplier-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemSupplierItem"/>
    <detail-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemSupplier"/>
    <form-item-supplier-accont :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemSupplierAccount"/>
  </div>
</template>

<script>
  import { QueryItemSupplier, TableItemSupplier, AddEditItemSupplier, DetailItemSupplier, DetailItemSupplierItem, FormItemSupplierAccount} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Supplier',
    components: {
      'query-item-supplier': QueryItemSupplier,
      'table-item-supplier': TableItemSupplier,
      'add-edit-item-supplier': AddEditItemSupplier,
      'detail-item-supplier': DetailItemSupplier,
      'detail-item-supplier-item': DetailItemSupplierItem,
      'form-item-supplier-accont': FormItemSupplierAccount
    },
    mixins: [viewMixin],
    created() {
      documentTitle("供应商 - 供应商列表");
    },
  };
</script>