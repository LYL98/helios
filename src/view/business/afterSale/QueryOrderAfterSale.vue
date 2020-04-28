<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="editQuery.province_code" type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="县域">
          <select-city size="small" v-model="editQuery.city_id" placeholder="全部" clearable showAll :disabled="editQuery.province_code ? false : true"
                          :provinceCode="editQuery.province_code" @change="changeQuery"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="editQuery.condition" placeholder="售后单号/门店名称/商品编号/名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="处理类型">
          <select-option
            size="small"
            v-model="editQuery.opt_type"
            :options="afterSaleOptType"
            @change="changeQuery"
            placeholder="处理类型"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="客服">
          <select-operator v-model="editQuery.operator_id" size="small" placeholder="请选择客服" showAll post="service" @change="changeQuery" clearable filterable/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="下单时间">
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
            @change="(v) => changePicker(v, 'base')"
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="处理时间">
          <el-date-picker
            size="small"
            v-model="handlePickerValue"
            type="daterange"
            align="left"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="fixDateOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="(v) => changePicker(v, 'handle')"
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="等级">
          <div class="grade">
            <div :class="`grade7 ${editQuery.flag_7 && 'active'}`" @click="changeFlag('flag_7')">超过7小时未完成</div>
            <div :class="`grade2 ${editQuery.flag_2 && 'active'}`" @click="changeFlag('flag_2')">超过2小时未回应</div>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col, Select, Option, DatePicker, Button, Input } from 'element-ui';
  import { SelectOption, QueryItem } from '@/common';
  import { GlobalProvince, SelectCity, SelectOperator } from "@/component";
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
      'select-city': SelectCity,
      'select-operator': SelectOperator,
      'my-query-item': QueryItem,
      'global-province': GlobalProvince,
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
        handlePickerValue: null,
        initProvinceCode: ''
      }
    },
    computed: {
      afterSaleOptType(){
        let d = Constant.AFTER_SALE_OPT_TYPE('value_key');
        delete d['缺货/错货'];
        return {'': '全部', ...d};
      }
    },
    methods: {
      //选择区域后
      selectProvince(data, type){
        this.editQuery.city_id = '';
        if(type === 'init'){
          this.initProvinceCode = data.code;
        }
        this.changeQuery();
      },
      //搜索日期
      changePicker(value, type){
        let types = {
          'base': ['begin_date', 'end_date'],
          'handle': ['handle_begin_date', 'handle_end_date']
        }
        let field = types[type];
        if(value && value.length === 2){
          this.editQuery[field[0]] = value[0];
          this.editQuery[field[1]] = value[1];
        }else{
          this.editQuery[field[0]] = '';
          this.editQuery[field[1]] = '';
        }
        this.editQuery.page = 1;
        this.editQuery = Object.assign({}, this.editQuery);
      },
      judgeFlag(type){
        let { editQuery } = this;
        if(!editQuery.flag) return false;
        if(editQuery.flag.indexOf(type) >= 0) return true;
        return false;
      },
      //选择旗子
      changeFlag(type){
        let { editQuery } = this;
        if(type === 'flag_7'){
          editQuery.flag_7 = editQuery.flag_7 ? null : 1;
        }
        if(type === 'flag_2'){
          editQuery.flag_2 = editQuery.flag_2 ? null : 1;
        }
        this.editQuery = Object.assign({}, this.editQuery);
      },

      resetQuery() {
        this.$data.pickerValue = null;
        this.$data.handlePickerValue = null;
        this.$props.reset({province_code: this.initProvinceCode});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grade{
    display: flex;
    align-items: center;
    >div{
      border-radius: 3px;
      padding: 5px 8px;
      margin-right: 8px;
      white-space: nowrap;
      overflow: hidden;
      opacity: .3;
      &:last-child{
        margin-right: 0px;
      }
      &:hover{
        font-weight: bold;
        cursor: pointer;
      }
      &.active{
        opacity: 1;
      }
      //超过七小时
      &.grade7{
        background: #FF2828;
        color: #fff;
      }
      //超过两小时
      &.grade2{
        background: #8D59F7;
        color: #fff;
      }
    }
  }
</style>
