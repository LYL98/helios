<template>
  <div>
    <query-purchase-item
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    />
    <div class="operate"  v-if="auth.isAdmin || auth.PurchaseItemExpor || auth.PurchaseItemAdd">
      <el-button
        v-if="auth.isAdmin || auth.PurchaseItemExport"
        @click.native="() => {supplierItemListExport();}"
        size="mini"
        type="primary"
        plain
      >导出采购商品列表</el-button>
      <el-button
        v-if="auth.isAdmin || auth.PurchaseItemAdd"
        type="primary"
        size="mini"
        @click="handleAddItem"
      >
        新增
      </el-button>
    </div>
    <table-purchase-item
      :data="listItem.items"
      :modifyItem="handleModifyItem"
      :highAuthor="handleHighAuthor"
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
      :visible.sync="dialog.isShowAddItem"
      width="1200px"
      title="新增采购商品"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-purchase-item-add
        v-model="items"
        v-if="dialog.isShowAddItem"
        :submit="handleAddSubmit"
        :close="handleClose"
        :sending="formSending"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowModifyItem"
      width="700px"
      :title="item.item_code + ' / ' + item.item_name + ' 采购商品信息修改'"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-purchase-item-modify
        v-model="item"
        v-if="dialog.isShowModifyItem"
        :submit="handleModifySubmit"
        :close="handleClose"
        :sending="formSending"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowHighAuthor"
      width="700px"
      :title="item.item_code + ' / ' + item.item_name + ' 采购商品信息修改'"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-purchase-item-high-author
        v-model="item"
        v-if="dialog.isShowHighAuthor"
        :submit="handleHighAuthorSubmit"
        :close="handleClose"
        :sending="formSending"
      />
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Button, Pagination, Dialog } from 'element-ui';
  import { ToPrice } from '@/common';
  import {Constant, DataHandle, Config, Http} from '@/util';
  import { QueryPurchaseItem, TablePurchaseItem, FormPurchaseItemAdd, FormPurchaseItemModify, FormPurchaseItemHighAuthor } from '@/container';

  export default {
    name: "ItemList",
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'my-to-price': ToPrice,
      'query-purchase-item': QueryPurchaseItem,
      'table-purchase-item': TablePurchaseItem,
      'form-purchase-item-add': FormPurchaseItemAdd,
      'form-purchase-item-modify': FormPurchaseItemModify,
      'form-purchase-item-high-author': FormPurchaseItemHighAuthor,
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        listItem: 'pruchaseItemListItem'
      }),
    },
    data() {
      return {
        query: {},
        items: [], // 新增的采购商品列表
        item: {}, // 需要修改的采购商品项
        formSending: false,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
        dialog: {
          isShowAddItem: false,
          isShowModifyItem: false,
          isShowHighAuthor: false
        }
      }
    },
    created() {
      documentTitle('采购 - 采购商品管理');
      this.initQuery();
      this.pruchaseItemQuery({ query: this.$data.query });

      if (!this.auth.isAdmin && !this.auth.PurchaseItemExpor && !this.auth.PurchaseItemAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    methods: {
      ...mapActions(['pruchaseItemQuery', 'pruchaseItemAdd', 'pruchaseItemModify', 'pruchaseItemHighAuthor', 'pruchaseItemFirstCheck', 'pruchaseItemSecondCheck', 'pruchaseItemDecline']),
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
          status: '',
          begin_date: '',
          end_date: '',
          buyer_id: ''
        });
      },
      changeQuery() {
        this.pruchaseItemQuery({ query: this.$data.query });
      },
      resetQuery() {
        this.initQuery();
        this.pruchaseItemQuery({ query: this.$data.query });
      },
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
      },
      changePage(page) {
        this.$data.query.page = page;
        this.pruchaseItemQuery({query: this.$data.query});
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.pruchaseItemQuery({query: this.$data.query});
      },
      // 新增采购商品
      handleAddItem() {
        this.dialog.isShowAddItem = true;
      },
      //采购商品列表导出
      async supplierItemListExport() {
        let api = Config.api.purchaseItemExport;
        let {supplier_name, item_condition, status, begin_date, end_date, buyer_id} = this.query;
        let query = {
          supplier_name,
          item_condition,
          status,
          begin_date,
          end_date,
          buyer_id,
        };
        if (!begin_date || !end_date) {
          query.begin_date = '';
          query.end_date = '';
        }
        //判断是否可导出
        this.$store.dispatch('loading', {isShow: true, isWhole: true});
        let res = await Http.get(`${api}_check?province_code=${this.province.code}`, query);
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$store.dispatch('message', { title: '提示', message: res.message, type: 'error' });
        }
        this.$store.dispatch('loading', {isShow: false});
      },
      handleAddSubmit(entity_dicts) {
        this.$data.formSending = true;
        let success = () => {
          this.pruchaseItemQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.dialog.isShowAddItem = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.pruchaseItemAdd({entity_dicts: entity_dicts, success, error});
      },

      // 修改采购商品
      handleModifyItem(item) {
        let { id, item_id, item_code, item_name, supplier_id, total_price, unit_price, number, weight } = item;
        this.$data.item = {
          id: id, // 采购记录ID
          item_id: item_id, // 采购商品id
          item_code, // dialog 需要显示的商品编码
          item_name, // dialog 需要显示的商品标题
          frame: {code: '', price: ''}, // 商品的框信息，在弹窗表单 加载时，进行查询赋值
          frame_code: item.item.frame_code,
          sale_unit: item.item.sale_unit,
          supplier_id: supplier_id,
          total_price: DataHandle.returnPrice(total_price),
          number: number,
          weight: DataHandle.returnWeight(weight),
        };
        this.dialog.isShowModifyItem = true;
      },

      handleHighAuthor(item) {
        let { id, item_id, item_code, item_name, supplier_id, total_price, unit_price, number, weight, status } = item;
        // 兼容历史数据，如果状态为 create 则调整为 init
        if (status === 'create') { status = 'init' }
        this.$data.item = {
          id: id, // 采购记录ID
          item_id: item_id, // 采购商品id
          item_code, // dialog 需要显示的商品编码
          item_name, // dialog 需要显示的商品标题
          frame: {code: '', price: ''}, // 商品的框信息，在弹窗表单 加载时，进行查询赋值
          frame_code: item.item.frame_code,
          sale_unit: item.item.sale_unit,
          supplier_id: supplier_id,
          total_price: DataHandle.returnPrice(total_price),
          number: number,
          weight: DataHandle.returnWeight(weight),
          status: status
        };
        this.dialog.isShowHighAuthor = true;
      },

      handleModifySubmit(item) {

        this.$data.formSending = true;
        item = {
          province_code: this.province.code,
          id: item.id,
          item_id: item.item_id,
          supplier_id: item.supplier_id,
          total_price: DataHandle.handlePrice(item.total_price),
          number: Number(item.number),
          weight: DataHandle.handleWeight(item.weight)
        }
        let success = () => {
          this.pruchaseItemQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.dialog.isShowModifyItem = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.pruchaseItemModify({item: item, success, error})
      },

      handleHighAuthorSubmit(item) {

        this.$data.formSending = true;
        item = {
          province_code: this.province.code,
          id: item.id,
          item_id: item.item_id,
          supplier_id: item.supplier_id,
          total_price: DataHandle.handlePrice(item.total_price),
          number: Number(item.number),
          weight: DataHandle.handleWeight(item.weight),
          status: item.status
        }
        let success = () => {
          this.pruchaseItemQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.dialog.isShowHighAuthor = false;
        };
        let error = () => {
          this.$data.formSending = false;
        }
        this.pruchaseItemHighAuthor({item: item, success, error})
      },

      handleClose() {
        this.dialog.isShowAddItem = false;
        this.dialog.isShowModifyItem = false;
        this.dialog.isShowHighAuthor = false;
      },

    }
  }
</script>

<style scoped>
  .table-footer {
    display: flex;
    justify-content: space-between;
  }
  ul.amount {
    display: flex;
    align-items: center;
    flex: 1;
  }
  ul.amount > li + li {
    margin-left: 15px;
  }
</style>
