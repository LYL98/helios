<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="仓库">
          <select-storehouse v-model="query.src_storehouse_id" size="small" @change="changeStorehouse" isAuth @initCallBack="storehouseInit"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('Table')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('Table')" @reset="handleClearQuery('Table')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { SelectStorehouse } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "Query",
    components: {
      'select-option': SelectOption,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = this.today;
    },
    data() {
      let initQuery = {
        src_storehouse_id: '',
        delivery_date: '',
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //选择仓库
      changeStorehouse(data){
        let { query } = this;
        query.src_storehouse_id = data.id;
        this.$data.query = query;
        this.handleQuery('Table');
      },
      //选择仓库时【仓库 初始化】
      storehouseInit(dataItem){
        let d = dataItem.length > 0 ? dataItem[0] : {id: ''};
        let { initQuery, query } = this;
        initQuery.src_storehouse_id = d.id;
        query.src_storehouse_id = d.id;
        this.$data.initQuery = initQuery;
        this.$data.query = query;
        this.handleQuery('Table');
      }
    }
  }
</script>

<style scoped>

</style>
