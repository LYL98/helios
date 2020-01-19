<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="角色">
          <search-role size="small" style="width: 210px;" @onSelectRole="handleQuery('TableSystemOperator')" ref="mySearchRole"></search-role>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="职务">
          <el-select v-model="query.post" placeholder="请选择" size="small" class="query-item-select" @change="handleQuery('TableSystemOperator')">
            <el-option label="全部" value=""></el-option>
            <el-option label="业务员" value="salesman"></el-option>
            <el-option label="采购员" value="buyer"></el-option>
            <el-option label="配送员" value="distributor"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="用户名/手机号"
            v-model="query.condition"
            @search="handleQuery('TableSystemOperator')"
            @reset="handleClearQuery('TableSystemOperator')"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="权限级别">
          <el-select v-model="query.data_level" placeholder="请选择" class="query-item-select" size="small" @change="handleQuery('TableSystemOperator')">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="全国" :value="1">全国</el-option>
            <el-option label="省级" :value="2"></el-option>
            <el-option label="片区" :value="3"></el-option>
            <el-option label="县域" :value="4"></el-option>
            <el-option label="线路" :value="5"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
            v-model="query.is_freeze"
            @change="handleQuery('TableSystemOperator')"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from './query.mixin';
  import SearchRole from './../search/SearchRole';
  import { SelectOption } from '@/common';

  export default {
    name: "QuerySystemOperator",
    mixins: [queryMixin],
    components: {
      'search-role': SearchRole,
      'select-option': SelectOption,
    },
    props: {
    },
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data() {
      let initQuery = {
        province_code: '',
        condition: '',
        is_freeze: '',
        post: '',
        data_level: '',
        role_id: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import './query.scss';
</style>
