<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" isRequired type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryGroupBanner",
    mixins: [queryMixin],
    components: {
      'global-province': GlobalProvince,
    },
    created() {
    },
    data(){
      let initQuery = {
        province_code: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    },
    methods: {
      //查询选择区域后【初始化】
      selectProvince(data){
        this.$data.initQuery.province_code = data.code;
        this.$data.query.province_code = data.code;
        this.handleQuery('TableGroupBanner');
      },
    }
  }
</script>

<style scoped>
</style>
