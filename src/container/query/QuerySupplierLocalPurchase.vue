<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="采购日期">
          <el-date-picker size="small" v-model="query.order_date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="采购日期" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="供应商">
          <select-supplier size="small" v-model="query.supplier_id" :provinceCode="query.province_code" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="地采单号/商品编号/名称/供应商名称"
            v-model="query.condition"
            @search="handleQuery('TableSupplierLocalPurchase')"
            @reset="handleClearQuery('TableSupplierLocalPurchase')"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', ...purchaseStatus}"
            v-model="query.status"
            @change="handleQuery('TableSupplierLocalPurchase')"
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
  import { SelectSupplier } from '@/component';

  export default {
    name: "QuerySupplierLocalPurchase",
    components: {
      'select-option': SelectOption,
      'select-supplier': SelectSupplier
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        province_code: this.$province.code,
        order_date: '',
        supplier_id: '',
        status: '',
        condition: '',
      }
      return {
        purchaseStatus: Constant.PURCHASE_STATUS('value_key'),
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
