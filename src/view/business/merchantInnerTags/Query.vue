<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="标签名称"
            v-model="query.condition"
            @search="handleQuery('Table')"
            @reset="handleClearQuery('Table')"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
    },
    created() {
    },
    data() {
      let initQuery = {
        condition: '',
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
