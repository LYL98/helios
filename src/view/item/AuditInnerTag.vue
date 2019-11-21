<template>
  <div>
    <query-item-audit-inner-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemAuditInnerTag"/>
    <table-item-audit-inner-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemAuditInnerTag"/>
  </div>
</template>

<script>
  import { QueryItemAuditInnerTag, TableItemAuditInnerTag } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'AuditInnerTag',
    components: {
      'query-item-audit-inner-tag': QueryItemAuditInnerTag,
      'table-item-audit-inner-tag': TableItemAuditInnerTag
    },
    mixins: [viewMixin],
    created() {
      documentTitle("商品 - 审核商品价格标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>