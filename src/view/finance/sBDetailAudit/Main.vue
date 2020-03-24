<template>
  <sub-menu>
    <query-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSBDetail" page="sBDetailAudit"/>
    <table-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSBDetail" page="sBDetailAudit"/>
    <add-edit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSBDetail"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="FinanceSBDetail" title="供应商流水审核"/>
  </sub-menu>
</template>

<script>
  import { FormAudit} from '@/container';
  import QueryFinanceSBDetail from '@/view/finance/sBDetail/QueryFinanceSBDetail';
  import TableFinanceSBDetail from '@/view/finance/sBDetail/TableFinanceSBDetail';
  import AddEditFinanceSBDetail from '@/view/finance/sBDetail/AddEditFinanceSBDetail';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-finance-s-b-detail': QueryFinanceSBDetail,
      'table-finance-s-b-detail': TableFinanceSBDetail,
      'add-edit-finance-s-b-detail': AddEditFinanceSBDetail,
      'form-audit': FormAudit
    },
    mixins: [mainMixin],
    created() {
      documentTitle("财务 - 供应商流水审核");
    },
  };
</script>