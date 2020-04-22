<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-model="storehouseId" @change="changeStorehouse" @initCallBack="initChangeStorehouse" :show-nationwide="false"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="deliveryDate" @change="changeQuery"/>
        </div>
      </div>
    </template>
    <template v-if="storehouseId && deliveryDate">
      <query-operate-tuck-load :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="QueryOperateTruckLoad"/>
      <table-operate-tuck-load :getPageComponents="viewGetPageComponents" :storehouseId="storehouseId" :deliveryDate="deliveryDate" ref="TableOperateTruckLoad"/>
      <form-operate-tuck-load-affirm :getPageComponents="viewGetPageComponents" ref="FormOperateTruckLoadAffirm"/>
      <detail-operate-tuck-load :getPageComponents="viewGetPageComponents" ref="DetailOperateTruckLoad"/>
      <form-operate-tuck-load-edit-num :getPageComponents="viewGetPageComponents" ref="FormOperateTruckLoadEditNum"/>
    </template>
  </sub-menu>
</template>

<script>
  import QueryOperateTruckLoad from './QueryOperateTruckLoad';
  import TableOperateTruckLoad from './TableOperateTruckLoad';
  import FormOperateTruckLoadAffirm from './FormOperateTruckLoadAffirm';
  import DetailOperateTruckLoad from './DetailOperateTruckLoad';
  import FormOperateTruckLoadEditNum from './FormOperateTruckLoadEditNum';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-operate-tuck-load': QueryOperateTruckLoad,
      'table-operate-tuck-load': TableOperateTruckLoad,
      'form-operate-tuck-load-affirm': FormOperateTruckLoadAffirm,
      'detail-operate-tuck-load': DetailOperateTruckLoad,
      'form-operate-tuck-load-edit-num': FormOperateTruckLoadEditNum,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate,
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: '',
        storehouseId: '',
        deliveryDate: ''
      }
    },
    created() {
      documentTitle('场地 - 配送装车 - 装车');
    },
    methods: {
      changeQuery(){
        this.$nextTick(()=>{
          let pc = this.viewGetPageComponents('TableOperateTruckLoad');
          if(pc){
            pc.$data.query.page = 1;
            pc.getData(pc.query);
          }
        });
      },
      changeStorehouse(data){
        this.$data.provinceCode = data.province_code;
        this.changeQuery();
      },
      initChangeStorehouse(data){
        this.$data.provinceCode = data.province_code;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .menu-left-query{
    width: 280px;
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
</style>
