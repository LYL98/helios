<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <el-select v-model="editQuery.status" size="small" class="query-item-select" clearable @change="changeQuery">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="wait_check"></el-option>
                <el-option label="审核通过" value="checked"></el-option>
                <el-option label="被驳回" value="declined"></el-option>
              </el-select>
            </my-query-item>
          </el-col>
          <el-col :xl="10" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  clearable
                  class="query-item-input"
                  placeholder="商户名称"
                  v-model="editQuery.merchant_title"
                  @clear="changeQuery"
                  @keyup.enter.native="changeQuery"
                  ref="merchant_title"
                ></el-input>
                <el-input
                  size="small"
                  clearable
                  class="query-item-input"
                  style="margin-left: 2px"
                  placeholder="提交人名称、审核人名称"
                  v-model="editQuery.operator_name"
                  @clear="changeQuery"
                  @keyup.enter.native="changeQuery"
                  ref="operator_name"
                ></el-input>
                <el-button size="small" type="primary" icon="el-icon-search" style="margin-left: 4px;" @click="changeQuery"></el-button>
                <el-button v-if="!isExpand" size="small" type="primary" plain class="query-item-reset" @click="resetQuery">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="类型">
              <select-option
                size="small"
                v-model="editQuery.reason"
                :options="{'全部': '', '充值': 'manual_topup', '扣款': 'manual_deduct'}"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="提交时间">
              <el-date-picker
                size="small"
                v-model="pickerValue"
                type="daterange"
                align="left"
                value-format="yyyy-MM-dd"
                unlink-panels
                :picker-options="fixDateOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changePicker"
                class="query-item-date"
              />
              <el-button size="small" type="primary" plain @click="resetQuery" class="query-item-reset">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {Row, Col, Input, Button, DatePicker, Select, Option} from 'element-ui';
  import {SelectOption, QueryItem, CollapseQuery} from '@/common';
  import {SelectCity} from '@/container';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryFinanceApprove",
    components: {
      CollapseQuery,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'my-select-city': SelectCity,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.editQuery.begin_date = value[0];
          this.editQuery.end_date = value[1];
        }else{
          this.editQuery.begin_date = '';
          this.editQuery.end_date = '';
        }
        this.editQuery.page = 1;
        this.editQuery = Object.assign({}, this.editQuery);
      },
      resetQuery() {
        this.pickerValue = null;
        this.$props.reset();
        this.$refs['merchant_title'].currentValue = '';
        this.$refs['operator_name'].currentValue = '';
      }
    }
  }
</script>

<style scoped>
</style>
