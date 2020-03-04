<template>
  <div>
    <table-view :getPageComponents="viewGetPageComponents" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" ref="AddEdit"/>
  </div>
</template>

<script>
  import Table from './Table';
  import AddEdit from './AddEdit';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "BannerList",
    mixins: [viewMixin],
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
