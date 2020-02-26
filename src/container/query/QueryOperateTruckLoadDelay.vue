<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="配送日期">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableOperateTruckLoadDelay')"
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
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryOperateTruckLoadDelay",
    components: {
    },
    mixins: [queryMixin],
    created() {
      let deliveryDate = this.$route.query.delivery_date;
      this.$data.initQuery.delivery_date = this.today;
      this.$data.query.delivery_date = deliveryDate || this.today;
    },
    data() {
      let initQuery = {
        delivery_date: '',
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
