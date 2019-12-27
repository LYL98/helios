<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col  :span="7">
        <my-query-item label="所在仓">
          <select-city
            size="small"
            clearable
            v-model="query.city_code"
            :provinceCode="query.province_code"
            @change="handleQuery('TableMerchantRefund')"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="门店名称/用户名称/电话"
            v-model="query.condition"
            @search="handleQuery('TableMerchantRefund')"
            @reset="handleClearQuery('TableMerchantRefund')"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Constant } from '@/util';
  import { SelectCity } from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItem",
    components: {
      'select-city': SelectCity
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        province_code: this.$province.code,
        city_code: '',
        condition: '',
        page: 1,
        page_size: Constant.PAGE_SIZE
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

<style scoped>

</style>
