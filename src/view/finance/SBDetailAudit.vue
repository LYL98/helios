<template>
  <div>
    <query-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryFinanceSBDetail" page="sBDetailAudit"/>
    <table-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableFinanceSBDetail" page="sBDetailAudit"/>
    <add-edit-finance-s-b-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditFinanceSBDetail"/>
    <form-audit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormAudit" page="FinanceSBDetail" title="供应商流水审核"/>
  </div>
</template>

<script>
  import { QueryFinanceSBDetail, TableFinanceSBDetail, AddEditFinanceSBDetail, FormAudit} from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FinanceSBDetailAudit',
    components: {
      'query-finance-s-b-detail': QueryFinanceSBDetail,
      'table-finance-s-b-detail': TableFinanceSBDetail,
      'add-edit-finance-s-b-detail': AddEditFinanceSBDetail,
      'form-audit': FormAudit
    },
    mixins: [viewMixin],
    created() {
      documentTitle("财务 - 供应商流水审核");
    },
  };
</script>