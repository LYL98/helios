<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <select-province
            v-model="editQuery.province_code"
            size="small"
            isAuth
            showAll
            clearable
            @change="selectProvince"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="县域">
          <my-select-city
            :disabled="editQuery.province_code ? false : true"
            size="small"
            showAll
            clearable
            v-model="editQuery.city_id"
            :provinceCode="editQuery.province_code"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="门店名称/用户名称/电话"
            v-model="editQuery.condition"
            @search="changeQuery"
            @reset="resetQuery"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="审核状态">
          <select-option
            :options="{'全部': '', '待审核': 0, '已审核': 1}"
            v-model="editQuery.is_audited"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="冻结状态">
          <select-option
            :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
            v-model="editQuery.is_freeze"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="商户性质">
          <select-option
            :options="{'全部': '', '非协议': 0, '协议': 1}"
            v-model="editQuery.is_post_pay"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="团购门店">
          <select-option
            :options="{'全部': '', '非团购': 0, '团购': 1}"
            v-model="editQuery.gb_included"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="创建时间">
          <el-date-picker
            size="small"
            v-model="pickerValue"
            style="width: 100%;"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="fixDateOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changePicker"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Row, Col, Input, Button, DatePicker} from 'element-ui';
  import {SelectOption, QueryItem, SelectProvince} from '@/common';
  import { SelectCity, GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryMerchantStore",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'my-select-city': SelectCity,
      'select-province': SelectProvince,
      'global-province': GlobalProvince,
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
      }
    },
    methods: {
      //查询选择区域后
      selectProvince(){
        this.editQuery.city_id = '';
        this.changeQuery();
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
