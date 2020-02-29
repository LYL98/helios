<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateTruckLoad')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="线路">
          <select-line
            :provinceCode="province.code"
            v-model="query.line_code"
            size="small"
            :clearable="false"
            @initCallBack="lineInit"
            @change="handleQuery('TableOperateTruckLoad')"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateTruckLoad')" @reset="handleClearQuery('TableOperateTruckLoad')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { SelectLine } from '@/container';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryOperateTruckLoad",
    components: {
      'select-option': SelectOption,
      'select-line': SelectLine
    },
    mixins: [queryMixin],
    created() {
      let deliveryDate = this.$route.query.delivery_date;
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = deliveryDate || this.today;
    },
    data() {
      let initQuery = {
        delivery_date: '',
        condition: '',
        line_code: '',
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
      //线路初始化默认选择
      lineInit(rd){
        if(rd.length > 0){
          this.$data.initQuery.line_code = rd[0].code;
          this.$data.query.line_code = rd[0].code;
          let pc = this.getPageComponents('TableOperateTruckLoad');
          pc.getData(this.query);
        }
      }
    }
  }
</script>

<style scoped>

</style>
