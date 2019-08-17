<template>
  <div>
    <el-dialog
      :title="detail.store_title + '商品销售统计'"
      :visible.sync="isShow"
      width="800px"
      @close="onCancel"
      :before-close="cancelStatistic">
      <div style="border-bottom: #F7F7F8 solid 10px; padding-bottom: 16px">
        <my-select-buyer :provinceCode="province.code"
                         v-model="query.buyer_id"
                         size="small"
                         v-on:change="loadStoreSaleListWithFirstPage"
                         style="width: 180px"/>
        <my-select-display-class v-model="query.display_class"
                                 :use-name="true"
                                 size="small"
                                 v-on:change="loadStoreSaleListWithFirstPage"
                                 style="width: 180px;margin-left: 20px"/>
        <el-button type="primary" size="small" style="margin-left: 12px;" @click="clearQuery">重置</el-button>
      </div>
      <el-table
        :data="merchantListData.items"
        :row-class-name="highlightRowClassName"
        @sort-change="onSort"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        style="width: 100%;">
        <el-table-column
          prop="store_title"
          min-width="200"
          label="编号/商品">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.item_code + '/' + scope.row.item_title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count_real"
          label="件数"
          align="left"
          sortable="custom"
          min-width="180">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.count_real}}件</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_real"
          label="金额"
          align="left"
          sortable="custom"
          min-width="180">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)" style="font-size: 16px; color: #ff5252;">&yen;{{scope.row.amount_real}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom" v-if="merchantListData.num > 0">
        <div class="table-pagination">
          <el-pagination
            background
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="query.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="merchantListData.num">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Dialog, Button, Input, Table, TableColumn, Pagination } from 'element-ui';
import { SelectBuyer, SelectDisplayClass } from "@/common"
import { Statistic } from '@/service';
import { DataHandle } from '@/util';

export default {
  name: "ItemSalesStatistic",
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'my-select-buyer': SelectBuyer,
    'my-select-display-class': SelectDisplayClass,
  },
  created() {
  },
  props: ['item'],
  data() {
    return {
      isShow: false,
      merchantListData: {},
      detail: {

      },
      query: {
        page: 1,
        page_size: 20,
        begin_date: '',
        end_date: '',
        store_id: '',
        province_code: '',
        buyer_id: '',
        display_class: '',
        sort: ''
      },
      currentRow: {}
    }
  },
  methods: {
    cellMouseEnter(row, column, cell, event) {
      if(row.id !== this.$data.currentRow.id) {
        this.$data.currentRow = row;
      }
    },

    cellMouseLeave(row, column, cell, event) {
      this.$data.currentRow = {};
    },

    isEllipsis(row) {
      return row.id != this.$data.currentRow.id ? 'ellipsis' : ''
    },
    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'stripe-row'
      } else {
        return 'default-row';
      }
    },
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.query.page = 1;
      this.loadStoreSaleList()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadStoreSaleList();
    },
    cancelStatistic() {
      this.isShow = false;
    },
    onCancel() {
      this.$attrs.callback();
    },
    onSort({ column, prop, order }) {
      if (order === 'ascending') {
        this.query.sort = prop;
      } else if (order === 'descending') {
        this.query.sort = '-' + prop
      } else {
        this.query.sort = ''
      }
      this.loadStoreSaleListWithFirstPage()
    },
    clearQuery(){
      this.$data.query = {
        page: 1,
        page_size: 20,
        begin_date: '',
        end_date: '',
        store_id: '',
        buyer_id: '',
        display_class: '',
        sort: ''
      };
      this.loadStoreSaleListWithFirstPage()
    },
    loadStoreSaleListWithFirstPage() {
      this.query.page = 1;
      this.loadStoreSaleList();
    },
    loadStoreSaleList() {
      let { query, detail } = this;
      query.store_id = detail.store_id;
      query.begin_date = detail.begin_date;
      query.end_date = detail.end_date;
      this.storeSaleItems().catch(e => console.error(e))
    },

    async storeSaleItems(){
      let that = this;
      let { query } = that;
      query.is_gift = 0;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Statistic.statisticalOrderStoreSaleItems(query);
      if(res.code === 0){
        res.data.items.map((item, index) => {
          item.id = index;
          item.amount_real = that.returnPrice(Number(item.amount_real))
        });
        that.$data.merchantListData = res.data;
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
  },
  watch: {
    item: function (a, b) {
      this.detail = Object.assign({}, this.$data.detail, a);
      this.isShow = this.detail.isShow;
      if (this.isShow) {
        this.loadStoreSaleList()
      }
    }
  }
}
</script>

<style scoped>

</style>
