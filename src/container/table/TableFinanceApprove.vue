<template>
  <div @mousemove="handleTableMouseMove">
    <el-table
      class="list-table"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :data="data"
      :row-class-name="highlightRowClassName"
      :height="windowHeight - offsetHeight"
      :highlight-current-row="true"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize < 999950 ? 68 : 88" label="序号" :index="indexMethod" />
      <el-table-column label="商户名称" prop="merchant_title" min-width="140">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.merchant_title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款类型" prop="reason" min-width="140">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ reason[scope.row.reason] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" min-width="80">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.amount > 0 ? '+' : '' }}{{ returnPrice(scope.row.amount) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="operator_name" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.operator_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款备注" min-width="160">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.remark || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="checker_name" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.checker_name || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="100">
        <template slot-scope="scope">
          <el-tag disable-transitions size="small" :type="statusTagType[scope.row.status]" style="width: 66px; text-align: center;"
          >{{ status[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="created" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">{{returnDate(scope.row.created)}}</div>
          <div v-if="scope.row[rowIdentifier] === currentRow[rowIdentifier]">{{returnTime(scope.row.created)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
              {
                title: '审核',
                isDisplay: (auth.isAdmin || auth.FinanceApproveEdit) && scope.row.status === 'wait_check',
                command: () => handleItemEdit(scope.row)
              },
              {
                title: '审核详情',
                isDisplay: (auth.isAdmin || auth.FinanceApproveDetail) && (scope.row.status == 'checked' || scope.row.status == 'declined'),
                command: () => handleShowDetail(scope.row)
              }
            ]"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog.isShow"
      :before-close="handleCloseDetail"
      width="600px"
      append-to-body
      title="审核详情"
    >
      <el-form label-position="left" label-width="100px" style="margin-top: -10px; padding: 0 20px;" v-if="dialog.isShow">
        <el-form-item label="审核状态：">{{ status[dialog.detail.status] }}</el-form-item>
        <el-form-item label="审核备注：">{{ dialog.detail.check_remark }}</el-form-item>
        <el-form-item label="审核人：">{{ dialog.detail.checker_name }}</el-form-item>
        <el-form-item label="审核时间：">{{ dialog.detail.check_time }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import {Table, TableColumn, Dialog, Form, FormItem, Tag} from 'element-ui';
  import {ToPrice, OmissionText, TableOperate} from '@/common';
  import {Constant, DataHandle} from '@/util';
  import { Finance } from '@/service';
  import { tableMixin } from '@/mixins';
  export default {
    name: "TableFinanceApprove",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-tag': Tag,
      'my-to-price': ToPrice,
      'my-omission-text': OmissionText,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      data: { type: Array, required: true },
      stripe: {type: Boolean, default: true},
      'highlight-current-row': {type: Boolean, default: true},
      page: {type: Number, required: true},
      pageSize: {type: Number, required: true},
      offsetHeight: { type: Number, required: true},
      itemEdit: { type: Function, required: true }
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        windowHeight: 'windowHeight'
      }),
    },
    data() {
      return {
        reason: Constant.MERCHANT_BALANCE_REASON,
        status: {
          wait_check: '待审核',
          checked: '审核通过',
          declined: '被驳回'
        },
        statusTagType: {
          wait_check: 'warning',
          checked: 'regular',
          declined: 'info'
        },
        dialog: {
          isShow: false,
          detail: {  } // 审核详情
        }
      }
    },
    methods: {

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      handleItemEdit(item) {
        this.$props.itemEdit(item);
      },
      async handleShowDetail(item) {
        let res = await Finance.approveDetail({ id: item.id });
        if (res.code === 0) {
          this.$data.dialog.detail = res.data;
          this.$data.dialog.isShow = true;
        } else {
          Message.warning(res.message);
        }
      },
      handleCloseDetail() {
        this.$data.dialog.isShow = false;
        this.$data.dialog.detail = { };
      }
    }
  }
</script>

<style scoped>
  .green {
    color: #00d600;
  }
  .red {
    color: #ff3724;
  }
</style>
