<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="商品分类">
          <select-group-item-class size="small" v-model="query.category_id" @change="handleQuery('TableGroupItem')" style="width: 242px;" clearable/>
        </my-query-item>
      </el-col>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="请输入商品名称、编号" @keyup.enter.native="handleQuery('TableGroupItem')" @clear="handleQuery('TableGroupItem')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupItem')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupItem')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from './query.mixin2';
  import { SelectGroupItemClass } from '@/common';

  export default {
    name: "QueryGroupItem",
    mixins: [queryMixin],
    components: {
    'select-group-item-class': SelectGroupItemClass
    },
    props: {
      page: { type: String, default: 'item' }, //页面item、recover
    },
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data(){
      let initQuery = {
        province_code: '',
        category_id: '',
        is_deleted: this.page === 'item' ? 0 : 1,
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    }
  }
</script>

<style scoped>
</style>
