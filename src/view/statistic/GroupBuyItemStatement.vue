<template>
  <sub-menu>
    <query-group-buy-item-statistics
    v-model="query"
    @change="changeQuery"
    :reset="resetQuery"/>
    <div v-if="auth.isAdmin || auth.GroupBuyItemStatementExport" class="operate">
      <el-button
        v-if="auth.isAdmin || auth.GroupBuyItemStatementExport"
        @click.native="() => {listExport();}"
        size="mini"
        type="primary"
        plain
      >导出</el-button>
    </div>
    <div class="statistics-table-list-container" style="position: relative;">
      <el-table
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        @sort-change="onSort"
        style="width: 100%; margin-top: 20px">
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>

        <el-table-column
          :min-width="maxLabelWidth < 200 ? 200 : maxLabelWidth"
          label="商品名称">
          <template slot-scope="scope">
            <div id="titleScope" class="td-item">{{ formatValue(scope.row.item_code) + '/' + formatValue(scope.row.item_title) }}</div>
          </template>
        </el-table-column>

        <el-table-column
          min-width="100"
          label="商品分类">
          <template slot-scope="scope">
            <div class="td-item">{{ formatValue(scope.row.item_category) }}</div>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="user_num"
          label="参团人数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">{{ formatValue(scope.row.user_num) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="item_sale_num"
          label="销售件数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">
              <span>{{formatValue(scope.row.item_sale_num)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num"
          label="订单数量"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">
              <span>{{formatValue(scope.row.order_num)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_price_sale"
          label="下单金额"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">{{returnPrice(scope.row.total_price_sale)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="header_profit"
          label="收入总计"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">{{returnPrice(scope.row.header_profit)}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer" style="padding-bottom: 10px" v-if="dataItem.num > 0">
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
  </sub-menu>
</template>

<script>
  import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
  import QueryGroupBuyItemStatistics from './QueryGroupBuyItemStatistics';
  import Constant from "@/util/constant";
  import { DataHandle, Config, Http } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: "GroupBuyItemStatement",
  mixins: [mainMixin],
  data() {
    return {
      dataItem: {
        items: [],
        num: 0
      },
      maxLabelWidth: 200,
      /*
      * groupbuy_time: (YYYY-mm-dd HH:MM:ss)团购时间
        condition:
        sort: 排序字段指定 参团人数(user_num)/销售件数(item_sale_num)/下单金额(total_price_sale)/收入金额(header_profit)
        page:
        page_size:*/
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        category_id: '',
        sort: '',
        condition: '',
        begin_date: '',
        end_date: '',
      },
      currentRow: {}
    }
  },
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'query-group-buy-item-statistics': QueryGroupBuyItemStatistics
  },
  created() {
  },
  methods: {
    indexMethod(index) {
      return (this.query.page - 1) * this.query.page_size + index + 1;
    },

    cellMouseEnter(row, column, cell, event) {
      // console.log('row: ', row);
      if(row.id !== this.$data.currentRow.id) {
        this.$data.currentRow = row;
      }
    },

    cellMouseLeave(row, column, cell, event) {
      this.$data.currentRow = {};
    },

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'stripe-row'
      }
      return '';
    },

    formatDate(date) {
      let d = new Date(Date.parse(date))
      return DataHandle.formatDate(d, 'yyyy-MM-dd')
    },

    formatValue(value) {
      return value || value === 0 ? value : '-'
    },
    formatRate(value) {
      return value || value === 0 ? this.returnMarkup(value) + '%' : '-'
    },
    formatString(value) {
      return value ? value : '-'
    },

    //返回价格
    returnPrice(price){
      return price || price === 0 ? '¥' + DataHandle.returnPrice(price) : '-';
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    returnWeight(weight) {
      return DataHandle.returnWeight(weight)
    },

    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadListDataFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.statisticalSumGroupBuyItem();
    },
    changeQuery() {
      this.loadListDataFirstPage()
    },
    resetQuery() {
    },

    onSort({ column, prop, order }) {
      if (order === 'ascending') {
        this.query.sort = prop;
      } else if (order === 'descending') {
        this.query.sort = '-' + prop
      } else {
        this.query.sort = ''
      }
      this.statisticalSumGroupBuyItem()
    },

    //导出
    async listExport() {
      let api = Config.api.statisticalSumGroupBuyItemExport;

      let {condition, sort, begin_date, end_date } = this.query;
      let query = {
        condition,
        sort,
        begin_date,
        end_date,
      };
      //判断是否可导出
      this.$loading({ isShow: true,  isWhole: true });
      let res = await Http.get(`${api}_check`, {
        province_code: this.province.code,
        ...query
      });
      if(res.code === 0){
        let queryStr = `${api}?province_code=${this.province.code}`;
        for (let item in query) {
          queryStr += `&${item}=${query[item]}`
        }
        window.open(queryStr);
      }else{
        this.$message({ title: '提示', message: res.message, type: 'error' });
      }
      this.$loading({ isShow: false });
    },

    loadListDataFirstPage() {
      this.query.page = 1;
      this.statisticalSumGroupBuyItem();
    },

    async statisticalSumGroupBuyItem(){
      let that = this;
      let { query } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.statisticalSumGroupBuyItem, query);
      if(res.code === 0){
        //手动增加总计和平均值的行数据
        // if (res.data.items && res.data.items.length > 0) {
        //   let averageObj = res.data.average;
        //   averageObj.m_title = '平均';
        //   averageObj.count_real = DataHandle.returnAverage(averageObj.count_real);
        //   averageObj.store_num_ord = DataHandle.returnAverage(averageObj.store_num_ord);
        //   res.data.items.unshift(averageObj);
        //   let totalObj = res.data.total;
        //   totalObj.m_title = '总计';
        //   res.data.items.unshift(totalObj);
        // }
        //
        res.data.items.map((item, index) => item.id = index);
        that.$data.dataItem = res.data;
        // that.maxLabelWidth = DataHandle.computeTableLabelMinWidth(that.$data.dataItem.items,
        //   item => item.m_title ? item.m_title : selectArea === 'item' ? that.formatString(item.item_code) + '/' + that.formatString(item.item_title)
        //     : selectArea === 'buyer' ? that.formatString(item.buyer_name) : that.formatString(item.system_class_title)
        // )
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
  }
}
</script>

<style scoped>

</style>
