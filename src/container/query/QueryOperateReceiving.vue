<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateReceiving')"
            style="width: 100%;"
            placeholder="配送日期"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="inventoryStatus"
            v-model="query.status"
            @change="handleQuery('TableOperateReceiving')"
            size="small"
            clearable
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateReceiving')" @reset="handleClearQuery('TableOperateReceiving')"/>
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
    name: "QueryOperateReceiving",
    components: {
      'select-option': SelectOption
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        delivery_date: '',
        status: '',
        condition: '',
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    computed: {
      inventoryStatus: {
        get(){
          let d = Constant.INVENTORY_STATUS('value_key');
          return { '全部': '', ...d };
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
