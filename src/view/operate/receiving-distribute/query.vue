<template>
  <div>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="商品编号/名称/供应商" size="small" @search="handleQuery('Table')" @reset="handleClearQuery('Table')"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { SelectOption, ButtonGroup } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "Query",
    components: {
      'select-option': SelectOption,
      'button-group': ButtonGroup
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
</style>
