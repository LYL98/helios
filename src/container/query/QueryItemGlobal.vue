<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="科学分类">
          <select-system-class v-model="query.system_class_codes" @change="selectSystemClass" :clearable="false" size="small"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="供应商类型">
          <select-option
            :options="{'全部': '', ...supplierType}"
            v-model="query.sup_type"
            @change="handleQuery('TableItemGlobal')"
            size="small"
          />
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
  import queryMixin from './query.mixin';
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
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
      this.$data.initQuery.is_deleted = this.page === 'global' ? '0' : '1'
      this.$data.query.is_deleted = this.page === 'global' ? '0' : '1'
    },
    data() {
      let initQuery = {
        system_class_code: '',
        system_class_codes: [],
        sup_type: '',
        condition: '',
        province_code: '',
        is_deleted: '0'
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        supplierType: Constant.SUPPLIER_TYPE('value_key'),
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
