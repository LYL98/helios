<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="所在仓">
          <select-city
            size="small"
            :isUseToQuery="true"
            clearable
            v-model="query.city_code"
            :provinceCode="query.province_code"
            @change="handleQuery('TableMerchantRefund')"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="10" :lg="14" :span="14">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="门店名称、用户名称、电话"
              v-model="query.condition"
              class="query-item-input"
              clearable
              @keyup.enter.native="handleQuery('TableMerchantRefund')"
              @clear="handleQuery('TableMerchantRefund')"
            />
            <el-button type="primary" size="small" @click="handleQuery('TableMerchantRefund')" icon="el-icon-search" style="margin-left: 4px;"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableMerchantRefund')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Constant } from '@/util';
  import { SelectCity } from '@/common';
  import queryMixin from './query.mixin2';

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
