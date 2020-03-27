<template>
  <sub-menu>
    <query-system-operator :getPageComponents="viewGetPageComponents" ref="QuerySystemOperator"/>
    <table-system-operator :getPageComponents="viewGetPageComponents" ref="TableSystemOperator"/>
    <add-edit-system-operator :getPageComponents="viewGetPageComponents" ref="AddEditSystemOperator"/>
    <detail-system-operator :getPageComponents="viewGetPageComponents" ref="DetailSystemOperator"/>
    <from-system-operator-reset-pwd :getPageComponents="viewGetPageComponents" ref="FormSystemOperatorResetPwd"/>
  </sub-menu>
</template>

<script>
  import QuerySystemOperator from './QuerySystemOperator';
  import TableSystemOperator from './TableSystemOperator';
  import AddEditSystemOperator from './AddEditSystemOperator';
  import DetailSystemOperator from './DetailSystemOperator';
  import FormSystemOperatorResetPwd from './FormSystemOperatorResetPwd';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-system-operator': QuerySystemOperator,
      'table-system-operator': TableSystemOperator,
      'add-edit-system-operator': AddEditSystemOperator,
      'detail-system-operator': DetailSystemOperator,
      'from-system-operator-reset-pwd': FormSystemOperatorResetPwd,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("设置 - 运营人员列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
