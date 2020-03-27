<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
        </div>
        <div class="right">
          <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="TruckLoadDelay"/>
        </div>
      </div>
    </template>
    <table-operate-truck-load-delay v-if="provinceCode !== ''" :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableOperateTruckLoadDelay"/>
  </sub-menu>
</template>

<script>
  import TableOperateTruckLoadDelay from './TableOperateTruckLoadDelay';
  import { GlobalProvince } from '@/component';
  import MenuQuery from '@/view/operate/sort/MenuQuery';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'table-operate-truck-load-delay': TableOperateTruckLoadDelay,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle('场地 - 装车延时');
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableOperateTruckLoadDelay');
            pc.query.page = 1;
            pc.$data.query = pc.query;
            if(pc) pc.getData(pc.query);
          });
        }else{
          this.$data.provinceCode = data.code;
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .menu-left-query{
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
</style>
