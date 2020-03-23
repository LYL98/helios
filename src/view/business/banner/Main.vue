<template>
  <sub-menu>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
  </sub-menu>
</template>

<script>
  import Table from './Table';
  import AddEdit from './AddEdit';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "BannerList",
    mixins: [mainMixin],
    components: {
      'table-view': Table,
      'add-edit-view': AddEdit,
    },
    
    created: function () {
      documentTitle("业务 - Banner");
    },
  }
</script>

<style scoped>

</style>
