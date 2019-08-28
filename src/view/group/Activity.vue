<template>
  <div>
    <add-edit-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupActivity"/>
    <query-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupActivity"/>
    <table-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupActivity"/>
    <detail-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivity"/>
    <detail-group-activity-edit-log :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivityEditLog"/>
    <detail-group-activity-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivityItem"/>
  </div>
</template>

<script>
  import { AddEditGroupActivity, TableGroupActivity, QueryGroupActivity, DetailGroupActivity, DetailGroupActivityEditLog, DetailGroupActivityItem } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "Item",
    mixins: [viewMixin],
    components: {
      'add-edit-group-activity': AddEditGroupActivity,
      'query-group-activity': QueryGroupActivity,
      'table-group-activity': TableGroupActivity,
      'detail-group-activity': DetailGroupActivity,
      'detail-group-activity-edit-log': DetailGroupActivityEditLog,
      'detail-group-activity-item': DetailGroupActivityItem
    },
    created() {
      documentTitle('团购 - 团购活动');
    }
  }
</script>

<style scoped>

</style>
