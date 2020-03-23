<template>
  <sub-menu>
    <query-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupActivity"/>
    <table-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupActivity"/>
    <detail-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivity"/>
    <add-edit-group-activity :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupActivity"/>
    <detail-group-activity-edit-log :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivityEditLog"/>
    <detail-group-activity-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupActivityItem"/>
    <add-edit-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupItem" page="activity"/>
  </sub-menu>
</template>

<script>
  import { AddEditGroupActivity, TableGroupActivity, QueryGroupActivity, DetailGroupActivity, DetailGroupActivityEditLog, DetailGroupActivityItem, AddEditGroupItem } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Item",
    mixins: [mainMixin],
    components: {
      'add-edit-group-activity': AddEditGroupActivity,
      'query-group-activity': QueryGroupActivity,
      'table-group-activity': TableGroupActivity,
      'detail-group-activity': DetailGroupActivity,
      'detail-group-activity-edit-log': DetailGroupActivityEditLog,
      'detail-group-activity-item': DetailGroupActivityItem,
      'add-edit-group-item': AddEditGroupItem,
    },
    created() {
      documentTitle('团购 - 团购活动');
    }
  }
</script>

<style scoped>

</style>
