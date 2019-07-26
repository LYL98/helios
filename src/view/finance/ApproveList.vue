<template>
  <div>
    <query-finance-approve
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    />
    <table-finance-approve
      :data="listItem.items"
      :page="query.page"
      :pageSize="query.page_size"
      :offset-height="offsetHeight"
      :itemEdit="handleItemEdit"
    />
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
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Pagination, Dialog } from 'element-ui';
  import { QueryFinanceApprove, TableFinanceApprove, FormFinanceApproveEdit } from '@/container';
  import { Constant } from '@/util';
  export default {
    name: "ApproveList",
    components: {
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-finance-approve': QueryFinanceApprove,
      'table-finance-approve': TableFinanceApprove,
      'form-finance-approve-edit': FormFinanceApproveEdit
    },
    computed: {
      ...mapGetters({
        listItem: 'financeApproveListItem'
      }),
    },
    data() {
      return {
        province: this.$province,
        auth: this.$auth,
        query: {},
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
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
      this.financeApproveQuery({ query: this.$data.query });
    },
    methods: {
      ...mapActions(['financeApproveQuery', 'financeApproveEdit']),
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
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
        this.financeApproveQuery({ query: this.$data.query });
      },
      resetQuery() {
        this.initQuery();
        this.financeApproveQuery({ query: this.$data.query });
      },
      changePage(page) {
        this.$data.query.page = page;
        this.financeApproveQuery({ query: this.$data.query });
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.financeApproveQuery({ query: this.$data.query });
      },
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
      },
      handleItemEdit(item) {
        this.$data.dialog.isShowApproveEdit = true;
        this.$data.item = Object.assign(this.$data.item, {
          id: item.id,
          status: 'checked',
          check_remark: ''
        });
      },
      handleSubmit(item) {
        this.$data.formSending = true;
        let success = () => {
          this.financeApproveQuery({query: this.$data.query});
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
      }
    }
  }
</script>

<style scoped>

</style>
