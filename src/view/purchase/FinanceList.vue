<template>
  <div>
    <query-purchase-finance
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    />
    <table-purchase-finance
      :data="listItem.items"
      :query="query"
      :approveItem="handleApproveItem"
      :page="query.page"
      :pageSize="query.page_size"
      :offset-height="offsetHeight"
    />
    <div class="footer">
      <ul class="amount">
        <li>总计<my-to-price :amount="Number(listItem.left_price) + Number(listItem.cash_price)"/></li>
        <li>付现<my-to-price :amount="listItem.cash_price"/></li>
        <li>剩余<my-to-price :amount="listItem.left_price"/></li>
      </ul>
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
      :visible.sync="dialog.isShowApprove"
      width="600px"
      title="采购财务审核"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-purchase-item-approve
        v-model="item"
        v-if="dialog.isShowApprove"
        :submit="handleSubmit"
        :close="handleClose"
        :sending="formSending"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import { Pagination, Dialog } from 'element-ui';
  import { ToPrice } from '@/common';
  import { QueryPurchaseFinance, TablePurchaseFinance, FormPurchaseItemApprove } from '@/container';
  import {Constant, DataHandle} from '@/util';

  export default {
    name: "WarehouseList",
    components: {
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'my-to-price': ToPrice,
      'query-purchase-finance': QueryPurchaseFinance,
      'table-purchase-finance': TablePurchaseFinance,
      'form-purchase-item-approve': FormPurchaseItemApprove
    },
    computed: {
      ...mapGetters({
        province: 'globalProvince',
        listItem: 'pruchaseFinanceListItem'
      }),
    },
    data() {
      return {
        auth: this.$auth,
        query: {},
        item: {}, // 需要审核的项目
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
        formSending: false,
        dialog: {
          isShowApprove: false
        }
      }
    },
    created() {
      documentTitle('采购 - 采购财务审核');
      this.initQuery();
      this.pruchaseFinanceQuery({ query: this.$data.query });
    },
    methods: {
      ...mapActions(['pruchaseFinanceQuery', 'pruchaseFinanceApprove', 'pruchaseFinanceDecline']),
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          page: 1,
          page_size: Constant.PAGE_SIZE,
          supplier_name: '',
          item_condition: '',
          if_check_opt: '',
          opt_type: '',
          status: 'first_checked',
          begin_date: '',
          end_date: '',
          buyer_id: ''
        });
      },
      changeQuery() {
        this.pruchaseFinanceQuery({ query: this.$data.query });
      },
      resetQuery() {
        this.initQuery();
        this.pruchaseFinanceQuery({ query: this.$data.query });
      },
      changePage(page) {
        this.$data.query.page = page;
        this.pruchaseFinanceQuery({query: this.$data.query});
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.pruchaseFinanceQuery({query: this.$data.query});
      },
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
      },
      handleApproveItem(item) {
        this.$data.item = Object.assign({}, this.$data.item, {
          id: item.id,
          type: 'checked',
          remark: ''
        });
        this.$data.dialog.isShowApprove = true;
      },
      handleSubmit() {
        this.$data.formSending = true;
        let { id, remark, type } = this.$data.item;
        let success = () => {
          this.pruchaseFinanceQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.$data.dialog.isShowApprove = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        if (type === 'declined') {
          this.pruchaseFinanceDecline({id, remark, success, error});
        } else {
          this.pruchaseFinanceApprove({id, remark, success, error});
        }

      },
      handleClose() {
        this.$data.dialog.isShowApprove = false;
      }
    }
  }
</script>

<style scoped>

  ul.amount {
    display: flex;
    align-items: center;
    flex: 1;
  }
  ul.amount > li + li {
    margin-left: 15px;
  }
</style>
