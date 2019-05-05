<template>
  <div>
    <el-table :data="dataItem.items" style="width: 100%;" :stripe="true" :highlight-current-row="true">
      <el-table-column label="时间" width="180" prop="created">
      </el-table-column>
      <el-table-column label="变动前" width="140" prop="old_balance">
        <template slot-scope="scope">
          <my-to-price :amount="scope.row.old_balance"></my-to-price>
        </template>
      </el-table-column>
      <el-table-column label="金额变动" width="120" prop="amount">
        <template slot-scope="scope">
          <span :class="scope.row.new_balance > scope.row.old_balance ? 'red' : 'green'">
            {{scope.row.new_balance > scope.row.old_balance ? '+' : ''}}<my-to-price :amount="scope.row.amount"></my-to-price>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="变动后" width="140" prop="new_balance">
        <template slot-scope="scope">
          <my-to-price :amount="scope.row.new_balance"></my-to-price>
        </template>
      </el-table-column>
      <el-table-column label="操作人类型" width="120" prop="operator_class">
        <template slot-scope="scope">
          <span>{{operatorClass[scope.row.operator_class]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动原因" width="180" prop="reason">
        <template slot-scope="scope">
          <span>{{reason[scope.row.reason]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <my-omission-text :content="scope.row.remark" :maxlength="25" placement="top-end"></my-omission-text>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页标签 -->
    <div class="table-bottom" v-if="dataItem.num > 0">
      <div class="table-pagination">
        <el-pagination background layout="total, prev, pager, next"
                       @current-change="changePage"
                       :total="dataItem.num" :page-size="query.page_size" :current-page="query.page"/>
      </div>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex';
  import { Table, TableColumn, Pagination, Popover } from 'element-ui';
  import { ToPrice, OmissionText } from '@/common';
  import { Merchant } from '@/service';
  import { Constant, DataHandle } from '@/util';
  export default {
    name: 'Balance',
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-popover': Popover,
      'el-pagination': Pagination,
      'my-to-price': ToPrice,
      'my-omission-text': OmissionText
    },
    props: {
      updateCount: Number,
    },
    computed: mapGetters({
      merchant_id: 'merchant_id'
    }),
    watch: {
      updateCount: 'getBalanceLog'
    },
    data() {
      return {
        dataItem: {
          items: [],
          num: 0
        },
        query: {
          page: 1,
          page_size: 10
        },
        reason: Constant.MERCHANT_BALANCE_REASON,
        operatorClass: Constant.MERCHANT_BALANCE_OPERATOR_CLASS
      }
    },
    created() {
      let that = this;
      let { query, merchant_id } = that;
      query = { ...query, id: merchant_id };
      that.$data.query = query;
      this.getBalanceLog();
    },
    methods: {

      returnPrice(value) {
        return DataHandle.returnPrice(value);
      },

      // 获取商户的转账记录
      async getBalanceLog() {
        let that = this;
        let { query } = this;
        let res = await Merchant.balanceLogQuery(query);
        if (res.code === 0) {
          this.dataItem = res.data;
        }
      },

      // 翻页
      changePage(page) {
        let {query} = this;
        query.page = page;
        this.getBalanceLog(query);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .green {
    color: #00d600;
  }
  .red {
    color: #ff3724;
  }

</style>
