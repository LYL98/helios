<template>
  <el-table
    :data="data"
    height="300px"
    :row-class-name="highlightRowClassName"
    highlight-current-row="highlight-current-row"
  >
    <el-table-column align="center" type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize <= 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
    <el-table-column label="参团人" prop="member_name" min-width="200">
      <template slot-scope="scope">
        <div class="title">
          {{scope.row.member_name}}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="联系电话" prop="member_phone" min-width="120">
      <template slot-scope="scope">
        <div>
          {{ scope.row.member_phone }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="购买件数" prop="num" min-width="100">
      <template slot-scope="scope">
        <div>{{ scope.row.num }}</div>
      </template>
    </el-table-column>
    <el-table-column label="实付金额" prop="price" min-width="100">
      <template slot-scope="scope">
        <div>{{scope.row.pay_amount_at_created ? '￥' : ''}}{{ returnPrice(scope.row.pay_amount_at_created) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="退款金额" prop="refund" min-width="80">
      <template slot-scope="scope">
        <div>{{scope.row.refund ? '￥' : ''}}{{ returnPrice(scope.row.refund) }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import {TableOperate} from '@/common';
  import { Constant, DataHandle } from '@/util';

  export default {
    name: "TableGroupBuyMerchantDetail",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    props: {
      data: { type: Array, required: true},
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      offsetHeight: { type: Number, required: true},
    },
    computed: {
      
    },
    data() {
      return {
        auth: this.$auth
      }
    },
    methods: {
      returnPrice(price) {
        return DataHandle.returnPrice(price)
      },

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

    }
  }
</script>

<style scoped>

</style>
