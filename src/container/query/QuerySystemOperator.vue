<template>
  <div class="query">
      <my-collapse-query @expandChange="onExpandChange">
        <template slot="header">
          <el-row>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="角色">
                <search-role size="small" style="width: 210px;" @onSelectRole="handleQuery('TableSystemOperator')" :isUseToQuery="true" ref="mySearchRole"></search-role>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
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
            <el-col :xl="8" :lg="10" :span="10">
              <my-query-item label="搜索">
                <div style="display: flex">
                  <el-input
                    size="small"
                    placeholder="请输入用户名、手机号"
                    class="query-item-input"
                    v-model="query.condition"
                    clearable
                    @keyup.enter.native="handleQuery('TableSystemOperator')"
                    @clear="handleQuery('TableSystemOperator')"
                    ref="condition"
                  />
                  <el-button size="small" type="primary" @click="handleQuery('TableSystemOperator')" icon="el-icon-search" style="margin-left: 4px"></el-button>
                  <el-button v-if="!isExpand" size="small" type="primary" plain @click="handleClearQuery('TableSystemOperator')" class="query-item-reset">重置</el-button>
                </div>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row style="margin-top: 16px">
            <el-col :xl="6" :lg="7" :span="7">
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
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="状态">
                <my-button-group
                  :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
                  v-model="query.is_freeze"
                  @change="handleQuery('TableSystemOperator')"
                  size="small"
                />
                <el-button size="small" type="primary" plain @click="handleClearQuery('TableSystemOperator')" class="query-item-reset">重置</el-button>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
</template>

<script>
  import queryMixin from './query.mixin2';
  import SearchRole from './../search/SearchRole';
  import { ButtonGroup } from '@/common';

  export default {
    name: "QuerySystemOperator",
    mixins: [queryMixin],
    components: {
      'search-role': SearchRole,
      'my-button-group': ButtonGroup,
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
