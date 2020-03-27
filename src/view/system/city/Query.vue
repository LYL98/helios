<template>
  <div class="query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="片区">
          <select-zone :provinceCode="query.province_code" size="small" clearable showAll v-model="query.zone_ids" @change="handleQuery('Table')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { SelectZone } from '@/common';
  import { GlobalProvince } from '@/component';
  import { Http, Config } from '@/util';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
      'global-province': GlobalProvince,
      'select-zone': SelectZone
    },
    created() {
    },
    data() {
      let initQuery = {
        province_code: '',
        zone_ids: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data){
        this.handleQuery('Table');
      },
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
