<template>
  <div class="container-query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="审核状态">
          <button-group :options="{'待审核': 0, '已审核': 1}" v-model="query.is_audited" @change="handleQuery('TableItemAuditInnerTag')" size="small" />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <el-input aria-placeholder="商品编号/名称/商品标签" v-model="query.condition" @keyup.enter.native="handleQuery('TableItemAuditInnerTag')" style="width: 200px;" size="small"/>
          <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px;" @click="handleQuery('TableItemAuditInnerTag')"></el-button>
          <el-button size="small" type="primary" plain @click="handleClearQuery('TableItemAuditInnerTag')">重置</el-button>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { ButtonGroup } from '@/common';
  import { Constant } from '@/util';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryItemAuditInnerTag",
    components: {
      'button-group': ButtonGroup,
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        province_code: this.$province.code,
        is_audited: 0,
        condition: '',
        page: 1,
        page_size: Constant.PAGE_SIZE,
      }
      return {
        initQuery: this.copyJson(initQuery),
        query: this.copyJson(initQuery),
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
