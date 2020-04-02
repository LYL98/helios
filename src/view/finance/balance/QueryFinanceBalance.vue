<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province :value="editQuery.province_code" type="select" @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="editQuery.title" placeholder="商户名称" size="small" @search="changeQuery" @reset="resetQuery"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryFinanceBalance",
    mixins: [queryMixin],
    components: {
      'global-province': GlobalProvince
    },
    data() {
      return {
        initProvinceCode: ''
      }
    },
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data, type){
        if(type === 'init'){
          this.initProvinceCode = data.code;
        }
        this.$emit('change', {
          ...this.editQuery,
          province_code: data.code
        });
      },
      resetQuery() {
        this.$props.reset({province_code: this.initProvinceCode});
      }
    }
  }
</script>

<style scoped>

</style>
