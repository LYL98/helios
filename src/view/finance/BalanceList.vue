<template>
  <div>
    <query-finance-balance
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
    />
    <div class="operate" v-if="auth.isAdmin || auth.FinanceBalanceExport || auth.FinanceBalanceMerchantLogExport || auth.FinanceBalanceMerchantLog">
      <el-button
        v-if="auth.isAdmin || auth.FinanceBalanceExport"
        size="mini"
        type="primary"
        plain
        @click="handleBalanceExport"
      >
        导出商户余额列表
      </el-button>
      <el-button
        v-if="auth.isAdmin || auth.FinanceBalanceMerchantLogExport"
        size="mini"
        type="primary"
        plain
        @click="handleBalanceMerchantLogExport"
      >
        导出商户流水列表
      </el-button>
      <el-button
        v-if="auth.isAdmin || auth.FinanceBalanceMerchantLog"
        size="mini"
        type="primary"
        @click="handleMerchantLog"
      >
        商户流水变动记录
      </el-button>
    </div>
    <table-finance-balance
      :data="listItem.items"
      :page="query.page"
      :pageSize="query.page_size"
      :itemEdit="handleBalanceEdit"
      :approveLog="handleApproveLog"
      :balanceLog="handleBalanceLog"
      :offsetHeight="offsetHeight"
    >
    </table-finance-balance>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="listItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="dialog.isShowBalanceEdit"
      width="680px"
      title="充值/扣款"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-finance-balance-edit
        v-if="dialog.isShowBalanceEdit"
        :item="item"
        :submit="handleSubmit"
        :close="handleClose"
        :sending="formSending"
      />
      <template slot="footer">
        <div style="text-align: left; color: #606266; margin-top: -20px;">* 充值/扣款提交后，需在财务审核模块中审核通过才能生效。</div>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowApproveLog"
      width="1200px"
      :title="item.title + ' 充值/扣款记录'"
      append-to-body
    >
      <table-finance-balance-approve-log
        v-if="dialog.isShowApproveLog"
        :merchant_id="item.id"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowBalanceLog"
      width="1200px"
      :title="item.title + ' 流水变动记录'"
      append-to-body
    >
      <table-finance-balance-log
        v-if="dialog.isShowBalanceLog"
        :merchant_id="item.id"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowMerchantLog"
      width="1200px"
      title="商户流水变动记录"
      append-to-body
    >
      <table-finance-balance-merchant-log
        v-if="dialog.isShowMerchantLog"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowBalanceMerchantLogExport"
      width="630px"
      title="导出商户流水列表"
      append-to-body
    >
      <form-finance-balance-merchant-log-export
        v-if="dialog.isShowBalanceMerchantLogExport"
        :close="handleClose"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {Button, Pagination, Dialog} from 'element-ui';
  import {
    QueryFinanceBalance,
    TableFinanceBalance,
    FormFinanceBalanceEdit,
    FormFinanceBalanceMerchantLogExport,
    TableFinanceBalanceApproveLog,
    TableFinanceBalanceLog,
    TableFinanceBalanceMerchantLog
  } from '@/container';
  import {Constant, DataHandle, Config, Http} from '@/util';

  export default {
    name: "BalanceList",
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-finance-balance': QueryFinanceBalance,
      'table-finance-balance': TableFinanceBalance,
      'form-finance-balance-edit': FormFinanceBalanceEdit,
      'form-finance-balance-merchant-log-export': FormFinanceBalanceMerchantLogExport,
      'table-finance-balance-approve-log': TableFinanceBalanceApproveLog,
      'table-finance-balance-log': TableFinanceBalanceLog,
      'table-finance-balance-merchant-log': TableFinanceBalanceMerchantLog,
    },
    computed: {
      ...mapGetters({
        listItem: 'financeBalanceListItem'
      }),
    },
    data() {
      return {
        province: this.$province,
        auth: this.$auth,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
        query: {},
        item: {}, // 需要编辑的项
        formSending: false,
        dialog: {
          isShowBalanceEdit: false,
          isShowApproveLog: false,
          isShowBalanceLog: false,
          isShowMerchantLog: false,
          isShowBalanceMerchantLogExport: false,
        }
      }
    },
    created() {
      documentTitle('财务 - 客户财务管理');
      this.initQuery();
      this.financeBalanceQuery({query: this.$data.query});

      if (!this.auth.isAdmin && !this.auth.FinanceBalanceExport && !this.auth.FinanceBalanceMerchantLogExport && !this.auth.FinanceBalanceMerchantLog) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    methods: {
      ...mapActions(['financeBalanceQuery', 'financeBalanceEdit']),
      initQuery() {
        this.$data.query = Object.assign(this.$data.query, {
          province_code: this.province.code,
          title: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },
      changeQuery() {
        this.financeBalanceQuery({query: this.$data.query});
      },
      resetQuery() {
        this.initQuery();
        this.financeBalanceQuery({query: this.$data.query});
      },

      changePage(page) {
        this.$data.query.page = page;
        this.financeBalanceQuery({query: this.$data.query});
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.financeBalanceQuery({query: this.$data.query});
      },
      handleBalanceEdit(item) {
        this.$data.item = Object.assign(this.$data.item, {
          id: item.id,
          title: item.title,
          balance: item.balance,
          change_type: 1,
          amount: '',
          reason: '',
          remark: ''
        })
        this.$data.dialog.isShowBalanceEdit = true;
      },
      handleSubmit(item) {
        this.$data.formSending = true;
        item = {
          id: item.id,
          amount: item.change_type == 1 ? DataHandle.handlePrice(item.amount) : -(DataHandle.handlePrice(item.amount)),
          reason: item.change_type == 1 ? item.reason : 'manual_deduct',
          remark: item.remark
        }
        let success = () => {
          this.financeBalanceQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.dialog.isShowBalanceEdit = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.financeBalanceEdit({item: item, success, error})
      },
      handleApproveLog(item) {
        this.$data.item = item;
        this.$data.dialog.isShowApproveLog = true;
      },

      handleBalanceLog(item) {
        this.$data.item = item;
        this.$data.dialog.isShowBalanceLog = true;
      },
      //导出
      async handleBalanceExport() {
        let {province_code, title} = this.query;
        let api = Config.api.financeBalanceExport;
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.province.code,
          title: title
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}&title=${title}`;
          
          window.open(queryStr);
        }else{
          this.$store.dispatch('message', { title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },

      handleBalanceMerchantLogExport() {
        this.$data.dialog.isShowBalanceMerchantLogExport = true;
      },

      handleMerchantLog() {
        this.$data.dialog.isShowMerchantLog = true;
      },

      handleClose() {
        this.$data.dialog.isShowBalanceEdit = false;
        this.$data.dialog.isShowApproveLog = false;
        this.$data.dialog.isShowBalanceLog = false;
        this.$data.dialog.isShowMerchantLog = false;
        this.$data.dialog.isShowBalanceMerchantLogExport = false;
      },

    }
  }
</script>

<style scoped>

</style>
