<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="科学分类">
          <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="仓库">
          <select-option
            :options="{'全部': '', ...auditStatus}"
            v-model="query.audit_status"
            @change="handleQuery('TableWarehouseInventory')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableWarehouseInventory')" @reset="handleClearQuery('TableWarehouseInventory')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption, SelectSystemClass } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryWarehouseInventory",
    components: {
      'select-option': SelectOption,
      'select-system-class': SelectSystemClass,
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        system_class_codes: [],
        system_class_code: '',
        audit_status: '',
        condition: '',
      }
      return {
        auditStatus: Constant.AUDIT_STATUS('value_key'),
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //选择科学分类
      selectSystemClass(value, data){
        if(value.length === 0){
          this.$data.query.system_class_code = '';
        }else{
          this.$data.query.system_class_code = data.code;
        }
        this.handleQuery('TableWarehouseInventory');
      },
    }
  }
</script>

<style scoped>

</style>
