<template>
  <div>
    <add-edit-group-item-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupItemClass"/>
    <table-group-item-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupItemClass"/>
  </div>
</template>

<script>
  import { AddEditGroupItemClass, TableGroupItemClass } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "ItemClass",
    mixins: [viewMixin],
    components: {
      'add-edit-group-item-class': AddEditGroupItemClass,
      'table-group-item-class': TableGroupItemClass,
    },
    created() {
      documentTitle('团购 - 商品分类');
    }
  }
</script>

<style scoped>

</style>
