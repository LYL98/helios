<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <global-province type="select" isRequired @change="selectProvince"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateDepart')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryOperateDepart",
    components: {
      'select-option': SelectOption,
      'global-province': GlobalProvince
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = this.today;
    },
    data() {
      let initQuery = {
        delivery_date: '',
        province_code: '',
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    },
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data){
        this.$data.initQuery.province_code = data.code;
        this.$data.query.province_code = data.code;
        this.handleQuery('TableOperateDepart');
      }
    }
  }
</script>

<style scoped>

</style>
