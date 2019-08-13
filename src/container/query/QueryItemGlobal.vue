<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="科学分类">
              <select-system-class v-model="query.system_class_codes" @change="selectSystemClass" size="small" style="width: 224px;"/>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input v-model="query.condition" size="small" placeholder="请输入商品编号、名称" @keyup.enter.native="handleQuery('TableItemGlobal')" class="query-item-input"/>
                <el-button class="search" size="small" type="primary" @click="handleQuery('TableItemGlobal')" icon="el-icon-search"></el-button>
                <el-button class="reset" size="small"  type="primary" plain @click="handleClearQuery('TableItemGlobal')">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import queryMixin from './query.mixin2';
  import { SelectSystemClass } from '@/common';

  export default {
    name: "QueryItemGlobal",
    mixins: [queryMixin],
    components: {
      'select-system-class': SelectSystemClass
    },
    props: {
      page: { type: String, default: 'global' }, //页面global、recover
    },
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
      this.$data.initQuery.is_deleted = this.page === 'global' ? '0' : '1'
      this.$data.query.is_deleted = this.page === 'global' ? '0' : '1'
    },
    data() {
      let initQuery = {
        system_class_code: '',
        system_class_codes: [],
        condition: '',
        province_code: '',
        is_deleted: '0'
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //选择科学分类
      selectSystemClass(value){
        if(value.length === 0){
          this.$data.query.system_class_code = '';
        }else{
          this.$data.query.system_class_code = value[value.length - 1];
        }
        this.handleQuery('TableItemGlobal');
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import './query.scss';
</style>
