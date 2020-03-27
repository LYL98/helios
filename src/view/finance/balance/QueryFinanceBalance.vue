<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province type="select" isRequired @change="selectProvince"/>
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
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data){
        this.$emit('change', this.editQuery);
      },
      resetQuery() {
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>

</style>
