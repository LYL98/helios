<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="8">
        <my-query-item label="优惠券状态">
          <select-option
            :options="{'全部': '', '未过期': 'st_on_date', '已过期': 'st_out_of_date'}"
            v-model="editQuery.status"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="8">
        <my-query-item label="自动发放">
          <select-option
            :options="{'全部': '', '是': '1', '否': '0'}"
            v-model="editQuery.is_auto_dis"
            @change="changeQuery"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option } from 'element-ui';
  import { SelectOption, QueryItem } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryMarketingCoupon",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'select-option': SelectOption,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin]
  }
</script>

<style scoped>
  .wp-tab-query {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 10px 15px 0;
    border-bottom: 1px solid #f3f4f6;
  }
</style>
