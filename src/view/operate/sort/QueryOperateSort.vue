<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateSort')" @reset="handleClearQuery('TableOperateSort')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryOperateSort",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        condition: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
