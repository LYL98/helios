<template>
  <div class="container-query">
    <el-row style="margin-bottom: 16px;">
      <!--流水页面-->
      <template v-if="page === 'sBDetail'">
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="流水类型">
            <el-select v-model="query.bill_reason" size="small" class="query-item-select" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <template v-for="(key, value) in billReason">
                <el-option :label="value" :value="key" :key="key"></el-option>
              </template>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="结款类型">
            <button-group
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
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="流水类型">
            <el-select v-model="query.bill_reason" size="small" class="query-item-select" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <template v-for="(key, value) in billReason">
                <el-option :label="value" :value="key" :key="key" v-if="key === 'distribution' || key === 'other'"></el-option>
              </template>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="审核状态">
            <el-select v-model="query.audit_status" size="small" class="query-item-select" clearable @change="handleQuery('TableFinanceSBDetail')">
              <el-option label="全部" value=""></el-option>
              <el-option :label="key" :value="value" v-for="(value, key) in auditStatus" :key="key"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </template>

      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入供应商名称"
              clearable
              class="query-item-input"
              v-model="query.condition"
              @clear="handleQuery('TableFinanceSBDetail')"
              ref="search_condition"
              @keyup.enter.native="handleQuery('TableFinanceSBDetail')"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableFinanceSBDetail')" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableFinanceSBDetail')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
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
    </el-row>
  </div>
</template>

<script>
  import { ButtonGroup } from '@/common';
  import queryMixin from './query.mixin2';
  import { Constant } from '@/util';

  export default {
    name: "QueryFinanceSBDetail",
    components: {
      'button-group': ButtonGroup
    },
    mixins: [queryMixin],
    props: {
      page: { type: String, default: '' }, //审核页面：sBDetailAudit, 流水页面：sBDetail
    },
    data() {
      let initQuery = {
        picker_value: null,
        audit_status: this.page === 'sBDetail' ? 'success' : '',
        begin_date: '',
        end_date: '',
        bill_reason: '',
        bill_term: '',
        condition: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery), //只有一层，可以用Object.assign深拷贝
        billReason: Constant.SUPPLIER_BILL_REASON('value_key'),
        billTerm: Constant.SUPPLIER_BILL_TERM2('value_key'),
        auditStatus: Constant.AUDIT_STATUS('value_key'),
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
