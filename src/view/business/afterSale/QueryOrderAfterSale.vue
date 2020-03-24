<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="售后单状态">
          <select-option
            size="small"
            v-model="editQuery.status"
            :options="{ '全部': '', '待处理': 'waiting_dispose', '已完成': 'close' }"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="搜索">
          <el-input
            size="small"
            clearable
            placeholder="售后单号/门店名称"
            v-model="editQuery.condition"
            @keyup.enter.native="changeQuery"
            @clear="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="editQuery.item" placeholder="商品编号/名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="处理类型">
          <select-option
            size="small"
            v-model="editQuery.opt_type"
            :options="{ '全部': '', ...afterSaleOptType }"
            @change="changeQuery"
            placeholder="处理类型"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="县域">
          <my-select-city size="small" v-model="editQuery.city_id" placeholder="县域" clearable
                          :provinceCode="editQuery.province_code" @change="changeQuery"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
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
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Row, Col, Select, Option, DatePicker, Button, Input} from 'element-ui';
  import {SelectOption, QueryItem} from '@/common';
  import {SelectCity} from "@/component";
  import { Constant } from '@/util';
  import queryMixin from '@/share/mixin/query.mixin';

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
      'select-option': SelectOption,
      'my-select-city': SelectCity,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
        afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE('value_key')
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
