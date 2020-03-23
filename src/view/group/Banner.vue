<template>
  <sub-menu>
    <add-edit-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupBanner"/>
    <query-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupBanner"/>
    <table-group-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupBanner"/>
  </sub-menu>
</template>

<script>
  import { AddEditGroupBanner, TableGroupBanner, QueryGroupBanner } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Banner",
    mixins: [mainMixin],
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
