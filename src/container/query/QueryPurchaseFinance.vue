<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="12" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  class="query-item-input"
                  v-model="editQuery.supplier_name"
                  placeholder="输入供应商名称"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="supplier_name"
                />
                <el-input
                  size="small"
                  class="query-item-input"
                  v-model="editQuery.item_condition"
                  placeholder="输入商品名称/编号"
                  clearable
                  style="margin-left: 2px"
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="item_condition"
                />
                <el-button size="small" style="margin-left: 4px" type="primary" icon="el-icon-search" @click="changeQuery"></el-button>
                <!--<el-button v-if="!isExpand" class="query-item-reset" size="small" type="primary" plain @click="resetQuery">重置</el-button>-->
              </div>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="采购员">
              <my-select-buyer
                size="small"
                :isUseToQuery="true"
                v-model="editQuery.buyer_id"
                :provinceCode="province.code"
                @change="changeQuery"/>
              <el-button v-if="!isExpand" size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <my-button-group
                :options="{'待审核': '', '已审核': 1}"
                v-model="editQuery.if_check_opt"
                size="small"
                @change="changeQuery"
              />
              <el-button v-if="editQuery.if_check_opt == ''" size="small" class="query-item-reset-offset" type="primary" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7" v-if="editQuery.if_check_opt == 1">
            <my-query-item label="审核结果">
              <my-button-group
                :options="{'全部': '', '审核通过': 'second_check', '财务驳回' : 'second_decline'}"
                v-model="editQuery.opt_type"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7" v-if="editQuery.if_check_opt == 1">
            <my-query-item label="付款时间">
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
              <el-button v-if="editQuery.if_check_opt == 1" size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {Row, Col, Button, Input, DatePicker} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery, SelectBuyer} from '@/common';
  import queryMixin from './query.mixin';
  import { DataHandle } from '@/util';

  export default {
    name: "QueryPurchaseFinance",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-select-buyer': SelectBuyer,
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
          this.editQuery = Object.assign({}, this.editQuery, {
            begin_date: value[0],
            end_date: value[1]
          })
        } else {
          this.editQuery = Object.assign({}, this.editQuery, {
            begin_date: '',
            end_date: ''
          })
        }
      },
      changeQuery() {

        this.editQuery.if_check_opt == 1
          ? this.editQuery.status = ''
          : this.editQuery.status = 'first_checked'

        // 更新editQuery
        this.editQuery = Object.assign(this.editQuery, { page: 1 });
      },
      // 重置搜索
      resetQuery() {
        this.$data.pickerValue = null;
        this.$props.reset();
        this.$refs['supplier_name'].currentValue = '';
        this.$refs['item_condition'].currentValue = '';
      }
    }
  }
</script>

<style scoped>
  .wp-query {
    padding: 0 10px 15px;
    border-bottom: 1px solid #f3f4f6;
  }
</style>
