<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="分配状态">
          <select-option
            v-model="query.status"
            :options="allotStatus"
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

  export default {
    name: "QueryOperateSort",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    created() {
    },
    computed: {
      allotStatus: {
        get(){
          return { '全部': '', '待分配': 'unalloted', '已分配': 'alloted' };
        }
      }
    },
    data() {
      let initQuery = {
        status: '',
        condition: '',
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
