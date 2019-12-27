<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="审核状态">
          <select-option
            :options="{'全部': '', ...auditStatus}"
            v-model="query.audit_status"
            @change="handleQuery('TableSupplierGPurchase')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="供应商名称/商品名称" size="small" @search="handleQuery('TableSupplierGPurchase')" @reset="handleClearQuery('TableSupplierGPurchase')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QuerySupplierGPurchase",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        audit_status: '',
        condition: '',
      }
      return {
        auditStatus: Constant.AUDIT_STATUS('value_key'),
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
