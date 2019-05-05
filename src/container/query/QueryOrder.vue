<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="订单状态">
              <el-select size="small" v-model="editQuery.status"
                         class="query-item-select"
                         @change="changeQuery" placeholder="订单状态" clearable>
                <el-option v-for="(item, key) in orderStatus" :key="key" :label="item" :value="key"></el-option>
              </el-select>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
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
                class="query-item-date"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="8" :lg="10" :span="10">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  placeholder="订单号或门店名称"
                  v-model="editQuery.condition"
                  class="query-item-input"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="condition"
                />
                <el-button size="small" type="primary" style="margin-left: 4px" @click="changeQuery" icon="el-icon-search"></el-button>
                <el-button v-if="!isExpand" size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="所在仓">
              <my-select-city
                size="small"
                :isUseToQuery="true"
                v-model="editQuery.city_code"
                placeholder="所在仓"
                clearable
                :provinceCode="query.province_code"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="付款状态">
              <my-button-group
                v-model="editQuery.pay_status"
                :options="{ '全部': '', '未付清': 'wait_complete', '已付清': 'done' }"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="订单性质">
              <my-button-group
                v-model="editQuery.to_be_canceled"
                :options="{ '全部': '', '现付订单': 1, '后付订单': 0 }"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 16px">
          <el-col :xl="6" :lg="7" :span="7">
            <!--<my-query-item label="订单类型">-->
              <!--<el-select size="small" v-model="editQuery.order_type"-->
                         <!--class="query-item-select"-->
                         <!--@change="changeQuery" placeholder="订单类型" clearable>-->
                <!--<el-option v-for="(item, key) in orderType" :key="key" :label="item" :value="key"></el-option>-->
              <!--</el-select>-->
              <!--<el-button size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>-->
            <!--</my-query-item>-->
            <my-query-item label="订单类型">
              <my-button-group
                v-model="editQuery.order_type"
                :options="{ '全部': '', '普通订单': 'normal', '预售订单': 'presale' }"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {Row, Col, Select, Option, DatePicker, Button, Input} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery} from '@/common';
  import {SelectCity} from "@/container";
  import { Constant } from '@/util';
  import { queryMixin } from '@/mixins';

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
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-select-city': SelectCity,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
        orderStatus: {
          wait_confirm: '待确认',
          wait_delivery: '待发货',
          deliveried: '待收货',
          order_done: '已完成',
          order_canceled: '已取消'
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
        this.$refs['condition'].currentValue = '';
      }
    }
  }
</script>

<style scoped>

</style>
