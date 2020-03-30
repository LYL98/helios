<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" isRequired type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="上架状态">
          <select-option size="small" v-model="query.status" :options="{'全部': '', '已上架': 'activated', '未上架': 'deactivated'}" @change="handleQuery('TableGroupActivity')"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="请输入团购名称、编号" @keyup.enter.native="handleQuery('TableGroupActivity')" @clear="handleQuery('TableGroupActivity')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupActivity')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupActivity')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="团购状态">
          <el-select v-model="query.progress_status" style="width: 100%;" size="small" clearable placeholder="全部" @change="handleQuery('TableGroupActivity')">
            <el-option v-for="(item, key) in progressStatus" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { SelectOption } from '@/common';
  import { GlobalProvince } from '@/component';
  import { Constant } from '@/util';

  export default {
    name: "QueryGroupActivity",
    mixins: [queryMixin],
    components: {
      'select-option': SelectOption,
      'global-province': GlobalProvince,
    },
    created() {

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
    },
    methods: {
      //查询选择区域后【初始化】
      selectProvince(data){
        this.$data.initQuery.province_code = data.code;
        this.$data.query.province_code = data.code;
        this.handleQuery('TableGroupActivity');
      },
    }
  }
</script>

<style scoped>
</style>
