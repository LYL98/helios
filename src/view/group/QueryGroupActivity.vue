<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="团购状态">
          <el-select v-model="query.progress_status" size="small" clearable placeholder="全部" @change="handleQuery('TableGroupActivity')">
            <el-option v-for="(item, key) in progressStatus" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="上架状态">
          <select-option size="small" v-model="query.status" :options="{'全部': '', '已上架': 'activated', '未上架': 'deactivated'}" @change="handleQuery('TableGroupActivity')"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="请输入团购名称、编号" @keyup.enter.native="handleQuery('TableGroupActivity')" @clear="handleQuery('TableGroupActivity')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupActivity')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupActivity')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { SelectOption } from '@/common';
  import { Constant } from '@/util';

  export default {
    name: "QueryGroupActivity",
    mixins: [queryMixin],
    components: {
      'select-option': SelectOption,
    },
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data(){
      let initQuery = {
        province_code: '',
        progress_status: '',
        status: '',
        condition: ''
      }
      return {
        progressStatus: Constant.GROUP_ACTIVITY_PROGRESS_STATUS,
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    }
  }
</script>

<style scoped>
</style>
