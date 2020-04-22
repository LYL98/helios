<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-model="storehouseId" @change="changeQuery" :show-nationwide="false"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="deliveryDate" @change="changeQuery"/>
        </div>
      </div>
    </template>
    <table-view
      v-if="storehouseId && deliveryDate"
      :getPageComponents="viewGetPageComponents"
      :storehouseId="storehouseId"
      :deliveryDate="deliveryDate"
      ref="Table"
    />
  </sub-menu>
</template>

<script>
  import Table from './table';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import MenuQuery from '@/view/operate/sort/MenuQuery';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'table-view': Table,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate,
    },
    mixins: [mainMixin],
    data(){
      return {
        storehouseId: '',
        deliveryDate: ''
      }
    },
    created() {
      documentTitle('场地 - 装车延时');
    },
    methods: {
      changeQuery(){
        this.$nextTick(()=>{
          let pc = this.viewGetPageComponents('Table');
          if(pc){
            pc.$data.query.page = 1;
            pc.getData();
          }
        });
      },
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
