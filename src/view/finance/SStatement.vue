<template>
  <div>
    <query-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSStatement"/>
    <table-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSStatement"/>
    <detail-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailFinanceSStatement"/>
  </div>
</template>

<script>
  import { QueryFinanceSStatement, TableFinanceSStatement, DetailFinanceSStatement} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'SStatement',
    components: {
      'query-finance-s-statement': QueryFinanceSStatement,
      'table-finance-s-statement': TableFinanceSStatement,
      'detail-finance-s-statement': DetailFinanceSStatement,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("财务 - 供应商对账单");
    },
  };
</script>