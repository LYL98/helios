<template>
  <el-pagination
    v-if="pageComponent.dataItem.num > 0"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 20, 30, 40, 50]"
    @size-change="pageComponent.changePageSize"
    @current-change="pageComponent.changePage"
    :total="pageComponent.dataItem.num"
    :page-size="pageComponent.query.page_size"
    :current-page="pageComponent.query.page"
  />
</template>

<script>
  import { Pagination } from 'element-ui';
  export default {
    name: 'Pagination',
    components: {
      'el-pagination': Pagination
    },
    props: {
      pageComponent: { type: Object, default: [] }
    },
  }
</script>
<style lang="scss" scoped>
  @import './table.scss';
</style>
