<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="片区">
          <my-select-zone v-model="editQuery.zone_code"
                          :provinceCode="editQuery.province_code"
                          clearable
                          size="small"
                          @change="changeZone"
                          :isUseToQuery="true"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="县域">
          <my-select-city v-model="editQuery.city_code"
                          :provinceCode="editQuery.province_code"
                          ref="mySelectCity"
                          clearable
                          size="small"
                          :zoneCode="editQuery.zone_code"
                          @change="changeQuery"
                          :isUseToQuery="true"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
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
  import {DatePicker, Row, Col, Input, Button, Message} from 'element-ui';
  import {QueryItem, SelectZone, SelectCity} from '@/common';
  import { DataHandle } from '@/util';
  import Constant from "../../util/constant";

  export default {
    name: "QueryBusinessStore",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-select-zone': SelectZone,
      'my-select-city': SelectCity,
      'my-query-item': QueryItem
    },
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
        province: this.$province,
        currentDateRange: [],
        beforeDateRange: [],
        resetBeginDate: '',
        resetEndDate: '',
        backupSort: '',
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
          //备份不做修改的属性
          this.backupSort = this.$props.query.sort;
          return this.$props.query;
        },
        set(v) {
          this.$emit('change', v);
        }
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
      changeZone(v, isInit) {
        if (!isInit) {
          this.editQuery.city_code = '';
          this.changeQuery()
        }
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
          province_code: this.province.code,
          zone_code: '',
          city_code: '',
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate,
          sort: this.backupSort
        };
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
