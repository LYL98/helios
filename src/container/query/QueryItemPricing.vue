<template>
  <!-- 头部start -->
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="销售日期">
            <el-date-picker
              v-model="query.opt_date"
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
              style="width: 100%;"
              @change="handleQuery('TableItemPricing')"
            >
            </el-date-picker>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="采购员">
            <select-buyer size="small" :provinceCode="query.province_code" v-model="query.buyer_id" @change="handleQuery('TableItemPricing')" />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="请输入商品名称/编号" size="small" @search="handleQuery('TableItemPricing')" @reset="handleClearQuery('TableItemPricing')"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { SelectBuyer } from '@/component';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItemPricing",
    components: {
      'select-buyer': SelectBuyer,
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.opt_date = this.today;
      this.$data.query.opt_date = this.today;
    },
    data() {
      let initQuery = {
        province_code: this.$province.code,
        opt_date: '',
        buyer_id: '',
        sort: '',
        condition: ''
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
