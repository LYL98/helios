<template>
  <sub-menu>
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
      :data="dataItem.items"
      :page="query.page"
      :pageSize="query.page_size"
      :itemEdit="handleBalanceEdit"
      :approveLog="handleApproveLog"
      :balanceLog="handleBalanceLog"
      :windowHeight="viewWindowHeight"
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
          :total="dataItem.num"
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
  </sub-menu>
</template>

<script>
  import {Button, Pagination, Dialog} from 'element-ui';
  import QueryFinanceBalance from './QueryFinanceBalance';
  import TableFinanceBalance from './TableFinanceBalance';
  import FormFinanceBalanceEdit from './FormFinanceBalanceEdit';
  import FormFinanceBalanceMerchantLogExport from './FormFinanceBalanceMerchantLogExport';
  import TableFinanceBalanceApproveLog from './TableFinanceBalanceApproveLog';
  import TableFinanceBalanceLog from './TableFinanceBalanceLog';
  import TableFinanceBalanceMerchantLog from './TableFinanceBalanceMerchantLog';
  import {Constant, DataHandle, Config, Http} from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Main",
    mixins: [mainMixin],
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
    data() {
      return {
        auth: this.$auth,
        query: {
          province_code: '',
          title: ''
        },
        dataItem: {
          items: [],
          num: 0
        },
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
      //在Query组件初始化
      //this.getData();
    },
    methods: {
      initQuery(resetData) {
        let provinceCode = '';
        if(resetData && resetData.province_code) provinceCode = resetData.province_code;

        this.$data.query = Object.assign(this.$data.query, {
          province_code: provinceCode,
          title: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },
      //获取数据
      async getData(){
        this.$loading({ isShow: true });
        let res = await Http.get(Config.api.financeBalanceQuery, this.query);
        this.$loading({ isShow: false });
        if (res.code === 0) {
          this.$data.dataItem = res.data;
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      changeQuery() {
        this.getData();
      },
      resetQuery(resetData) {
        this.initQuery(resetData);
        this.getData();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.getData();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.getData();
      },
      handleBalanceEdit(item) {
        this.$data.item = Object.assign(this.$data.item, {
          id: item.id,
          title: item.title,
          balance: item.balance,
          change_type: 1,
          amount: '',
          opt_type: '',
          remark: ''
        })
        this.$data.dialog.isShowBalanceEdit = true;
      },
      handleSubmit(item) {
        this.$data.formSending = true;
        item = {
          id: item.id,
          amount: item.change_type == 1 ? DataHandle.handlePrice(item.amount) : -(DataHandle.handlePrice(item.amount)),
          opt_type: item.change_type == 1 ? item.opt_type : 'manual_deduct',
          remark: item.remark
        }
        let success = () => {
          this.getData();
          this.$data.formSending = false;
          this.dialog.isShowBalanceEdit = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.financeBalanceEdit({item: item, success, error})
      },
      //余额修改
      async financeBalanceEdit({item, success, error}){
        let res = await Http.post(Config.api.financeBalanceEdit, item);
        let message = (item.amount >= 0 ? '充值' : '扣款') + '记录提交成功！等待财务审核...';
        if (res.code === 0) {
          this.$message({title: '提示', message: message, type: 'success'});
          // 如果有callback 则执行callback
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
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
        let { title } = this.query;
        let api = Config.api.financeBalanceExport;
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.query.province_code,
          title: title
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.query.province_code}&title=${title}`;
          
          window.open(queryStr);
        }else{
          this.$store.this.$message({ title: '提示', message: res.message, type: 'error' });
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
