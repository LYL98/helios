<template>
  <div class="container-query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="类型">
          <button-group
            :options="{'全部': '', ...supplierType}"
            v-model="query.supplier_type"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="10" :lg="11" :span="11">
        <my-query-item label="账期类型">
          <button-group
            :options="{'全部': '', ...supplierBillTerm}"
            v-model="query.bill_term"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 16px;">
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="状态">
          <button-group
            :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
            v-model="query.is_freeze"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="审核状态">
          <button-group
            :options="{'全部': '', '已审核': 1, '未审核': 0}"
            v-model="query.is_audited"
            @change="handleQuery('TableSupplierList')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="供应商名称/联系人姓名/电话"
              clearable
              class="query-item-input"
              v-model="query.condition"
              @clear="handleQuery('TableSupplierList')"
              ref="search_condition"
              @keyup.enter.native="handleQuery('TableSupplierList')"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableSupplierList')" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableSupplierList')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { ButtonGroup } from '@/common';
  import queryMixin from './query.mixin2';
  import { Constant } from '@/util';

  export default {
    name: "QuerySupplierList",
    components: {
      'button-group': ButtonGroup
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        province_code: this.$province.code,
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
