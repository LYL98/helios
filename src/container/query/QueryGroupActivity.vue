<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="团购状态">
          <el-select v-model="query.status" size="small" clearable placeholder="请选择状态" @change="handleQuery('TableGroupActivity')">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in groupActivityStatus" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="上架状态">
          <button-group size="small" v-model="query.is_deleted" :options="{'全部': '', '已上架': 1, '未上架': 0}" @change="handleQuery('TableGroupActivity')"/>
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
  import queryMixin from './query.mixin2';
  import { ButtonGroup } from '@/common';
  import { Constant } from '@/util';

  export default {
    name: "QueryGroupActivity",
    mixins: [queryMixin],
    components: {
      'button-group': ButtonGroup,
    },
    data(){
      let initQuery = {
        status: '',
        is_deleted: '',
        condition: ''
      }
      return {
        groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    }
  }
</script>

<style scoped>
</style>
