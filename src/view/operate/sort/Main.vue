<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
        </div>
        <div class="right">
          <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="Sort"/>
        </div>
      </div>
    </template>
    <template v-if="provinceCode !== ''">
      <query-operate-sort :getPageComponents="viewGetPageComponents" ref="QueryOperateSort"/>
      <table-operate-sort :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableOperateSort"/>
      <detail-operate-sort :getPageComponents="viewGetPageComponents" ref="DetailOperateSort"/>
      <add-edit-operate-sort :getPageComponents="viewGetPageComponents" ref="AddEditOperateSort"/>
      <detail-operate-sort-city :getPageComponents="viewGetPageComponents" ref="DetailOperateSortCity"/>
      <print-operate-sort :getPageComponents="viewGetPageComponents" ref="PrintOperateSort"/>
    </template>
  </sub-menu>
</template>

<script>
  import QueryOperateSort from './QueryOperateSort';
  import TableOperateSort from './TableOperateSort';
  import DetailOperateSort from './DetailOperateSort';
  import AddEditOperateSort from './AddEditOperateSort';
  import DetailOperateSortCity from './DetailOperateSortCity';
  import PrintOperateSort from './PrintOperateSort';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';
  import MenuQuery from './MenuQuery';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-sort': QueryOperateSort,
      'table-operate-sort': TableOperateSort,
      'detail-operate-sort': DetailOperateSort,
      'add-edit-operate-sort': AddEditOperateSort,
      'detail-operate-sort-city': DetailOperateSortCity,
      'print-operate-sort': PrintOperateSort,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle('场地 - 分配');
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableOperateSort');
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
