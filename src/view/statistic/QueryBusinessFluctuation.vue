<template>
  <div class="query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province :value="editQuery.province_code" isRequired type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="片区">
          <my-select-zone v-model="editQuery.zone_id"
                          :provinceCode="editQuery.province_code"
                          clearable
                          size="small"
                          @change="changeQuery"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="波动指标">
          <el-select v-model="editQuery.selectType" @change="changeQuery"
                     size="small" class="query-item-select">
            <el-option label="下单门店数" value="merchant"></el-option>
            <el-option label="GMV" value="gmv"></el-option>
            <el-option label="订单应付金额" value="real_price"></el-option>
            <el-option label="优惠金额" value="bonus_promotion"></el-option>
            <el-option label="客单价" value="customer"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="10">
        <my-query-item label="时间段">
          <el-date-picker
            size="small"
            v-model="currentDateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="fixDateOptions"
            :clearable="false"
            class="query-item-date"
            @change="changePicker">
          </el-date-picker>
          <el-button size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { DatePicker, Row, Col, Input, Button, Message, Select, Option } from 'element-ui';
  import { QueryItem, SelectZone } from '@/common';
  import { GlobalProvince } from '@/component';
  import { DataHandle, Constant } from '@/util';

  export default {
    name: "QueryBusinessFluctuation",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'my-select-zone': SelectZone,
      'my-query-item': QueryItem,
      'global-province': GlobalProvince,
    },
    created() {
      //设置默认日期范围
      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));

      this.resetBeginDate = DataHandle.formatDate(beginDate, 'yyyy-MM-dd')
      this.resetEndDate = endDateStr

      this.currentDateRange.push(this.resetBeginDate);
      this.currentDateRange.push(this.resetEndDate);

      //设置查询开始结束日期，自动触发查询（刚进入页面时）
      this.changePicker(this.currentDateRange)
    },
    data() {
      return {
        currentDateRange: [],
        beforeDateRange: [],
        resetBeginDate: '',
        resetEndDate: '',
        /*最近30天（以当天作为结尾，往前30天）
          本周
          上周
          本月（以本月作为选择）
          上月（以当前所在月的上一个月作为选择）
          本年
          上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE
      }
    },
    watch: {
      currentDateRange: function (a, b) {
        this.beforeDateRange = b;
      }
    },
    props: {
      // 查询对象
      query: {type: Object, required: true},
      reset: {type: Function, required: true}
    },
    model: {
      prop: 'query',
      event: 'change'
    },
    computed: {
      editQuery: {
        get() {
          return this.$props.query;
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
        //触发change事件
        //重置日期
        this.currentDateRange = [this.resetBeginDate, this.resetEndDate];

        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.$province.code,
          zone_id: '',
          city_id: '',
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate,
          selectType: 'merchant'
        };

        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
