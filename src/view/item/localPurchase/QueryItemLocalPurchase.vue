<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="采购日期">
          <el-date-picker size="small" v-model="query.order_date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="采购日期" @change="handleQuery('TableItemLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="送达仓">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="handleQuery('TableItemLocalPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="反采单号/商品编号/名称/供应商名称"
            v-model="query.condition"
            @search="handleQuery('TableItemLocalPurchase')"
            @reset="handleClearQuery('TableItemLocalPurchase')"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="供应商">
          <select-supplier size="small" v-model="query.supplier_id" :provinceCode="query.province_code" @change="handleQuery('TableItemLocalPurchase')" filterable/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';
  import { SelectSupplier, SelectStorehouse } from '@/component';

  export default {
    name: "QueryItemLocalPurchase",
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
        tar_storehouse_id: '',
        order_date: '',
        supplier_id: '',
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
