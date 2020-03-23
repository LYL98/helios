<template>
  <div class="container-query">
    <el-row :gutter="32" style="margin-bottom: 16px;">
      <!--流水页面-->
      <template v-if="page === 'sBDetail'">
        <el-col :span="7">
          <my-query-item label="流水类型">
            <el-select v-model="query.bill_reason" size="small" style="width: 100%;" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <template v-for="(key, value) in billReason">
                <el-option :label="value" :value="key" :key="key"></el-option>
              </template>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="结款类型">
            <select-option
              :options="{'全部': '', ...billTerm}"
              v-model="query.bill_term"
              @change="handleQuery('TableFinanceSBDetail')"
              size="small"
            />
          </my-query-item>
        </el-col>
      </template>
      <!--流水审核页面-->
      <template v-else-if="page === 'sBDetailAudit'">
        <el-col :span="7">
          <my-query-item label="流水类型">
            <el-select v-model="query.bill_reason" size="small" style="width: 100%;" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <template v-for="(key, value) in billReason">
                <el-option :label="value" :value="key" :key="key" v-if="key === 'distribution' || key === 'other'"></el-option>
              </template>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="审核状态">
            <el-select v-model="query.audit_status" size="small" style="width: 100%;" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <el-option :label="key" :value="value" v-for="(value, key) in auditStatus" :key="key"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </template>

      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="请输入供应商名称"
            v-model="query.condition"
            @search="handleQuery('TableFinanceSBDetail')"
            @reset="handleClearQuery('TableFinanceSBDetail')"
          />
        </my-query-item>
      </el-col>
    </el-row>
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
        <my-query-item label="结款状态">
          <select-option
            :options="{'全部': '', ...paidStatus}"
            v-model="query.paid_status"
            @change="handleQuery('TableFinanceSBDetail')"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryFinanceSBDetail",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    props: {
      page: { type: String, default: '' }, //审核页面：sBDetailAudit, 流水页面：sBDetail
    },
    data() {
      let initQuery = {
        picker_value: null,
        audit_status: this.page === 'sBDetail' ? 'success' : '',
        created_by: this.page === 'sBDetailAudit' ? 'manual' : '',
        begin_date: '',
        end_date: '',
        bill_reason: '',
        bill_term: '',
        paid_status: '',
        condition: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery), //只有一层，可以用Object.assign深拷贝
        billReason: Constant.SUPPLIER_BILL_REASON('value_key'),
        billTerm: Constant.SUPPLIER_BILL_TERM2('value_key'),
        auditStatus: Constant.AUDIT_STATUS('value_key'),
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
        this.handleQuery('TableFinanceSBDetail');
      },
    }
  }
</script>

<style scoped>

</style>
