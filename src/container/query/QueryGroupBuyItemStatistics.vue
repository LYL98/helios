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
            style="width: 242px;"
            @change="changePicker">
          </el-date-picker>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="商品分类">
          <select-group-item-class size="small" v-model="editQuery.category_id" @change="changeQuery" style="width: 242px;" clearable/>
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
              v-model="editQuery.condition"
              @keyup.enter.native="changeQuery"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" @click="changeQuery" icon="el-icon-search"></el-button>
            <el-button size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {DatePicker, Row, Col, Input, Button, Message} from 'element-ui';
  import { QueryItem, ButtonGroup, CollapseQuery, SelectDisplayClass, SelectGroupItemClass } from '@/common';
  import { DataHandle, Constant } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryGroupBuyItemStatistics",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-select-display-class': SelectDisplayClass,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery,
      'select-group-item-class': SelectGroupItemClass
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
      changeQuery() {
        //触发change事件
        this.editQuery = Object.assign({}, this.editQuery);
      },
      // changeDate() {
      //   this.editQuery.groupbuy_date = this.selectDate;
      //   this.changeQuery();
      // },
      resetQuery() {
        //重置日期
        this.currentDateRange = [this.resetBeginDate, this.resetEndDate];

        //触发change事件
        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.province.code,
          sort: this.backupSort,
          category_id: '',
          condition: '',
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate,
        };
        // this.selectDate = resetDate;
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
