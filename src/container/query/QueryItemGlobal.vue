<template>
  <div class="query">
    <div class="item">
      <div class="label">科学分类</div>
      <div class="content">
        <select-system-class v-model="query.system_class_code" size="small" style="width: 260px;"/>
      </div>
      <div class="label">搜索</div>
      <div class="content" style="margin-right: 0;">
        <el-input v-model="query.condition" size="small" placeholder="请输入商品编号、名称" @keyup.enter.native="handleQuery('TableItemGlobal')" style="width: 200px;"/>
      </div>
      <div class="content">
        <el-button class="search" size="small" type="primary" @click="handleQuery('TableItemGlobal')" icon="el-icon-search"></el-button>
        <el-button class="reset" size="small"  type="primary" plain @click="handleClearQuery('TableItemGlobal')">重置</el-button>
      </div>
    </div>
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

    }
  }
</script>

<style lang="scss" scoped>
  @import './query.scss';
</style>
