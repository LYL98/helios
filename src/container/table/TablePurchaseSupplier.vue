<template>
  <div>
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
        <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize < 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
        <el-table-column label="供应商编码/名称" prop="name" min-width="280">
          <template slot-scope="scope">
            <a href="javascript:void(0);" :class="`title ${isEllipsis(scope.row)}`" @click="handleShowDetail(scope.row)">
              {{ scope.row.code }} {{ scope.row.code && '/' }} {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contact" min-width="190">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.contact }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="realname" min-width="190">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created_by && scope.row.created_by.realname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created" min-width="180">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created }}
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
                title: '修改',
                isDisplay: auth.isAdmin || auth.PurchaseSupplierModify,
                command: () => handleModify(scope.row)
              },
              {
                title: '审核',
                isDisplay: (auth.isAdmin || auth.PurchaseSupplierApprove) && !scope.row.is_check,
                command: () => handleApprove(scope.row.id)
              },
              {
                title: '冻结',
                isDisplay: (auth.isAdmin || auth.PurchaseSupplierFreeze) && !scope.row.is_freeze,
                command: () => handleFreeze(scope.row.id)
              },
              {
                title: '解冻',
                isDisplay: (auth.isAdmin || auth.PurchaseSupplierUnFreeze) && scope.row.is_freeze,
                command: () => handleUnFreeze(scope.row.id)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="itemDetail.isShow"
      :before-close="handleCloseItemDetail"
      title="供应商详情"
      width="750px"
      append-to-body
    >
      <el-form label-position="left" label-width="100px" style="padding: 0 20px; margin-top: -10px;">
        <el-form-item label="供应商编码：">{{ itemDetail.detail.code }}</el-form-item>
        <el-form-item label="供应商名称：">{{ itemDetail.detail.name }}</el-form-item>
        <el-form-item label="档口号：">{{ itemDetail.detail.supplier_code }}</el-form-item>
        <el-form-item label="联系人：">{{ itemDetail.detail.contact }}</el-form-item>
        <el-form-item label="电话：">{{ itemDetail.detail.phone }}</el-form-item>
        <el-form-item label="开户行：">{{ itemDetail.detail.bank_name }}</el-form-item>
        <el-form-item label="收款人：">{{ itemDetail.detail.bank_account_owner }}</el-form-item>
        <el-form-item label="银行账号：">{{ itemDetail.detail.bank_account }}</el-form-item>
        <el-form-item label="账号类型：">{{ supplierPayType[itemDetail.detail.pay_type] }}</el-form-item>
        <el-form-item label="创建人：">{{ itemDetail.detail.created_by && itemDetail.detail.created_by.realname }}</el-form-item>
        <el-form-item label="创建时间：">{{ itemDetail.detail.created }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Table, TableColumn, Dialog, Form, FormItem, MessageBox } from 'element-ui';
  import {TableOperate, OmissionText} from '@/common';
  import { Constant, DataHandle } from '@/util';
  import tableMixin from './table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "TablePurchaseSupplier",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'my-table-operate': TableOperate,
      'my-omission-text': OmissionText
    },
    mixins: [tableMixin, viewMixin],
    props: {
      data: { type: Array, required: true },
      stripe: { type: Boolean, default: true },
      'highlight-current-row': { type: Boolean, default: true },
      modifyItem: { type: Function, required: true },
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      offsetHeight: { type: Number, required: true}
    },
    computed: {
    },
    data() {
      return {
        supplierPayType: Constant.PURCHASE_SUPPLIER_PAY_TYPE,
        itemDetail: {
          isShow: false,
          detail: {}
        },
      }
    },
    methods: {
      ...mapActions(['pruchaseSupplierApprove', 'pruchaseSupplierFreeze', 'pruchaseSupplierUnFreeze']),

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      handleModify(item) {
        this.$props.modifyItem(item);
      },

      handleApprove(id) {
        MessageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pruchaseSupplierApprove({id: id});
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleFreeze(id) {
        MessageBox.confirm('确认冻结该供应商?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pruchaseSupplierFreeze({id: id});
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleUnFreeze(id) {
        MessageBox.confirm('确认解冻该供应商?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pruchaseSupplierUnFreeze({id: id});
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleShowDetail(item) {
        this.$data.itemDetail.detail = item;
        this.$data.itemDetail.isShow = true;
      },
      handleCloseItemDetail() {
        this.$data.itemDetail.detail = {};
        this.$data.itemDetail.isShow = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
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
