<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="采购日期">
          <el-date-picker size="small" v-model="query.order_date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="采购日期" @change="handleQuery('TableItemGPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="送达仓">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="handleQuery('TableItemGPurchase')"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="采购单号/商品编号/名称" size="small" @search="handleQuery('TableItemGPurchase')" @reset="handleClearQuery('TableItemGPurchase')"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', ...purchaseStatus}"
            v-model="query.status"
            @change="handleQuery('TableItemGPurchase')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="供应商">
          <select-supplier supplierType="global_pur" size="small" v-model="query.supplier_id" @change="handleQuery('TableItemGPurchase')" filterable/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="创建时间">
          <el-date-picker
            size="small"
            v-model="query.picker_value"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="fixDateOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changePicker"
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { SelectSupplier, SelectStorehouse } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryItemGPurchase",
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
        order_date: '',
        status: '',
        condition: '',
        tar_storehouse_id: '',
        supplier_id: '',
        picker_value: null,
        begin_date: '',
        end_date: '',
        for_pre: 1, //1预采 0反采
      }
      return {
        purchaseStatus: Constant.PURCHASE_STATUS('value_key'),
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.$data.query = this.query;
        this.handleQuery('TableItemGPurchase');
      },
    }
  }
</script>

<style scoped>

</style>
