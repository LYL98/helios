<template>
  <div>
    <el-dialog
      :title="detail.code + '/' + detail.title + '各门店销售统计'"
      :visible.sync="isShow"
      width="800px"
      @close="onCancel"
      :before-close="cancelStatistic">
      <div style="border-bottom: #F7F7F8 solid 10px; padding-bottom: 16px">
        <my-select-zone v-model="query.zone_code"
                        :provinceCode="province.code"
                        clearable
                        size="small"
                        @change="changeZone"
                        style="width: 180px;"/>
        <my-select-city v-model="query.city_code"
                        :provinceCode="province.code"
                        ref="mySelectCity"
                        clearable
                        size="small"
                        :zoneCode="query.zone_code"
                        @change="changeCity"
                        style="width: 180px;margin-left: 20px"/>
        <el-input placeholder="请输入门店名称/电话"
                  v-model="query.condition"
                  style="width: 180px;margin-left: 20px"
                  size="small"
                  clearable
                  @clear="loadItemSalesListWithFirstPage"
                  @keyup.enter.native="loadItemSalesListWithFirstPage"></el-input>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-search"
                   style="margin-left: 4px"
                   @click="loadItemSalesListWithFirstPage"></el-button>
        <el-button type="primary" size="small" style="margin-left: 12px" @click="clearQuery">重置</el-button>
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
          label="门店">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.store_title}}</span>
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
import { SelectProvince, SelectCity, SelectZone } from "@/common"
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
    'my-select-province': SelectProvince,
    'my-select-city': SelectCity,
    'my-select-zone': SelectZone,
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
        condition: '',
        item_id: '',
        province_code: '',
        zone_code: '',
        city_code: '',
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
      this.loadItemSalesList()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadItemSalesList();
    },
    changeZone() {
      if (this.query.zone_code === '') {
        this.query.city_code = '';
      }
      this.loadItemSalesListWithFirstPage()
    },
    changeCity() {
      this.loadItemSalesListWithFirstPage()
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
      this.loadItemSalesListWithFirstPage()
    },
    clearQuery(){
      this.$data.query = {
        page: 1,
        page_size: 20,
        begin_date: '',
        end_date: '',
        condition: '',
        item_id: '',
        province_code: '',
        zone_code: '',
        city_code: '',
        sort: ''
      };
      this.loadItemSalesListWithFirstPage()
    },
    loadItemSalesListWithFirstPage() {
      this.query.page = 1;
      this.loadItemSalesList();
    },
    loadItemSalesList() {
      let { query, detail } = this;
      query.item_id = detail.id;
      query.begin_date = detail.begin_date;
      query.end_date = detail.end_date;
      this.itemSaleStores()
    },

    async itemSaleStores(){
      let that = this;
      let { query } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Statistic.statisticalOrderItemSaleStores(query);
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
        this.loadItemSalesList()
      }
    }
  }
}
</script>

<style scoped>

</style>
