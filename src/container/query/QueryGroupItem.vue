<template>
  <div class="query">
    <el-row>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="请输入商品名称、编号" @keyup.enter.native="handleQuery('TableGroupBuy')" @clear="handleQuery('TableGroupBuy')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupBuy')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupBuy')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from './query.mixin2';
  import { ButtonGroup } from '@/common';

  export default {
    name: "QueryGroupBuy",
    mixins: [queryMixin],
    components: {
      'button-group': ButtonGroup,
    },
    props: {
      page: { type: String, default: 'item' }, //页面item、recover
    },
    data(){
      let initQuery = {
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
