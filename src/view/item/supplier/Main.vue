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
  import QueryItemSupplier from './QueryItemSupplier';
  import TableItemSupplier from './TableItemSupplier';
  import AddEditItemSupplier from './AddEditItemSupplier';
  import DetailItemSupplier from './DetailItemSupplier';
  import DetailItemSupplierItem from './DetailItemSupplierItem';
  import FormItemSupplierAccount from './FormItemSupplierAccount';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
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