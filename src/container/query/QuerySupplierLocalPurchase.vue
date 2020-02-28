<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="采购日期">
          <el-date-picker size="small" v-model="query.order_date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="采购日期" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="送达仓">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="反采单号/商品编号/名称/供应商名称"
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
            :options="purchaseStatus"
            v-model="query.status"
            @change="handleQuery('TableSupplierLocalPurchase')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="供应商">
          <select-supplier size="small" v-model="query.supplier_id" :provinceCode="query.province_code" @change="handleQuery('TableSupplierLocalPurchase')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';
  import { SelectSupplier, SelectStorehouse } from '@/component';

  export default {
    name: "QuerySupplierLocalPurchase",
    components: {
      'select-option': SelectOption,
      'select-supplier': SelectSupplier,
      'select-storehouse': SelectStorehouse
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
        for_pre: 0, //1预采 0反采
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    },
    computed: {
      purchaseStatus(){
        let d = Constant.PURCHASE_STATUS('value_key');
        delete d['待审核'];
        delete d['作废'];
        return { '全部': '', ...d};
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
