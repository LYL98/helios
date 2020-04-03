<!--
  商品每日分析
-->
<template>
  <sub-menu>
    <query-item-daily-analysis
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"/>
    <div class="statistics-table-list-container" style="position: relative;">
      <div style="height: 0">
        <el-select style="position: absolute; top: 8px; left: 20px; width: 110px; z-index: 100" size="small" v-model="selectArea" @change="onSelectArea">
          <el-option label="编号/商品" value="item"></el-option>
          <!--<el-option label="展示分类" value="class"></el-option>-->
        </el-select>
      </div>
      <el-table
        :data="dataItem.items"
        :height="viewWindowHeight - 255"
        :row-class-name="highlightRowClassName"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          :min-width="maxLabelWidth < 120 ? 120 : maxLabelWidth"
          fixed="left">
          <template slot-scope="scope">
            <span id="titleScope">
              {{ scope.row.m_title ? scope.row.m_title : selectArea === 'item'
                  ? formatString(scope.row.item_code) + '/' + formatString(scope.row.item_title): formatString(scope.row.system_class_title)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price_buy"
          label="采购价"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.price_buy)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price_sale"
          label="销售价"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.price_sale)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count_real"
          label="销售量(件)"
          align="left"
          min-width="110">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatValue(scope.row.count_real)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_real"
          label="订单商品金额"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.amount_real)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fram_total_price"
          label="框金额"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{returnPrice(scope.row.fram_total_price)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_num_ord"
          label="下单客户数"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatValue(scope.row.store_num_ord)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_num_reg"
          label="下单率"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatRate(scope.row.lower_rate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_num_ord"
          label="加价率"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatRate(scope.row.markup_rate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num_store"
          label="退赔率"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatRate(scope.row.return_rate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_item_sum"
          label="采购价格偏差"
          align="left"
          min-width="140">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{formatRate(scope.row.deviation_rate)}}</span>
          </template>
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
  </sub-menu>
</template>

<script>
import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
import { Http, Config, DataHandle } from '@/util';
import QueryItemDailyAnalysis from './QueryItemDailyAnalysis';
import Constant from "@/util/constant";
import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: "ItemDailyAnalysisStatement",
  mixins: [mainMixin],
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'query-item-daily-analysis': QueryItemDailyAnalysis
  },
  created() {
    
  },
  data() {
    return {
      dataItem: {},
      selectArea: 'item',
      selectItemName: '',
      maxLabelWidth: 120,
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        opt_date: '',
        system_class_codes: [],
        system_class_code: '',
        item_condition: '',
      },
      currentRow: {}
    }
  },
  methods: {
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
      this.loadItemDailyAnalysisListFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadItemDailyAnalysisList();
    },
    //商品 / 采购员 / 展示分类选择
    onSelectArea() {
      this.loadItemDailyAnalysisListFirstPage();
    },
    changeQuery() {
      this.loadItemDailyAnalysisListFirstPage()
    },
    resetQuery() {
      // this.$data.query = {
      //   page: 1,
      //   page_size: 20,
      //   opt_date: '',
      //   system_class_code: '',
      //   item_condition: '',
      // };
      // this.loadItemDailyAnalysisListFirstPage()
    },
    loadItemDailyAnalysisListFirstPage() {
      this.query.page = 1;
      this.loadItemDailyAnalysisList();
    },
    loadItemDailyAnalysisList() {
      this.itemDailyAnalysisList().catch(e => {console.error(e)})
    },
    async itemDailyAnalysisList(){
      let that = this;
      let { query, selectArea } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = selectArea === 'item' ? await Http.get(Config.api.statisticalItemDailyAnalysis, query) : await Http.get(Config.api.statisticalItemDailyAnalysisClass, query);
      if(res.code === 0){
        //手动增加总计和平均值的行数据
        if (res.data.items && res.data.items.length > 0) {
          let averageObj = res.data.average;
          averageObj.m_title = '平均';
          averageObj.count_real = DataHandle.returnAverage(averageObj.count_real);
          averageObj.store_num_ord = DataHandle.returnAverage(averageObj.store_num_ord);
          res.data.items.unshift(averageObj);
          let totalObj = res.data.total;
          totalObj.m_title = '总计';
          res.data.items.unshift(totalObj);
        }

        res.data.items.map((item, index) => item.id = index);
        that.$data.dataItem = res.data;
        that.maxLabelWidth = DataHandle.computeTableLabelMinWidth(that.$data.dataItem.items,
          item => item.m_title ? item.m_title : selectArea === 'item' ? that.formatString(item.item_code) + '/' + that.formatString(item.item_title)
            : that.formatString(item.system_class_title)
        )
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
