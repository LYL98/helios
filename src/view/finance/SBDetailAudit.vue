<template>
  <div>
    <query-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSBDetail" page="sBDetailAudit"/>
    <table-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSBDetail" page="sBDetailAudit"/>
    <add-edit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSBDetail"/>
    <audit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormFinanceSBDetailAudit"/>
  </div>
</template>

<script>
  import { QueryFinanceSBDetail, TableFinanceSBDetail, AddEditFinanceSBDetail, FormFinanceSBDetailAudit} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FinanceSBDetailAudit',
    components: {
      'query-finance-s-b-detail': QueryFinanceSBDetail,
      'table-finance-s-b-detail': TableFinanceSBDetail,
      'add-edit-finance-s-b-detail': AddEditFinanceSBDetail,
      'audit-finance-s-b-detail': FormFinanceSBDetailAudit
    },
    mixins: [viewMixin],
    created() {
      documentTitle("财务 - 供应商流水审核");
    },
  };
</script>