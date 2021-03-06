<template>
  <sub-menu>
    <query-finance-approve v-model="query" @change="changeQuery" :reset="resetQuery"/>
    <table-finance-approve :data="dataItem.items" :windowHeight="viewWindowHeight" :page="query.page" :pageSize="query.page_size" :itemEdit="handleItemEdit">
      <template slot="query-tab">
        <div class="table-top">
          <div class="left">
            <query-tabs v-model="query.status" @change="changeQuery" :tab-panes="{'全部': '', '待审核': 'wait_check', '审核通过': 'checked', '被驳回': 'declined'}"/>
          </div>
        </div>
      </template>
    </table-finance-approve>
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
      :visible.sync="dialog.isShowApproveEdit"
      width="680px"
      title="财务审核"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-finance-approve-edit
        v-if="dialog.isShowApproveEdit"
        :item="item"
        :sending="formSending"
        :submit="handleSubmit"
        :close="handleClose"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import { Pagination, Dialog } from 'element-ui';
  import QueryFinanceApprove from './QueryFinanceApprove';
  import TableFinanceApprove from './TableFinanceApprove';
  import FormFinanceApproveEdit from './FormFinanceApproveEdit';
  import { Http, Config, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: "Main",
    mixins: [mainMixin],
    components: {
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-finance-approve': QueryFinanceApprove,
      'table-finance-approve': TableFinanceApprove,
      'form-finance-approve-edit': FormFinanceApproveEdit,
      'query-tabs': queryTabs
    },
    data() {
      return {
        auth: this.$auth,
        query: {
          province_code: '',
          status: '',
          reason: '',
          merchant_title: '',
          operator_name: ''
        },
        dataItem: {
          items: [],
          num: 0
        },
        dialog: {
          isShowApproveEdit: false,
        },
        item: {},
        formSending: false,
      }
    },
    created() {
      documentTitle('财务 - 财务审核');
      // 判断是否具有促销活动的权限
      this.initQuery();

      //在Query组件初始化
      //this.getData();
    },
    methods: {
      async getData() {
        let res = await Http.get(Config.api.financeApproveQuery, this.query);
        if (res.code === 0) {
          this.$data.dataItem = res.data;
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      initQuery(resetData) {
        let provinceCode = '';
        if(resetData && resetData.province_code) provinceCode = resetData.province_code;

        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: provinceCode,
          status: '',
          reason: '',
          merchant_title: '',
          operator_name: '',
          begin_date: '',
          end_date: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
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
      handleItemEdit(item) {
        this.$data.dialog.isShowApproveEdit = true;
        this.$data.item = Object.assign(this.$data.item, {
          id: item.id,
          status: 'checked',
          audit_remark: ''
        });
      },
      handleSubmit(item) {
        this.$data.formSending = true;
        let success = () => {
          this.getData();
          this.$data.formSending = false;
          this.dialog.isShowApproveEdit = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.financeApproveEdit({item: item, success, error})
      },
      handleClose() {
        this.$data.dialog.isShowApproveEdit = false;
      },
      async financeApproveEdit({item, success, error}) {
        let res = await Http.post(Config.api.financeApproveEdit, item);
        let message = (item.status >= 'checked' ? '审核' : '驳回') + '成功！';
        if (res.code === 0) {
          this.$message({title: '提示', message: message, type: 'success'});
          // 如果有callback 则执行callback
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
      },
    }
  }
</script>

<style scoped>

</style>
