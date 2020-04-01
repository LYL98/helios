<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province :value="editQuery.province_code" isRequired type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="县域">
          <my-select-city
            size="small"
            placeholder="县域"
            clearable
            v-model="editQuery.city_id"
            :provinceCode="editQuery.province_code"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入门店名称"
              class="query-item-input"
              clearable
              @clear="changeQuery"
              v-model="editQuery.condition"
              @keyup.enter.native="changeQuery"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" @click="changeQuery" icon="el-icon-search"></el-button>
            <el-button v-if="!isExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px">
      <el-col :span="7">
        <my-query-item label="时间">
          <el-date-picker
            v-model="currentDateRange"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="fixDateOptions"
            :clearable="false"
            @change="changePicker">
          </el-date-picker>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="参团状态">
          <select-option
            :options="{'参过团': 1, '未参团': 0}"
            v-model="editQuery.is_group"
            @change="changeQuery"
            size="small"
          />
          <el-button v-if="isExpand" size="small" type="primary" class="query-item-reset-offset" plain @click="resetQuery">重置</el-button>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {DatePicker, Row, Col, Input, Button, Message} from 'element-ui';
  import { QueryItem, SelectOption } from '@/common';
  import { DataHandle, Constant } from '@/util';
  import { GlobalProvince, SelectCity } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryGroupBuyItemStatistics",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-select-city': SelectCity,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'global-province': GlobalProvince,
    },
    mixins: [queryMixin],
    created() {
      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));

      this.$data.resetBeginDate = DataHandle.formatDate(beginDate, 'yyyy-MM-dd')
      this.$data.resetEndDate = endDateStr

      this.currentDateRange.push(this.$data.resetBeginDate);
      this.currentDateRange.push(this.$data.resetEndDate);

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
        resetBeginDate: '',
        resetEndDate: '',
        backupSort: '',
        fixDateOptions: Constant.FIX_DATE_RANGE,
      }
    },
    watch: {
      currentDateRange: function (a, b) {
        this.beforeDateRange = b;
      }
    },
    props: {
      // 查询对象
      queryData: {type: Object, required: true},
      reset: {type: Function, required: true}
    },
    model: {
      prop: 'queryData',
      event: 'change'
    },
    computed: {
      editQuery: {
        get() {
          this.backupSort = this.$props.queryData.sort;
          return this.$props.queryData;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    methods: {
      //查询选择区域后【初始化】
      selectProvince(data){
        this.editQuery.province_code = data.code;
        this.changeQuery();
      },
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
      changeQuery() {
        //触发change事件
        this.editQuery = Object.assign({}, this.editQuery);
      },
      resetQuery() {
        //重置日期
        this.currentDateRange = [this.resetBeginDate, this.resetEndDate];

        //触发change事件
        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.province.code,
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate,
          city_id: '',
          sort: this.backupSort,
          condition: '',
          is_group: 1
        };

        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
