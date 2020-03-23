<template>
  <div class="query">
    <el-row>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入团员姓名"
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
  import { QueryItem } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryGroupBuyMemberStatistics",
    components: {
      'el-date-picker': DatePicker,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin],
    created() {
      let { province } = this;
      if(province.code){
        this.editQuery.province_code = province.code;
      }
      this.changeQuery();
    },
    data() {
      return {
        backupSort: '',
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
      changeQuery() {
        //触发change事件
        this.editQuery = Object.assign({}, this.editQuery);
      },
      changeDate() {
        this.editQuery.groupbuy_date = this.selectDate;
        this.changeQuery();
      },
      resetQuery() {
        //触发change事件
        this.editQuery = {
          page: 1,
          page_size: 20,
          province_code: this.province.code,
          sort: this.backupSort,
          condition: ''
        };
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
