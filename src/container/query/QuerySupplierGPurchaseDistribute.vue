<template>
  <div class="container-query">
    <el-row>
      <el-col :xl="8" :lg="9" :span="9">
        <my-query-item label="审核状态">
          <select-option
            :options="{'全部': '', ...auditStatus}"
            v-model="query.audit_status"
            @change="handleQuery('TableSupplierGPurchaseDistribute')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="供应商名称/商品名称"
              clearable
              class="query-item-input"
              v-model="query.condition"
              @clear="handleQuery('TableSupplierGPurchaseDistribute')"
              ref="search_condition"
              @keyup.enter.native="handleQuery('TableSupplierGPurchaseDistribute')"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableSupplierGPurchaseDistribute')" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableSupplierGPurchaseDistribute')">重置</el-button>
          </div>
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
    name: "QuerySupplierGPurchaseDistribute",
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
