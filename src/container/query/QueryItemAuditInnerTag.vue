<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="审核状态">
          <select-option :options="{'待审核': 0, '已审核': 1}" v-model="query.is_audited" @change="handleQuery('TableItemAuditInnerTag')" size="small" />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称/商品标签" size="small" @search="handleQuery('TableItemAuditInnerTag')" @reset="handleClearQuery('TableItemAuditInnerTag')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { Constant } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItemAuditInnerTag",
    components: {
      'select-option': SelectOption,
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
