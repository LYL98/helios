<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="日期">
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
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', ...paidStatus}"
            v-model="query.paid_status"
            @change="handleQuery('TableFinanceSStatement')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="请输入供应商名称"
            v-model="query.condition"
            @search="handleQuery('TableFinanceSStatement')"
            @reset="handleClearQuery('TableFinanceSStatement')"
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
    name: "QueryFinanceSStatement",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        province_code: this.$province.code,
        picker_value: null,
        begin_date: '',
        end_date: '',
        paid_status: '',
        condition: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery), //只有一层，可以用Object.assign深拷贝
        paidStatus: Constant.S_STATEMENT_PAID_STATUS('value_key'),
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = query;
        this.handleQuery('TableFinanceSStatement');
      },
    }
  }
</script>

<style scoped>

</style>
