<template>
  <div class="container-query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="售后单状态">
          <my-button-group
            size="small"
            v-model="editQuery.status"
            :options="{ '全部': '', '待处理': 'waiting_dispose', '已完成': 'close' }"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="10" :lg="14" :span="14">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              clearable
              placeholder="售后单号/门店名称"
              v-model="editQuery.condition"
              class="query-item-input"
              @keyup.enter.native="changeQuery"
              @clear="changeQuery"
              ref="condition"
            />
            <el-input
              size="small"
              clearable
              placeholder="商品编号或名称"
              v-model="editQuery.item"
              class="query-item-input"
              style="margin-left: 2px"
              @keyup.enter.native="changeQuery"
              @clear="changeQuery"
              ref="item"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" @click="changeQuery" icon="el-icon-search"></el-button>
            <el-button size="small" type="primary" v-if="!isExpand" class="query-item-reset" plain @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 16px;">
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="处理类型">
          <el-select size="small" v-model="editQuery.opt_type" class="query-item-select" placeholder="处理类型" clearable  @change="changeQuery">
            <el-option v-for="(item, key) in afterSaleOptType" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="所在仓">
          <my-select-city size="small" :isUseToQuery="true" v-model="editQuery.city_code" placeholder="所在仓" clearable
                          :provinceCode="query.province_code" @change="changeQuery"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="下单日期">
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
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Row, Col, Select, Option, DatePicker, Button, Input} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery} from '@/common';
  import {SelectCity} from "@/container";
  import { Constant } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryOrderAfterSale",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-select': Select,
      'el-option': Option,
      'el-date-picker': DatePicker,
      'el-button': Button,
      'el-input': Input,
      'my-button-group': ButtonGroup,
      'my-select-city': SelectCity,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
        afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE
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
        this.$refs['item'].currentValue = '';
      }
    }
  }
</script>

<style scoped>

</style>
