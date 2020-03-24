<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="时间">
          <el-date-picker
            v-model="currentDateRange"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="fixDateOptions"
            :clearable="false"
            class="query-item-date"
            @change="changePicker">
          </el-date-picker>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="波动指标">
          <el-select v-model="editQuery.selectIndex"
                      placeholder="请选择"
                      size="small"
                      class="query-item-select"
                      @change="changeQuery">
            <el-option
              v-for="item in indexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
    <el-row style="margin-top: 16px">
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="科学分类">
          <select-system-class size="small" v-model="editQuery.system_class_codes" @change="selectSystemClass" style="max-width: 224px;"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {DatePicker, Row, Col, Input, Button, Message, Select, Option} from 'element-ui';
  import { QueryItem, SelectSystemClass } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from '@/share/mixin/query.mixin';
  import Constant from "../../util/constant";

  export default {
    name: "QueryItemFluctuationAnalysis",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'select-system-class': SelectSystemClass,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin],
    created() {
      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));

      this.resetBeginDate = DataHandle.formatDate(beginDate, 'yyyy-MM-dd');
      this.resetEndDate = endDateStr

      this.currentDateRange.push(this.resetBeginDate);
      this.currentDateRange.push(this.resetEndDate);
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
        selectIndex: 0,
        indexOptions: [{
          value: 0,
          label: '采购价'    //平均值无意义
        }, {
          value: 1,
          label: '销售价'     //平均值无意义
        }, {
          value: 2,
          label: '销售量'
        }, {
          value: 3,
          label: '销售金额'
        }, {
          value: 4,
          label: '下单客户数'
        }, {
          value: 5,
          label: '下单率'
        }, {
          value: 6,
          label: '加价率'
        }, {
          value: 7,
          label: '退赔率'
        }, {
          value: 8,
          label: '采购价格偏差'    //平均值无意义
        }],
        selectItemName: '',
        /*最近30天（以当天作为结尾，往前30天）
          本周
          上周
          本月（以本月作为选择）
          上月（以当前所在月的上一个月作为选择）
          本年
          上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE,
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
      resetQuery() {
        //触发change事件
        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.province.code,
          system_class_codes: [],
          system_class_code: '',
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate,
          item_condition: '',
          selectIndex: 0
        };
        this.currentDateRange = [this.resetBeginDate, this.resetEndDate];
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
