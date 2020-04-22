<template>
  <sub-menu>
    <template slot="left-query">
      <global-storehouse v-model="storehouseId" @change="changeStorehouse" style="width: 140px;"/>
    </template>
    <template v-if="storehouseId">
      <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
      <table-view :getPageComponents="viewGetPageComponents" :storehouseId="storehouseId" ref="Table"/>
      <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
      <print-view :getPageComponents="viewGetPageComponents" ref="PrintWarehouseStockPending"/>
      <form-close :getPageComponents="viewGetPageComponents" ref="FormClose" page="ReceivingPurchase" title="关闭"/>
      <detail-view :getPageComponents="viewGetPageComponents" ref="Detail"/>
      <form-edit-num-view :getPageComponents="viewGetPageComponents" ref="FormEditNum"/>
    </template>
  </sub-menu>
</template>

<script>
import { GlobalStorehouse } from '@/component';
  import FormClose from '@/share/layout/FormClose';
  import Query from './query';
  import Table from './table';
  import AddEdit from './add-edit';
  import Detail from './detail';
  import FormEditNum from './edit-num';
  import PrintWarehouseStockPending from '@/view/warehouse/stockPending/PrintWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'global-storehouse': GlobalStorehouse,
      'query-view': Query,
      'table-view': Table,
      'add-edit-view': AddEdit,
      'print-view': PrintWarehouseStockPending,
      'form-close': FormClose,
      'detail-view': Detail,
      'form-edit-num-view': FormEditNum
    },
    mixins: [mainMixin],
    data(){
      return{
        storehouseId: ''
      }
    },
    created() {
      documentTitle('场地 - 品控收货 - 采购');
    },
    methods: {
      //选择仓后
      changeStorehouse(data){
        if(this.storehouseId !== ''){
          this.$data.storehouseId = data.id;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('Table');
            pc.query.page = 1;
            pc.$data.query = pc.query;
            if(pc) pc.getData(pc.query);
          });
        }else{
          this.$data.storehouseId = data.id;
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
