<template>
  <sub-menu>
    <query-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSStatement"/>
    <table-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSStatement"/>
    <detail-finance-s-statement :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailFinanceSStatement"/>
  </sub-menu>
</template>

<script>
  import QueryFinanceSStatement from './QueryFinanceSStatement';
  import TableFinanceSStatement from './TableFinanceSStatement';
  import DetailFinanceSStatement from './DetailFinanceSStatement';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-finance-s-statement': QueryFinanceSStatement,
      'table-finance-s-statement': TableFinanceSStatement,
      'detail-finance-s-statement': DetailFinanceSStatement,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("财务 - 供应商对账单");
    },
  };
</script>