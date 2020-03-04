<template>
  <sub-menu>
    <query-system-operator :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QuerySystemOperator" page="global"/>
    <table-system-operator :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSystemOperator" page="global"/>
    <add-edit-system-operator :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSystemOperator"/>
    <detail-system-operator :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailSystemOperator" page="global"/>
    <from-system-operator-reset-pwd :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormSystemOperatorResetPwd"/>
  </sub-menu>
</template>

<script>
  import { QuerySystemOperator, TableSystemOperator, AddEditSystemOperator, DetailSystemOperator, FormSystemOperatorResetPwd } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'SystemOperator',
    components: {
      'query-system-operator': QuerySystemOperator,
      'table-system-operator': TableSystemOperator,
      'add-edit-system-operator': AddEditSystemOperator,
      'detail-system-operator': DetailSystemOperator,
      'from-system-operator-reset-pwd': FormSystemOperatorResetPwd,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("设置 - 运营人员列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
