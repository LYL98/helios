<template>
  <sub-menu>
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
        :row-class-name="highlightRowClassName"
        @sort-change="onSort"
        style="width: 100%; margin-top: 20px">
        <el-table-column align="center" type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>

        <el-table-column
          :min-width="maxLabelWidth < 160 ? 160 : maxLabelWidth"
          prop="nickname"
          label="微信昵称">
          <template slot-scope="scope">
            <div id="titleScope" class="td-item">{{ formatValue(scope.row.nickname) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkman"
          label="团员姓名"
          align="left"
          min-width="160">
          <template slot-scope="scope">
            <div class="td-item">{{ formatValue(scope.row.linkman) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          label="商品数量"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">{{ formatValue(scope.row.sale_num) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          label="购买件数"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">
              <span>{{formatValue(scope.row.sale_num)}}</span>
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
          prop="pay_amount"
          label="消费金额"
          sortable="custom"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div class="td-item">{{returnPrice(scope.row.pay_amount)}}</div>
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
  import QueryGroupBuyMemberStatistics from './QueryGroupBuyMemberStatistics';
  import { DataHandle, Config, Http, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: "GroupBuyMemberStatement",
  mixins: [mainMixin],
  data() {
    return {
      dataItem: {
        items: [],
        num: 0
      },
      maxLabelWidth: 160,
      /*condition: 微信昵称或收货人姓名
        sort: 排序字段指定 商品数量(sale_num)/购买件数(sale_num)/消费金额(pay_amount)
        page:
        page_size:*/
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        sort: '',
        condition: '',
      }
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
    'query-group-buy-member-statistics': QueryGroupBuyMemberStatistics
  },
  created() {
  },
  methods: {
    indexMethod(index) {
      return (this.query.page - 1) * this.query.page_size + index + 1;
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
      if (order === 'ascending') {
        this.query.sort = prop;
      } else if (order === 'descending') {
        this.query.sort = '-' + prop
      } else {
        this.query.sort = ''
      }
      this.statisticalSumGroupBuyMember()
    },

    async listExport() {
      let api = Config.api.statisticalSumGroupBuyMemberExport;
      /*
        sort: '',
        condition: '',*/

      let {condition, sort} = this.query;
      let query = {
        condition,
        sort
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
      this.statisticalSumGroupBuyMember();
    },

    async statisticalSumGroupBuyMember(){
      let that = this;
      let { query } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.statisticalSumGroupBuyMember, query);
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
