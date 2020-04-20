<template>
  <sub-menu>
    <query-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemGPurchase"/>
    <table-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemGPurchase"/>
    <batch-add-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="BatchAddItemGPurchase"/>
    <add-edit-item-g-purchase :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemGPurchase"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="ItemGPurchase" title="预采订单审核"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="ItemGPurchase" title="关闭"/>
    <detail-warehouse-stock :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseStockPending"/>
  </sub-menu>
</template>

<script>
  import FormClose from '@/share/layout/FormClose';
  import FormAudit from '@/share/layout/FormAudit';
  import QueryItemGPurchase from './QueryItemGPurchase';
  import TableItemGPurchase from './TableItemGPurchase';
  import BatchAddItemGPurchase from './BatchAddItemGPurchase';
  import AddEditItemGPurchase from './AddEditItemGPurchase';
  import AddEditWarehouseStockPending from '@/view/warehouse/stockPending/AddEditWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-g-purchase': QueryItemGPurchase,
      'table-item-g-purchase': TableItemGPurchase,
      'batch-add-item-g-purchase': BatchAddItemGPurchase,
      'add-edit-item-g-purchase': AddEditItemGPurchase,
      'form-audit': FormAudit,
      'form-close': FormClose,
      'detail-warehouse-stock': AddEditWarehouseStockPending
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 预采");
    },
  };
</script>
