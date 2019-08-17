<template>
  <div>
    <table-system-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableSystemBanner"/>
    <add-edit-system-banner :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditSystemBanner"/>
  </div>
</template>

<script>
  import { AddEditSystemBanner, TableSystemBanner } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "BannerList",
    mixins: [viewMixin],
    components: {
      'table-system-banner': TableSystemBanner,
      'add-edit-system-banner': AddEditSystemBanner,
    },
    
    created: function () {
      documentTitle("设置 - Banner管理");
    },
  }
</script>

<style scoped>

</style>
