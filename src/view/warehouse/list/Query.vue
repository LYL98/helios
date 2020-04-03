<template>
  <!-- 头部start -->
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="仓">
          <select-storehouse size="small" v-model="query.storehouse_id" isAuth clearable @change="handleQuery('Table')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectStorehouse } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
      'select-storehouse': SelectStorehouse
    },
    created() {
    },
    data() {
      let initQuery = {
        storehouse_id: '',
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
