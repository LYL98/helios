<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateDepart')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateDepart')" @reset="handleClearQuery('TableOperateDepart')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryOperateDepart",
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
        condition: '',
        delivery_date: '',
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    },
    computed: {
      sortStatus: {
        get(){
          return { '全部': '', '待分拣': 'unsort', '已分拣': 'sorted' };
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
