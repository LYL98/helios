<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="线路">
          <select-line
            :provinceCode="provinceCode"
            v-model="query.line_id"
            size="small"
            :clearable="false"
            @initCallBack="lineInit"
            @change="handleQuery('TableOperateTruckLoad')"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableOperateTruckLoad')" @reset="handleClearQuery('TableOperateTruckLoad')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import { SelectLine } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryOperateTruckLoad",
    components: {
      'select-option': SelectOption,
      'select-line': SelectLine
    },
    mixins: [queryMixin],
    props: {
      provinceCode: { type: String, default: '' }, //省code
    },
    data() {
      let initQuery = {
        condition: '',
        line_id: ''
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
      //线路初始化默认选择【初始代】
      lineInit(rd){
        if(rd.length > 0){
          this.$data.initQuery.line_id = rd[0].id;
          this.$data.query.line_id = rd[0].id;
        }else{
          this.$data.initQuery.line_id = '';
          this.$data.query.line_id = '';
        }
        let pc = this.getPageComponents('TableOperateTruckLoad');
        pc.getData(this.query);
      }
    }
  }
</script>

<style scoped>

</style>
