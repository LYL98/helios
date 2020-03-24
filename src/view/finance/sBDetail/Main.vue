<template>
  <sub-menu>
    <query-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSBDetail" page="sBDetail"/>
    <table-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSBDetail" page="sBDetail"/>
    <add-edit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSBDetail"/>
  </sub-menu>
</template>

<script>
  import QueryFinanceSBDetail from './QueryFinanceSBDetail';
  import TableFinanceSBDetail from './TableFinanceSBDetail';
  import AddEditFinanceSBDetail from './AddEditFinanceSBDetail';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-finance-s-b-detail': QueryFinanceSBDetail,
      'table-finance-s-b-detail': TableFinanceSBDetail,
      'add-edit-finance-s-b-detail': AddEditFinanceSBDetail,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("财务 - 供应商流水");
      
    },
  };
</script>