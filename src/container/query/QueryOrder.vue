<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="订单状态">
          <select-option
            v-model="editQuery.status"
            :options="orderStatus"
            @change="changeQuery"
            size="small"
            placeholder="订单状态"
            clearable
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="创建时间">
          <el-date-picker
            size="small"
            v-model="pickerValue"
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
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="订单号/门店名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="所在仓">
          <my-select-city
            size="small"
            v-model="editQuery.city_code"
            placeholder="所在仓"
            clearable
            :provinceCode="query.province_code"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="付款状态">
          <select-option
            v-model="editQuery.pay_status"
            :options="{ '全部': '', '未付清': 'wait_complete', '已付清': 'done' }"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="订单性质">
          <select-option
            v-model="editQuery.to_be_canceled"
            :options="{ '全部': '', '现付订单': 1, '后付订单': 0 }"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px">
      <el-col :span="7">
        <my-query-item label="订单类型">
          <select-option
            v-model="editQuery.order_type"
            :options="{ '全部': '', '普通订单': 'normal', '预售订单': 'presale' }"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col, Select, Option, DatePicker, Button, Input } from 'element-ui';
  import { SelectOption, QueryItem, CollapseQuery} from '@/common';
  import { SelectCity } from "@/container";
  import { Constant } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryOrder",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-select': Select,
      'el-option': Option,
      'el-date-picker': DatePicker,
      'el-button': Button,
      'el-input': Input,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-select-city': SelectCity,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
        orderStatus: {
          '全部': '',
          '待确认': 'wait_confirm',
          '待发货': 'wait_delivery',
          '待收货': 'deliveried',
          '已完成': 'order_done',
          '已取消': 'order_canceled'
        },
        orderType: {
          normal: '普通订单',
          gb_order: '团购订单',
          presale: '预售订单'
        }
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
        this.$data.pickerValue = null;
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
