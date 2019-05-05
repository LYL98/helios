<template>
  <div>
    <query-group-buy-member-statistics
    v-model="query"
    @change="changeQuery"
    :reset="resetQuery"/>
    <div v-if="auth.isAdmin || auth.GroupBuyMemberStatementExport" class="operate">
      <el-button
        v-if="auth.isAdmin || auth.GroupBuyMemberStatementExport"
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
          :min-width="maxLabelWidth < 160 ? 160 : maxLabelWidth"
          prop="nickname"
          label="微信昵称">
          <template slot-scope="scope">
            <span id="titleScope" :class="isEllipsis(scope.row)">{{ formatValue(scope.row.nickname) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkman"
          label="团员姓名"
          align="left"
          min-width="160">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.linkman) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num"
          label="参团次数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{ formatValue(scope.row.order_num) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          label="购买件数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              <span>{{formatValue(scope.row.sale_num)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_amount"
          label="消费金额"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.pay_amount)}}</span>
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
  import { QueryGroupBuyMemberStatistics } from '@/container'
  // import { SelectBuyer, SelectDisplayClass, SearchItem } from '@/common';
  import Constant from "@/util/constant";
  import { Statistic } from '@/service';
  import { DataHandle, Config } from '@/util';
  import { mapGetters, mapActions } from 'vuex';

export default {
  name: "GroupBuyMemberStatement",
  data() {
    return {
      dataItem: {
        items: [],
        num: 0
      },
      maxLabelWidth: 160,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
      /*condition: 微信昵称或收货人姓名
        sort: 排序字段指定 参团次数(order_num)/购买件数(sale_num)/消费金额(pay_amount)
        page:
        page_size:*/
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        sort: '',
        condition: '',
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
    'query-group-buy-member-statistics': QueryGroupBuyMemberStatistics
  },
  created() {
    if (!this.auth.isAdmin && !this.auth.GroupBuyMemberStatementExport) {
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
      this.statisticalSumGroupBuyMember();
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
      }
      this.statisticalSumGroupBuyMember()
    },

    listExport() {
      let queryStr = Config.api.statisticalSumGroupBuyMemberExport;
      /*
        sort: '',
        condition: '',*/

      let {condition, sort} = this.query;
      let query = {
        condition,
        sort
      };
      queryStr += `?province_code=${this.province.code}`;
      for (let item in query) {
        queryStr += `&${item}=${query[item]}`
      }
      window.open(queryStr);
    },

    loadListDataFirstPage() {
      this.query.page = 1;
      this.statisticalSumGroupBuyMember();
    },

    async statisticalSumGroupBuyMember(){
      let that = this;
      let { query } = that;
      that.loading({isShow: true, isWhole: true});
      let res = await Statistic.statisticalSumGroupBuyMember(query);
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
        //     : selectArea === 'buyer' ? that.formatString(item.buyer_name) : that.formatString(item.display_class_title)
        // )
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
