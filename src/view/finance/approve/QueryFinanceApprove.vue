<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province type="select" isRequired @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="搜索">
          <el-input
            size="small"
            clearable
            placeholder="商户名称"
            v-model="editQuery.merchant_title"
            @clear="changeQuery"
            @keyup.enter.native="changeQuery"
          ></el-input>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="editQuery.operator_name" placeholder="提交人名称、审核人名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="审核状态">
          <el-select v-model="editQuery.status" size="small" style="width: 100%;" clearable @change="changeQuery">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="wait_check"></el-option>
            <el-option label="审核通过" value="checked"></el-option>
            <el-option label="被驳回" value="declined"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="类型">
          <select-option
            size="small"
            v-model="editQuery.reason"
            :options="{'全部': '', '充值': 'manual_topup', '扣款': 'manual_deduct'}"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
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
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col, Input, Button, DatePicker, Select, Option } from 'element-ui';
  import { SelectOption, QueryItem } from '@/common';
  import { GlobalProvince, SelectCity } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryFinanceApprove",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'global-province': GlobalProvince,
      'my-select-city': SelectCity
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
      }
    },
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data){
        this.$emit('change', this.editQuery);
      },
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
      }
    }
  }
</script>

<style scoped>
</style>
