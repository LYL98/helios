<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col  :span="7">
        <my-query-item label="县域">
          <select-city
            size="small"
            :disabled="query.province_code ? false : true"
            clearable
            showAll
            v-model="query.city_id"
            :provinceCode="query.province_code"
            @change="handleQuery('TableMerchantRefund')"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="门店名称/用户名称/电话"
            v-model="query.condition"
            @search="handleQuery('TableMerchantRefund')"
            @reset="handleClearQuery('TableMerchantRefund')"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Constant } from '@/util';
  import { SelectCity } from '@/common';
  import { GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryItem",
    components: {
      'select-city': SelectCity,
      'global-province': GlobalProvince,
    },
    mixins: [queryMixin],
    data() {
      let initQuery = {
        province_code: '',
        city_id: '',
        condition: '',
        page: 1,
        page_size: Constant.PAGE_SIZE
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    created() {
    },
    methods: {
      //查询选择区域后
      selectProvince(data, type){
        this.$data.query.city_id = '';
        if(type === 'init'){
          this.$data.initQuery.province_code = data.code;
        }
        this.handleQuery('TableMerchantRefund');
      },
    }
  }
</script>

<style scoped>

</style>
