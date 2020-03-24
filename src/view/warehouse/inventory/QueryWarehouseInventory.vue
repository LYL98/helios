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
          <select-storehouse size="small" v-model="query.storehouse_id" @change="handleQuery('TableWarehouseInventory')" isAuth @initCallBack="storehouseInit"/>
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
  import { SelectStorehouse } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryWarehouseInventory",
    components: {
      'select-option': SelectOption,
      'select-system-class': SelectSystemClass,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        system_class_codes: [],
        system_class_code: '',
        storehouse_id: '',
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
      //初始化选择仓库时
      storehouseInit(dataItem){
        let d = dataItem.filter(item => item.province_code === this.$province.code);
        if(d.length > 0){
          this.$data.initQuery.storehouse_id = d[0].id;
          this.$data.query.storehouse_id = d[0].id;
        }else{
          this.$data.initQuery.storehouse_id = dataItem[0].id;
          this.$data.query.storehouse_id = dataItem[0].id;
        }
        this.handleQuery('TableWarehouseInventory');
      }
    }
  }
</script>

<style scoped>

</style>
