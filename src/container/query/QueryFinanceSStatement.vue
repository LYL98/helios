<template>
  <div class="container-query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
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
            class="query-item-date"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', ...paidStatus}"
            v-model="query.paid_status"
            @change="handleQuery('TableFinanceSStatement')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入供应商名称"
              clearable
              class="query-item-input"
              v-model="query.condition"
              @clear="handleQuery('TableFinanceSStatement')"
              ref="search_condition"
              @keyup.enter.native="handleQuery('TableFinanceSStatement')"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableFinanceSStatement')" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableFinanceSStatement')">重置</el-button>
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
