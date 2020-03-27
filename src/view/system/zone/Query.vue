<template>
  <!-- 头部start -->
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province v-model="query.province_code" type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Http, Config } from '@/util';
  import { GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
      'global-province': GlobalProvince,
    },
    data() {
      let initQuery = {
        province_code: '',
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
