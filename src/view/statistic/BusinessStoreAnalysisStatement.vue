<!--
  客户分析表
-->
<template>
  <div>
    <query-business-store
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"/>

    <div class="statistics-table-list-container">
      <el-table
        :data="dataItem.items"
        :height="viewWindowHeight - offsetHeight"
        :header-cell-style="{'backgroundColor': '#ffffff'}"
        @sort-change="onSort"
        :row-class-name="highlightRowClassName"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        style="width: 100%;">
        <el-table-column
          label="门店"
          fixed="left"
          prop="store_title"
          :min-width="maxLabelWidth"
          align="left">
          <template slot-scope="scope">
            <span>{{ formatValue(scope.row.store_title) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gmv" label="GMV" min-width="140" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ returnPrice(scope.row.gmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_price" label="订单应付金额" min-width="140" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ returnPrice(scope.row.real_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fram_total_price" label="框金额" min-width="120" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ returnPrice(scope.row.fram_total_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bonus_promotion" label="优惠金额" min-width="120" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.bonus_promotion > 0 ? '-' : ''}}{{ returnPrice(scope.row.bonus_promotion) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="buy_days" label="购买天数" min-width="130" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.buy_days) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="repeat_rate" label="复购率" min-width="100" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatRate(scope.row.repeat_rate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aftersale_rate" label="退赔率" min-width="100" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatRate(scope.row.aftersale_rate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cust_price" label="客单价" min-width="100" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ returnPrice(scope.row.cust_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lost_days" label="流失天数" min-width="110" align="left" sortable="custom">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.lost_days) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" align="left">
          <el-table-column
            min-width="100"
            align="left"
            v-for="(d, index) in dateRange()"
            :key="index"
            :label="labelDate(d)">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ cellValue(scope.row.items, d) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="平均值" min-width="100" align="left">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ average(scope.row.items) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合计" min-width="120" align="left">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ total(scope.row.items) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div class="table-bottom" style="padding-bottom: 10px" v-if="dataItem.num > 0">
        <div class="table-pagination">
          <el-pagination
            background
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="query.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataItem.num">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
import { SelectZone, SelectCity } from '@/common';
import { Http, Config, DataHandle, Constant } from '@/util';
import { QueryBusinessStore } from '@/container';
import viewMixin from '@/view/view.mixin';

export default {
  name: "BusinessStoreAnalysisStatement",
  mixins: [viewMixin],
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'my-select-zone': SelectZone,
    'my-select-city': SelectCity,
    'query-business-store': QueryBusinessStore
  },
  created() {
    // this.loadOrderStoreAnalysisListFirstPage();
  },
  data() {
    return {
      dataItem: {},
      maxLabelWidth: 80,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        zone_id: '',
        city_code: '',
        begin_date: '',
        end_date: '',
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
      return row.id != this.$data.currentRow.id ? 'add-dot' : ''
    },

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex === 0 || rowIndex === 1) {
        //总计、平均值
        return 'highlight-row';
      } else if (rowIndex % 2 === 1) {
        return 'stripe-row'
      }
      return '';
    },

    formatValue(value) {
      return value || value === 0 ? value : '-'
    },
    formatRate(value) {
      return value || value === 0 ? this.returnMarkup(value) + '%' : '-'
    },
    //返回价格
    returnPrice(price){
      if(price || price === 0){
        if(price < 0){
          return '-¥' + DataHandle.returnPrice(Math.abs(price));
        }else{
          return '¥' + DataHandle.returnPrice(price);
        }
      }else{
        return '-';
      }
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadOrderStoreAnalysisListFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadOrderStoreAnalysisList();
    },
    changeQuery() {
      this.loadOrderStoreAnalysisListFirstPage()
    },
    resetQuery() {
      // this.$data.query = {
      //   page: 1,
      //   page_size: 20,
      //   zone_id: '',
      //   city_code: '',
      //   begin_date: '',
      //   end_date: '',
      // };
      // this.loadOrderStoreAnalysisListFirstPage()
    },
    onSort({ column, prop, order }) {
      if (order === 'ascending') {
        this.query.sort = prop;
      } else if (order === 'descending') {
        this.query.sort = '-' + prop
      } else {
        this.query.sort = ''
      }
      this.loadOrderStoreAnalysisListFirstPage()
    },
    dateRange() {
      let { query } = this;
      if (query.begin_date && query.end_date) {
        let begin = new Date(Date.parse(query.begin_date));
        let end = new Date(Date.parse(query.end_date));
        let dateList = Array();
        let tmpDate = new Date(begin.setDate(begin.getDate() - 1));
        while (tmpDate < end) {
          tmpDate = new Date(begin.setDate(tmpDate.getDate() + 1));
          dateList.push(tmpDate);
        }
        return dateList;
      } else {
        return this.defaultDateRange();
      }
    },
    defaultDateRange() {
      // let today = new Date();
      // let yesterday = new Date(today.setDate(today.getDate() - 1));
      return Array()
    },
    labelDate(date) {
      return DataHandle.formatDateLabel(date)
    },
    //返回每个单元格的值
    cellValue(rowItems, colDate) {
      let dateStr = DataHandle.formatDate(colDate, 'yyyy-MM-dd');
      let cellItem;
      rowItems.map(function (rowItem) {
        if (rowItem.opt_date === dateStr) {
          cellItem = rowItem;
        }
      });
      return cellItem ? this.returnPrice(cellItem.amount_item_sum) : '-'
    },
    total(rowItems) {
      let that = this;
      let sum = 0;
      for (let i = 0;  i < rowItems.length; i++) {
        let cellItem = rowItems[i];
        sum += Number(cellItem.amount_item_sum);
      }
      return that.returnPrice(sum)
    },
    average(rowItems) {
      let that = this;
      let sum = 0;
      for (let i = 0;  i < rowItems.length; i++) {
        let cellItem = rowItems[i];
        sum += Number(cellItem.amount_item_sum);
      }
      return that.returnPrice(sum / rowItems.length)
    },
    loadOrderStoreAnalysisListFirstPage() {
      this.query.page = 1;
      this.loadOrderStoreAnalysisList();
    },
    loadOrderStoreAnalysisList() {
      this.orderStoreAnalysisList().catch(e => {console.error(e)});
    },
    async orderStoreAnalysisList(){
      let that = this;
      let { query } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.statisticalOrderStoreAnalysis, query);
      if (res.code === 0){
        if (res.data.items && res.data.items.length > 0) {
          let total = res.data.total;
          total.store_title = '总计';
          let average = res.data.average;
          average.store_title = '平均值';
          res.data.items.unshift(average);
          res.data.items.unshift(total);
        }
        res.data.items.map((item, index) => item.id = index);
        that.$data.dataItem = res.data;
        that.maxLabelWidth = DataHandle.computeTableLabelMinWidth(that.$data.dataItem.items,
          item => item.store_title)
      } else {
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
  }
}
</script>

<style scoped>

</style>
