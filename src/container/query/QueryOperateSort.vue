<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateSort')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="类型">
          <select-option
            :options="sortStatus"
            v-model="query.sort_status"
            @change="handleQuery('TableOperateSort')"
            size="small"
            clearable
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateSort')" @reset="handleClearQuery('TableOperateSort')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryOperateSort",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = this.today;
    },
    data() {
      let initQuery = {
        delivery_date: '',
        sort_status: 'unsort',
        condition: '',
        province_code: this.$province.code,
        for_allocate: 1, //特殊处理
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
        sortStatus: Constant.SORT_STATUS('value_key')
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
