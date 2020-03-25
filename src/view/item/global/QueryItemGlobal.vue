<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="科学分类">
          <select-system-class v-model="query.system_class_codes" @change="selectSystemClass" :clearable="false" size="small"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="请输入商品编号/名称" size="small" @search="handleQuery('TableItemGlobal')" @reset="handleClearQuery('TableItemGlobal')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { SelectOption, SelectSystemClass } from '@/common';
  import { Constant } from '@/util';

  export default {
    name: "QueryItemGlobal",
    mixins: [queryMixin],
    components: {
      'select-system-class': SelectSystemClass,
      'select-option': SelectOption,
    },
    props: {
      page: { type: String, default: 'global' }, //页面global、recover
    },
    created() {
      this.$data.initQuery.is_deleted = this.page === 'global' ? '0' : '1'
      this.$data.query.is_deleted = this.page === 'global' ? '0' : '1'
    },
    data() {
      let initQuery = {
        system_class_code: '',
        system_class_codes: [],
        condition: '',
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
  @import '@/share/scss/query.scss';
</style>
