<template>
  <sub-menu>
    <query-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSBDetail" page="sBDetail"/>
    <table-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSBDetail" page="sBDetail"/>
    <add-edit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSBDetail"/>
  </sub-menu>
</template>

<script>
  import { QueryFinanceSBDetail, TableFinanceSBDetail, AddEditFinanceSBDetail} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FinanceSBDetail',
    components: {
      'query-finance-s-b-detail': QueryFinanceSBDetail,
      'table-finance-s-b-detail': TableFinanceSBDetail,
      'add-edit-finance-s-b-detail': AddEditFinanceSBDetail,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("财务 - 供应商流水");
      
    },
  };
</script>