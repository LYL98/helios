<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="类型">
          <select-option
            :options="{'全部': '', ...supplierType}"
            v-model="query.supplier_type"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="账期类型">
          <select-option
            :options="{'全部': '', ...supplierBillTerm}"
            v-model="query.bill_term"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="供应商名称/联系人姓名/电话"
            v-model="query.condition"
            @search="handleQuery('TableSupplierList')"
            @reset="handleClearQuery('TableSupplierList')"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
            v-model="query.is_freeze"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="审核状态">
          <select-option
            :options="{'全部': '', '待审核': 0, '已审核': 1}"
            v-model="query.is_audited"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
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
    name: "QuerySupplierList",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        supplier_type: '',
        bill_term: '',
        is_freeze: '',
        is_audited: '',
        condition: '',
      }
      return {
        supplierType: Constant.SUPPLIER_TYPE('value_key'),
        supplierBillTerm: Constant.SUPPLIER_BILL_TERM('value_key'),
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
