<template>
  <sub-menu>
    <query-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemSupplier"/>
    <table-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemSupplier"/>
    <add-edit-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemSupplier"/>
    <detail-item-supplier-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemSupplierItem"/>
    <detail-item-supplier :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemSupplier"/>
    <form-item-supplier-accont :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemSupplierAccount"/>
  </sub-menu>
</template>

<script>
  import { QueryItemSupplier, TableItemSupplier, AddEditItemSupplier, DetailItemSupplier, DetailItemSupplierItem, FormItemSupplierAccount} from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

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
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 供应商");
    },
  };
</script>