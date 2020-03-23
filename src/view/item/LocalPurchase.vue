<template>
  <sub-menu>
    <query-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemLocalPurchase"/>
    <table-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemLocalPurchase"/>
    <add-edit-item-local-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemLocalPurchase"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="ItemLocalPurchase" title="关闭"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import { QueryItemLocalPurchase, TableItemLocalPurchase, AddEditItemLocalPurchase, FormClose, AddEditWarehouseStockPending} from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'LocalPurchase',
    components: {
      'query-item-local-purchase': QueryItemLocalPurchase,
      'table-item-local-purchase': TableItemLocalPurchase,
      'add-edit-item-local-purchase': AddEditItemLocalPurchase,
      'form-close': FormClose,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 反采");
    },
  };
</script>