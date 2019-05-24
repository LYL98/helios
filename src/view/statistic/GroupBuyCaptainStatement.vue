<template>
  <div>
    <query-group-buy-captain-statistics
    v-model="query"
    @change="changeQuery"
    :reset="resetQuery"
    @expandChange="onExpandChange"/>
    <div v-if="auth.isAdmin || auth.GroupBuyCaptainStatementExport" class="operate">
      <el-button
        v-if="auth.isAdmin || auth.GroupBuyCaptainStatementExport"
        @click.native="() => {listExport();}"
        size="mini"
        type="primary"
        plain
      >导出</el-button>
    </div>
    <div class="statistics-table-list-container" style="position: relative;">
      <el-table
        :data="dataItem.items"
        :height="windowHeight - offsetHeight"
        :row-class-name="highlightRowClassName"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        @sort-change="onSort"
        style="width: 100%; margin-top: 20px">
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>

        <el-table-column
          :min-width="maxLabelWidth < 120 ? 120 : maxLabelWidth"
          prop="realname"
          label="团长名称">
          <template slot-scope="scope">
            <span id="titleScope" :class="isEllipsis(scope.row)">{{ formatValue(scope.row.realname) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_title"
          label="门店名称"
          align="left"
          min-width="180">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.store_title)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="city_title"
          label="所在仓"
          align="left"
          min-width="150">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.city_title) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="member_num"
          label="参团人数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              <span>{{formatValue(scope.row.member_num)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          label="销售件数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatValue(scope.row.sale_num)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num"
          label="订单数量"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              <span>{{formatValue(scope.row.order_num)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_amount"
          label="下单金额"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.pay_amount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_amount"
          label="收入总计"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.sale_amount)}}</span>
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
  </div>
</template>

<script>
  import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
  import { QueryGroupBuyCaptainStatistics } from '@/container'
  // import { SelectBuyer, SelectDisplayClass, SearchItem } from '@/common';
  import Constant from "@/util/constant";
  import { Statistic } from '@/service';
  import { DataHandle, Config } from '@/util';
  import { mapGetters, mapActions } from 'vuex';

export default {
  name: "GroupBuyCaptainStatement",
  data() {
    return {
      dataItem: {
        items: [],
        num: 0
      },
      maxLabelWidth: 120,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
      /*
    begin_date: 开始日期
end_date: 结束日期
city_code: 县code(所在仓code) 来源于 县列表
condition:
sort: 排序字段指定 参团人数(member_num)/销售件数(sale_num)/下单金额(pay_amount)/收入金额(sale_amount)
page:
page_size:*/
      query: {
        page: 1,
        page_size: 20,
        begin_date: '',
        end_date: '',
        province_code: '',
        city_code: '',
        sort: '',
        condition: '',
        is_group: 1
      },
      currentRow: {}
    }
  },
  computed: mapGetters({
    auth: 'globalAuth',
    province: 'globalProvince',
    windowHeight: 'windowHeight'
  }),
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'query-group-buy-captain-statistics': QueryGroupBuyCaptainStatistics
  },
  created() {
    if (!this.auth.isAdmin && !this.auth.GroupBuyCaptainStatementExport) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
    }
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

    isEllipsis(row) {
      return row.id != this.$data.currentRow.id ? 'ellipsis' : ''
    },

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'stripe-row'
      }
      return '';
    },

    onExpandChange(isExpand) {
      if (isExpand) {
        this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
      } else {
        this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
      }
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
      this.statisticalSumGroupBuyCaptain();
    },
    changeQuery() {
      this.loadListDataFirstPage()
    },
    resetQuery() {
    },

    onSort({ column, prop, order }) {
      switch (prop) {
        case 'order_num':
          if (order === 'ascending') {
            this.query.sort = 'order_num'
          } else if (order === 'descending') {
            this.query.sort = '-order_num'
          } else {
            this.query.sort = ''
          }
          break;
        case 'member_num':
          if (order === 'ascending') {
            this.query.sort = 'member_num'
          } else if (order === 'descending') {
            this.query.sort = '-member_num'
          } else {
            this.query.sort = ''
          }
          break;
        case 'sale_num':
          if (order === 'ascending') {
            this.query.sort = 'sale_num'
          } else if (order === 'descending') {
            this.query.sort = '-sale_num'
          } else {
            this.query.sort = ''
          }
          break;
        case 'pay_amount':
          if (order === 'ascending') {
            this.query.sort = 'pay_amount'
          } else if (order === 'descending') {
            this.query.sort = '-pay_amount'
          } else {
            this.query.sort = ''
          }
          break;
        case 'sale_amount':
          if (order === 'ascending') {
            this.query.sort = 'sale_amount'
          } else if (order === 'descending') {
            this.query.sort = '-sale_amount'
          } else {
            this.query.sort = ''
          }
          break;
      }
      this.statisticalSumGroupBuyCaptain()
    },

    listExport() {
      let queryStrGroup = Config.api.statisticalSumGroupBuyHeadExport;
      let queryStrNoGroup = Config.api.statisticalSumGroupBuyHeadExportNoGroup;
      /*
      *   page: 1,
        page_size: 20,
        begin_date: '',
        end_date: '',
        province_code: '',
        city_code: '',
        sort: '',
        condition: '',
        is_group: 1*/

      let {condition, sort, is_group, begin_date, end_date, city_code } = this.query;
      let query = {
        condition,
        sort,
        is_group,
        begin_date,
        end_date,
        city_code
      };

      let queryStr = is_group === 1 ? queryStrGroup : queryStrNoGroup

      queryStr += `?province_code=${this.province.code}`;
      for (let item in query) {
        queryStr += `&${item}=${query[item]}`
      }
      window.open(queryStr);
    },

    loadListDataFirstPage() {
      this.query.page = 1;
      this.statisticalSumGroupBuyCaptain();
    },

    async statisticalSumGroupBuyCaptain(){
      let that = this;
      let { query } = that;
      that.loading({isShow: true, isWhole: true});
      let res = query.is_group === 1 ? await Statistic.statisticalSumGroupBuyCaptain(query) : await Statistic.statisticalSumGroupBuyCaptainNoGroup(query);
      if(res.code === 0){
        res.data.items.map((item, index) => item.id = index);
        that.$data.dataItem = res.data;
      }else{
        that.message({title: '提示', message: res.message, type: 'error'});
      }
      that.loading({isShow: false });
    },

    ...mapActions(['message', 'loading'])
  }
}
</script>

<style scoped>

</style>
