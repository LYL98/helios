<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="editQuery.title" placeholder="商户名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryFinanceBalance",
    mixins: [queryMixin],
    components: {
    },
    methods: {
      resetQuery() {
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
