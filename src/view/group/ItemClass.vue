<template>
  <sub-menu>
    <add-edit-group-item-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditGroupItemClass"/>
    <table-group-item-class :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupItemClass"/>
  </sub-menu>
</template>

<script>
  import { AddEditGroupItemClass, TableGroupItemClass } from '@/container';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "ItemClass",
    mixins: [mainMixin],
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
