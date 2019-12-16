<template>
  <div class="container-query">
    <el-row style="margin-bottom: 16px;">
      <el-col :xl="8" :lg="9" :span="9">
        <my-query-item label="采购日期">
          <el-date-picker size="small" v-model="query.order_date" value-format="yyyy-MM-dd" placeholder="采购日期" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="供应商">
          <select-supplier size="small" v-model="query.supplier_id" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xl="8" :lg="9" :span="9">
        <my-query-item label="审核状态">
          <button-group
            :options="{'全部': '', ...localPurchaseStatus}"
            v-model="query.status"
            @change="handleQuery('TableSupplierLocalPurchase')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="地采单号/商品编号/名称/供应商名称"
              clearable
              class="query-item-input"
              v-model="query.condition"
              @clear="handleQuery('TableSupplierLocalPurchase')"
              ref="search_condition"
              @keyup.enter.native="handleQuery('TableSupplierLocalPurchase')"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableSupplierLocalPurchase')" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableSupplierLocalPurchase')">重置</el-button>
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
  import { SelectSupplier } from '@/component';

  export default {
    name: "QuerySupplierLocalPurchase",
    components: {
      'button-group': ButtonGroup,
      'select-supplier': SelectSupplier
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.order_date = this.nowDate;
      this.$data.query.order_date = this.nowDate;
    },
    data() {
      let initQuery = {
        order_date: '',
        supplier_id: '',
        status: '',
        condition: '',
      }
      return {
        localPurchaseStatus: Constant.LOCAL_PURCHASE_STATUS('value_key'),
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
