<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" isRequired type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="县域">
          <select-city :provinceCode="query.province_code" v-model="query.city_id" size="small" @change="handleQuery('TableGroupStoreOrder')"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input size="small" class="query-item-input" clearable v-model="query.condition" placeholder="团购编号/名称/门店名称" @keyup.enter.native="handleQuery('TableGroupStoreOrder')" @clear="handleQuery('TableGroupStoreOrder')"/>
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px" @click="handleQuery('TableGroupStoreOrder')"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="handleClearQuery('TableGroupStoreOrder')">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="状态">
          <el-select class="query-item-select" v-model="query.status" @change="handleQuery('TableGroupStoreOrder')" placeholder="全部" size="small" clearable>
            <el-option v-for="(item, key) in groupStoreOrderStatus" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';
  import { SelectCity } from '@/common';
  import { GlobalProvince } from '@/component';

  export default {
    name: "QueryGroupStoreOrder",
    mixins: [queryMixin],
    components: {
      'select-city': SelectCity,
      'global-province': GlobalProvince,
    },
    created() {
    },
    data(){
      let initQuery = {
        province_code: '',
        city_id: '',
        condition: '',
        status: ''
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
        groupStoreOrderStatus: Constant.GROUP_STORE_ORDER_STATUS
      }
    },
    methods: {
      //查询选择区域后【初始化】
      selectProvince(data){
        this.$data.initQuery.province_code = data.code;
        this.$data.query.province_code = data.code;
        this.$data.query.city_id = '';
        this.handleQuery('TableGroupStoreOrder');
      },
    }
  }
</script>

<style scoped>
</style>
