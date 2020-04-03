<template>
  <sub-menu>
    <query-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryWarehouseQualityControl" fromPage="Receiving"/>
    <table-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableWarehouseQualityControl" fromPage="Receiving"/>
    <add-edit-warehouse-quality-control :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditWarehouseQualityControl" fromPage="Receiving"/>
    <print-warehouse-stock-pending :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="PrintWarehouseStockPending" fromPage="Receiving"/>
    <form-close :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormClose" page="OperateReceiving" title="关闭"/>
    <detail-warehouse-quality-control-d :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlD" fromPage="Receiving"/>
    <detail-warehouse-quality-control-p :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailWarehouseQualityControlP" fromPage="Receiving"/>
    <form-warehouse-quality-control-edit-num :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormWarehouseQualityControlEditNum" fromPage="Receiving"/>
  </sub-menu>
</template>

<script>
  import FormClose from '@/share/layout/FormClose';
  import QueryWarehouseQualityControl from '@/view/warehouse/qualityControl/QueryWarehouseQualityControl';
  import TableWarehouseQualityControl from '@/view/warehouse/qualityControl/TableWarehouseQualityControl';
  import AddEditWarehouseQualityControl from '@/view/warehouse/qualityControl/AddEditWarehouseQualityControl';
  import DetailWarehouseQualityControlD from '@/view/warehouse/qualityControl/DetailWarehouseQualityControlD';
  import DetailWarehouseQualityControlP from '@/view/warehouse/qualityControl/DetailWarehouseQualityControlP';
  import FormWarehouseQualityControlEditNum from '@/view/warehouse/qualityControl/FormWarehouseQualityControlEditNum';
  import PrintWarehouseStockPending from '@/view/warehouse/stockPending/PrintWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-warehouse-quality-control': QueryWarehouseQualityControl,
      'table-warehouse-quality-control': TableWarehouseQualityControl,
      'add-edit-warehouse-quality-control': AddEditWarehouseQualityControl,
      'print-warehouse-stock-pending': PrintWarehouseStockPending,
      'form-close': FormClose,
      'detail-warehouse-quality-control-d': DetailWarehouseQualityControlD,
      'detail-warehouse-quality-control-p': DetailWarehouseQualityControlP,
      'form-warehouse-quality-control-edit-num': FormWarehouseQualityControlEditNum
    },
    mixins: [mainMixin],
    created() {
      documentTitle('场地 - 收货');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
