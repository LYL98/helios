<template>
  <sub-menu>
    <query-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGPurchase"/>
    <table-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGPurchase"/>
    <add-edit-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGPurchase"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="ItemGPurchase" title="预采订单审核"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="ItemGPurchase" title="关闭"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import { QueryItemGPurchase, TableItemGPurchase, AddEditItemGPurchase, FormAudit, FormClose, AddEditWarehouseStockPending} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GPurchase',
    components: {
      'query-item-g-purchase': QueryItemGPurchase,
      'table-item-g-purchase': TableItemGPurchase,
      'add-edit-item-g-purchase': AddEditItemGPurchase,
      'form-audit': FormAudit,
      'form-close': FormClose,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 预采");
    },
  };
</script>