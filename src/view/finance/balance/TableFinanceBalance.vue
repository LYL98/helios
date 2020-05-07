<template>
  <div @mousemove="handleTableMouseMove" class="table-conter">
    <el-table
      class="list-table my-table-float"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :data="data"
      :row-class-name="highlightRowClassName"
      highlight-current-row="highlight-current-row"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <el-table-column type="index" width="120" label="序号" :index="indexMethod" />
      <el-table-column label="商户名称" prop="title" min-width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" prop="balance" min-width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.balance == 0 ? '' : '￥' }}{{ returnPrice(scope.row.balance) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
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
  import {TableOperate} from '@/common';
  import {Constant, DataHandle} from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "TableFinanceBalance",
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
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

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
