<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
        </div>
        <div class="right">
          <menu-query :getPageComponents="viewGetPageComponents" ref="MenuQuery" fromPage="TruckLoad"/>
        </div>
      </div>
    </template>
    <template v-if="provinceCode !== ''">
      <query-operate-tuck-load :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="QueryOperateTruckLoad"/>
      <table-operate-tuck-load :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableOperateTruckLoad"/>
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
  import { GlobalProvince } from '@/component';
  import MenuQuery from '@/view/operate/sort/MenuQuery';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'menu-query': MenuQuery,
      'query-operate-tuck-load': QueryOperateTruckLoad,
      'table-operate-tuck-load': TableOperateTruckLoad,
      'form-operate-tuck-load-affirm': FormOperateTruckLoadAffirm,
      'detail-operate-tuck-load': DetailOperateTruckLoad,
      'form-operate-tuck-load-edit-num': FormOperateTruckLoadEditNum,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle('场地 - 装车');
    },
    methods: {
      //选择区域后
      selectProvince(data){
        this.$data.provinceCode = data.code;
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
