<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="时间">
          <el-date-picker
            v-model="selectDate"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="query-item-date"
            :clearable="false"
            @change="changeDate">
          </el-date-picker>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="科学分类">
          <select-system-class size="small" v-model="editQuery.system_class_codes" @change="selectSystemClass" style="max-width: 224px;"/>
        </my-query-item>
      </el-col>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入商品名称或编号"
              class="query-item-input"
              clearable
              @clear="changeQuery"
              v-model="editQuery.item_condition"
              @keyup.enter.native="changeQuery"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" @click="changeQuery" icon="el-icon-search"></el-button>
            <el-button v-if="!isExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {DatePicker, Row, Col, Input, Button, Message} from 'element-ui';
  import { QueryItem, CollapseQuery, SelectSystemClass } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItemDailyAnalysis",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'select-system-class': SelectSystemClass,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    created() {
      let today = new Date();
      let yesterday = new Date(today.setDate(today.getDate() - 1));
      this.resetDate = DataHandle.formatDate(yesterday, 'yyyy-MM-dd');
      this.selectDate = this.resetDate;
      let { province } = this;
      if(province.code){
        this.editQuery.province_code = province.code;
      }
      this.changePicker(this.currentDateRange)
    },
    data() {
      return {
        currentDateRange: [],
        beforeDateRange: [],
        resetDate: '',
        selectItemName: '',
        selectDate: ''
      }
    },
    watch: {
      currentDateRange: function (a, b) {
        this.beforeDateRange = b;
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        if (value && value.length === 2) {
          //判断时间段是否超过31天
          let beginDate = Date.parse(value[0]);
          let endDate = Date.parse(value[1]);
          let interval = endDate - beginDate;
          if (interval >= 31*24*60*60*1000) {
            //时间超过31天
            Message({
              showClose: true,
              message: '日期间隔必须小于31天',
              type: 'error'
            });
            this.currentDateRange = this.beforeDateRange;
            return
          } else {
            //时间有效
            this.editQuery.begin_date = value[0];
            this.editQuery.end_date = value[1];
          }
        } else {
          this.editQuery.begin_date = '';
          this.editQuery.end_date = '';
        }

        //触发change事件
        this.editQuery = Object.assign({}, this.editQuery);
      },
      //选择科学分类
      selectSystemClass(value, data){
        if(value.length === 0){
          this.editQuery.system_class_code = '';
        }else{
          this.editQuery.system_class_code = data.code;
        }
        this.changeQuery();
      },
      changeQuery() {
        //触发change事件
        this.editQuery = Object.assign({}, this.editQuery);
      },
      changeDate() {
        this.editQuery.opt_date = this.selectDate;
        this.changeQuery();
      },
      resetQuery() {
        //触发change事件
        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.province.code,
          opt_date: this.resetDate,
          system_class_codes: [],
          system_class_code: '',
          item_condition: '',
        };
        this.selectDate = this.resetDate;
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
