<template>
  <div @mousemove="handleTableMouseMove">
    <el-table
      class="list-table"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :data="data"
      :height="windowHeight - offsetHeight"
      :row-class-name="highlightRowClassName"
      highlight-current-row="highlight-current-row"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize < 999950 ? 68 : 88" label="序号" :index="indexMethod" />
      <el-table-column label="商户名称" prop="title" min-width="200">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" prop="balance" min-width="200">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.balance == 0 ? '' : '￥' }}{{ returnPrice(scope.row.balance) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
            {
              title: '充值/扣款',
              isDisplay: (auth.isAdmin || auth.FinanceBalanceEdit),
              command: () => handleItemEdit(scope.row)
            },
            {
              title: '充值/扣款记录',
              isDisplay: (auth.isAdmin || auth.FinanceBalanceApproveLog),
              command: () => handleApproveLog(scope.row)
            },
            {
              title: '账户流水记录',
              isDisplay: (auth.isAdmin || auth.FinanceBalanceLog),
              command: () => handleBalanceLog(scope.row)
            }
          ]"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import {Table, TableColumn, MessageBox, Tag} from 'element-ui';
  import {TableOperate, ToPrice} from '@/common';
  import {Constant, DataHandle} from '@/util';
  import tableMixin from './table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "TableFinanceBalance",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate,
      'my-to-price': ToPrice
    },
    mixins: [tableMixin, viewMixin],
    computed: {
    },
    props: {
      data: {type: Array, required: true},
      stripe: {type: Boolean, default: true},
      'highlight-current-row': {type: Boolean, default: true},
      page: {type: Number, required: true},
      pageSize: {type: Number, required: true},
      itemEdit: {type: Function, required: true},
      approveLog: {type: Function, required: true},
      balanceLog: {type: Function, required: true},
      offsetHeight: {type: Number, required: true}
    },
    methods: {

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      handleItemEdit(item) {
        this.$props.itemEdit(item);
      },
      handleApproveLog(item) {
        this.$props.approveLog(item);
      },
      handleBalanceLog(item) {
        this.$props.balanceLog(item);
      }
    }
  }
</script>

<style scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
</style>
