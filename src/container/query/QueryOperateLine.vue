<template>
  <!-- 头部start -->
  <div class="query">
    <el-row>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              placeholder="请输入线路名称、编号"
              class="query-item-input"
              clearable
              v-model="query.condition"
              @keyup.enter.native="handleQuery('TableOperateLine')"
              @clear="handleQuery('TableOperateLine')"
              ref="condition"
            />
            <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableOperateLine')" icon="el-icon-search"></el-button>
            <el-button size="small" type="primary" class="query-item-reset" plain @click="handleClearQuery('TableOperateLine')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
  <!-- 头部end -->
</template>

<script>
  import { Http, Config } from '@/util';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryOperateLine",
    mixins: [queryMixin],
    data() {
      let initQuery = {
        province_code: this.$province.code,
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
