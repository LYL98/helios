<template>
  <div>
    <query-grade :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataGrade"/>
    <table-grade :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataGrade"/>
    <add-edit-grade :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataGrade"/>
  </div>
</template>

<script>
  import { QueryBasicDataGrade, TableBasicDataGrade, AddEditBasicDataGrade } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'GradeList',
    components: {
      'query-grade': QueryBasicDataGrade,
      'table-grade': TableBasicDataGrade,
      'add-edit-grade': AddEditBasicDataGrade,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 商户等级列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

