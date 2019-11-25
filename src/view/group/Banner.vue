<template>
  <div>
    <add-edit-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupBanner"/>
    <query-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupBanner"/>
    <table-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupBanner"/>
  </div>
</template>

<script>
  import { AddEditGroupBanner, TableGroupBanner, QueryGroupBanner } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "Banner",
    mixins: [viewMixin],
    components: {
      'add-edit-group-banner': AddEditGroupBanner,
      'query-group-banner': QueryGroupBanner,
      'table-group-banner': TableGroupBanner
    },
    created() {
      documentTitle('团购 - Banner管理');
    }
  }
</script>

<style scoped>

</style>
