<template>
  <sub-menu>
    <template slot="left-query">
      <global-storehouse @change="changeStorehouse" style="width: 140px;"/>
    </template>
    <query-view :getPageComponents="viewGetPageComponents" ref="Query"/>
    <ttable-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
    <print-view :getPageComponents="viewGetPageComponents" ref="PrintWarehouseStockPending"/>
    <form-close :getPageComponents="viewGetPageComponents" ref="FormClose" title="关闭"/>
    <detail-d-view :getPageComponents="viewGetPageComponents" ref="DetailD"/>
    <detail-p-view :getPageComponents="viewGetPageComponents" ref="DetailP"/>
    <form-edit-num-view :getPageComponents="viewGetPageComponents" ref="FormEditNum"/>
  </sub-menu>
</template>

<script>
import { GlobalStorehouse } from '@/component';
  import FormClose from '@/share/layout/FormClose';
  import Query from './query';
  import Table from './table';
  import AddEdit from './add-edit';
  import DetailD from './detail-d';
  import DetailP from './detail-p';
  import FormEditNum from './edit-num';
  import PrintWarehouseStockPending from '@/view/warehouse/stockPending/PrintWarehouseStockPending';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'global-storehouse': GlobalStorehouse,
      'query-view': Query,
      'ttable-view': Table,
      'add-edit-view': AddEdit,
      'print-view': PrintWarehouseStockPending,
      'form-close': FormClose,
      'detail-d-view': DetailD,
      'detail-p-view': DetailP,
      'form-edit-num-view': FormEditNum
    },
    mixins: [mainMixin],
    data(){
      return{
        storehouseId: ''
      }
    },
    created() {
      documentTitle('场地 - 收货');
    },
    methods: {
      //选择仓后
      changeStorehouse(data){
        if(this.storehouseId !== ''){
          this.$data.storehouseId = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('Table');
            pc.query.page = 1;
            pc.$data.query = pc.query;
            if(pc) pc.getData(pc.query);
          });
        }else{
          this.$data.storehouseId = data.code;
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
