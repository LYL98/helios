<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="状态">
          <el-select class="query-item-select" v-model="query.status" @change="handleQuery('TableGroupStoreOrder')" placeholder="全部" size="small" clearable>
            <el-option v-for="(item, key) in groupStoreOrderStatus" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="所在仓">
          <select-city :provinceCode="query.province_code" v-model="query.city_code" style="width: 242px;" @change="handleQuery('TableGroupStoreOrder')"/>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="团购编号/名称/门店名称" @keyup.enter.native="handleQuery('TableGroupStoreOrder')" @clear="handleQuery('TableGroupStoreOrder')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupStoreOrder')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupStoreOrder')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from './query.mixin2';
  import { Constant } from '@/util';
  import { SelectCity } from '@/common';

  export default {
    name: "QueryGroupStoreOrder",
    mixins: [queryMixin],
    components: {
      'select-city': SelectCity
    },
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data(){
      let initQuery = {
        province_code: '',
        city_code: '',
        condition: '',
        status: ''
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
        groupStoreOrderStatus: Constant.GROUP_STORE_ORDER_STATUS
      }
    }
  }
</script>

<style scoped>
</style>
