<template>
  <sub-menu>
    <query-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemLocalPurchase"/>
    <table-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemLocalPurchase"/>
    <add-edit-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemLocalPurchase"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="ItemLocalPurchase" title="关闭"/>
  </sub-menu>
</template>

<script>
  import FormClose from '@/share/layout/FormClose';
  import QueryItemLocalPurchase from './QueryItemLocalPurchase';
  import TableItemLocalPurchase from './TableItemLocalPurchase';
  import AddEditItemLocalPurchase from './AddEditItemLocalPurchase';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-local-purchase': QueryItemLocalPurchase,
      'table-item-local-purchase': TableItemLocalPurchase,
      'add-edit-item-local-purchase': AddEditItemLocalPurchase,
      'form-close': FormClose
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 反采");
    },
  };
</script>