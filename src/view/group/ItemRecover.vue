<template>
  <sub-menu>
    <query-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryGroupItem" page="recover"/>
    <table-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableGroupItem" page="recover"/>
    <detail-group-item :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailGroupItem" page="recover"/>
  </sub-menu>
</template>

<script>
  import TableGroupItem from './TableGroupItem';
  import QueryGroupItem from './QueryGroupItem';
  import DetailGroupItem from './DetailGroupItem';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "ItemRecover",
    mixins: [mainMixin],
    components: {
      'query-group-item': QueryGroupItem,
      'table-group-item': TableGroupItem,
      'detail-group-item': DetailGroupItem
    },
    created() {
      documentTitle('团购 - 商品恢复');
    }
  }
</script>

<style scoped>

</style>
