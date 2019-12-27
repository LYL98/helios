<template>
  <!-- 头部start -->
    <div class="container-query">
      <my-collapse-query @expandChange="(isExpand) => onExpandChange(isExpand, 'TableOperateReceiving')">
        <template slot="header">
          <el-row :gutter="32">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '日期'">
                <el-date-picker
                  v-model="query.opt_date"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :editable="false"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  @change="handleQuery('TableOperateReceiving')"
                ></el-date-picker>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '线路'">
                <select-line-query
                  :provinceCode="province.code"
                  size="small"
                  :clearable="false"
                  v-model="query.line_code"
                  @change="handleQuery('TableOperateReceiving')"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '收货状态'">
                <select-option
                  :options="{'全部': '', '未收货': false, '已收货': true}"
                  v-model="query.is_receiving"
                  @change="refreshData"
                  size="small"
                />
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row :gutter="32" style="margin-top: 16px">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '缺货状态'">
                <select-option
                  :options="{'全部': '', '缺货商品': true}"
                  v-model="query.is_stockout"
                  @change="refreshData"
                  size="small"
                />
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { Http, Config, DataHandle } from '@/util';
  import queryMixin from './query.mixin';
  import { SelectLineQuery, SelectOption } from '@/common';

  export default {
    name: "QueryOperateReceiving",
    mixins: [queryMixin],
    components: {
      'select-line-query': SelectLineQuery,
      'select-option': SelectOption
    },
    computed: {
      isPad: {
        get() {
          return navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('iPad') > 0;
        }
      }
    },
    data() {
      let d = DataHandle.returnDateStr();
      let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
      let initQuery = {
        opt_date: nowDate,
        line_code: '',
        is_receiving: '',
        is_stockout: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //重新计算
      refreshData(){
        let pc = this.getPageComponents('TableOperateReceiving');
        pc.refreshData(pc.receivingDataItem, this.query);
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
