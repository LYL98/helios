<template>
  <!-- 头部start -->
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateLine')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="线路名称/编号"
            v-model="query.condition"
            @search="handleQuery('TableOperateLine')"
            @reset="handleClearQuery('TableOperateLine')"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
  <!-- 头部end -->
</template>

<script>
  import { Http, Config } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryOperateLine",
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = this.today;
    },
    data() {
      let initQuery = {
        province_code: this.$province.code,
        delivery_date: '',
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
