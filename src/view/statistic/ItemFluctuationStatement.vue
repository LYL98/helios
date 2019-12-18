<!--
  业务波动表
-->
<template>
    <div>
      <query-item-fluctuation-analysis
        v-model="query"
        @change="changeQuery"
        :reset="resetQuery"
        @expandChange="onExpandChange"/>
      <!--<p style="margin-top: 30px; font-size: 18px;">-->
        <!--商品<span style="color: blue;">{{indexOptions[selectIndex].label}}</span>波动分析-->
      <!--</p>-->
      <div class="statistics-table-list-container" style="position: relative;">
        <div style="height: 0">
          <el-select style="position: absolute; top: 8px; left: 20px; width: 110px; z-index: 100" size="small" v-model="selectArea" @change="onSelectArea">
            <el-option label="编号/商品" value="item"></el-option>
            <!--<el-option label="展示分类" value="class"></el-option>-->
          </el-select>
        </div>
        <el-table :data="dataItem.items"
                  :height="viewWindowHeight - offsetHeight"
                  :row-class-name="highlightRowClassName"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  style="width: 100%;margin-top: 5px">
          <el-table-column
            fixed="left"
            :min-width="maxLabelWidth < 120 ? 120 : maxLabelWidth"
            prop="city_title">
            <template slot-scope="scope">
              <span>
                {{ scope.row.m_title ? scope.row.m_title : selectArea === 'item'
                  ? formatString(scope.row.item_code) + '/' + formatString(scope.row.item_title)
                  : formatString(scope.row.system_class_title)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            align="left"
            v-for="(d, index) in dateRange()"
            :key="d"
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
          <el-table-column
            label="操作"
            fixed="right"
            prop="operation">
            <template slot-scope="scope">
              <a href="javascript:void(0)"
                 @click="showFluctuationChart(scope.row, dataItem.averages)">查看波动</a>
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

      <my-item-fluctuation-chart :data="chartData" :callback="cancelFluctuationChart"></my-item-fluctuation-chart>
    </div>
</template>

<script>
import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, RadioGroup, Radio, Message } from 'element-ui';
import { Http, Config, DataHandle, Constant } from '@/util';
import ItemFluctuationChart from "./ItemFluctuationChart";
import { QueryItemFluctuationAnalysis } from '@/container'
import viewMixin from '@/view/view.mixin';

export default {
  name: "ItemFluctuationStatement",
  mixins: [viewMixin],
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'my-item-fluctuation-chart': ItemFluctuationChart,
    'query-item-fluctuation-analysis': QueryItemFluctuationAnalysis
  },
  data() {
    return {
      dateList: [],
      dataItem: {},
      selectArea: 'item',
      selectIndex: 0,
      maxLabelWidth: 120,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,  //242
      averagesItem: {},
      totalsItem: {},
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        system_class_code: '',
        begin_date: '',
        end_date: '',
        item_condition: '',
        selectIndex: 0
      },
      indexOptions: [{
        value: 0,
        label: '采购价'    //平均值无意义
      }, {
        value: 1,
        label: '销售价'     //平均值无意义
      }, {
        value: 2,
        label: '销售量'
      }, {
        value: 3,
        label: '销售金额'
      }, {
        value: 4,
        label: '下单客户数'
      }, {
        value: 5,
        label: '下单率'
      }, {
        value: 6,
        label: '加价率'
      }, {
        value: 7,
        label: '退赔率'
      }, {
        value: 8,
        label: '采购价格偏差'    //平均值无意义
      }],
      chartData: {},
      currentRow: {}
    }
  },
  created() {
    this.loadItemTrendAnalysisListFirstPage()
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
      if (row.m_title || row.m_title === '合计' || row.m_title === '平均值') {
        //平均值 、 合计值高亮
        return 'highlight-row';
      } else if (rowIndex % 2 === 0) {
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
    //返回价格
    returnPrice(price){
      return price || price === 0 ? '¥' + DataHandle.returnPrice(price) : '-';
    },
    formatValue(value) {
      return value || value === 0 ? Math.round(value) : '-'
    },
    formatString(value) {
      return value ? value : '-'
    },
    formatRate(value) {
      return value || value === 0 ? DataHandle.keepTwoDecimal(this.returnMarkup(value)) + '%' : '-'
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    dateRange(format) {
      let { query } = this;
      if (query.begin_date && query.end_date) {
        let begin = new Date(Date.parse(query.begin_date));
        let end = new Date(Date.parse(query.end_date));
        let dateList = [];
        let tmpDate = new Date(begin.setDate(begin.getDate() - 1));
        while (tmpDate < end) {
          tmpDate = new Date(begin.setDate(tmpDate.getDate() + 1));
          if (format === 'f1') {
            dateList.push(DataHandle.formatDate(tmpDate, 'yyyy-MM-dd'))
          } else if (format === 'f2') {
            dateList.push(this.labelDate(tmpDate, 'yyyy-MM-dd'))
          } else {
            dateList.push(tmpDate);
          }

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
    showFluctuationChart(rowData, colData) {
      this.$data.chartData = {
        isShow: true,
        selectIndex: this.selectIndex,
        rowData: rowData,
        colData: colData
      };
    },
    cancelFluctuationChart() {
      this.$data.chartData = {isShow: false};
    },
    //返回每个单元格的值
    cellValue(rowItems, date) {
      let that = this;
      let { selectIndex } = this;
      let cellItem;
      let dateStr = DataHandle.formatDate(date, 'yyyy-MM-dd');
      rowItems.map(function (rowItem) {
        if (rowItem.opt_date === dateStr) {
          cellItem = rowItem;
        }
      });
      let result = 0;
      if (cellItem) {
        switch (selectIndex) {
          case 0:
            result = that.returnPrice(cellItem.price_buy);
            break;
          case 1:
            result = that.returnPrice(cellItem.price_sale);
            break;
          case 2:
            result = that.formatValue(cellItem.count_real);
            break;
          case 3:
            result = that.returnPrice(cellItem.amount_real);
            break;
          case 4:
            result = that.formatValue(cellItem.store_num_ord);
            break;
          case 5:
            result = that.formatRate(cellItem.lower_rate);
            break;
          case 6:
            result = that.formatRate(cellItem.markup_rate);
            break;
          case 7:
            result = that.formatRate(cellItem.return_rate);
            break;
          case 8:
            result = that.formatRate(cellItem.deviation_rate);
            break;
          default:
            break;
        }
      }
      return result;
    },
    total(rowItems) {
      let that = this;
      let { selectIndex } = this;
      let sum = 0;
      for (let i = 0; i < rowItems.length; i ++) {
        let cellItem = rowItems[i];
        let result = 0;
        if (cellItem) {
          switch (selectIndex) {
            case 0:
              result = cellItem.price_buy;
              break;
            case 1:
              result = cellItem.price_sale;
              break;
            case 2:
              result = cellItem.count_real;
              break;
            case 3:
              result = cellItem.amount_real;
              break;
            case 4:
              result = cellItem.store_num_ord;
              break;
            case 5:
              result = cellItem.lower_rate;
              break;
            case 6:
              result = cellItem.markup_rate;
              break;
            case 7:
              result = cellItem.return_rate;
              break;
            case 8:
              result = cellItem.deviation_rate;
              break;
            default:
              break;
          }
        }
        sum += Number(result)
      }
      switch (selectIndex) {
        case 0:
        case 1:
        case 3:
          return that.returnPrice(sum);
        case 2:
        case 4:
          return that.formatValue(sum);
        case 5:
        case 6:
        case 7:
        case 8:
          return that.formatRate(sum);
        default:
          return '-';
      }
    },
    average(rowItems) {
      let that = this;
      let { selectIndex } = this;
      let sum = 0;
      let length = rowItems.length;
      for (let i = 0; i < length; i ++) {
        let cellItem = rowItems[i];
        let result = 0;
        if (cellItem) {
          switch (selectIndex) {
            case 0:
              result = cellItem.price_buy;
              break;
            case 1:
              result = cellItem.price_sale;
              break;
            case 2:
              result = cellItem.count_real;
              break;
            case 3:
              result = cellItem.amount_real;
              break;
            case 4:
              result = cellItem.store_num_ord;
              break;
            case 5:
              result = cellItem.lower_rate;
              break;
            case 6:
              result = cellItem.markup_rate;
              break;
            case 7:
              result = cellItem.return_rate;
              break;
            case 8:
              result = cellItem.deviation_rate;
              break;
            default:
              break;
          }
        }
        sum += Number(result)
      }
      switch (selectIndex) {
        case 0:
        case 1:
        case 3:
          return that.returnPrice(sum / length);
        case 2:
        case 4:
          return that.formatValue(sum / length);
        case 5:
        case 6:
        case 7:
        case 8:
          return that.formatRate(sum / length);
        default:
          return '-';
      }
    },
    changeIndex(index) {
      this.selectIndex = index;

      let title0 = this.$data.dataItem.items[0].m_title;
      let title1 = this.$data.dataItem.items[1].m_title;

      if (index === 0 || index === 1 || index === 8) {
        //没有平均值也没有合计值
        if (title0 === '平均值' || title0 === '合计') {
          this.$data.dataItem.items.shift();
        }
        if (title1 === '平均值' || title1 === '合计') {
          this.$data.dataItem.items.shift();
        }
      } else if (index === 2 || index === 3 || index === 4) {
        //既有平均值也有合计值
        if (title0 !== '平均值' && title0 !== '合计') {
          this.$data.dataItem.items.unshift(this.$data.averagesItem);
          this.$data.dataItem.items.unshift(this.$data.totalsItem);
        } else if (title0 === '平均值')  {
          this.$data.dataItem.items.unshift(this.$data.totalsItem);
        }
      } else {
        //没有合计值，只有平均值
        if (title0 === '合计') {
          this.$data.dataItem.items.shift();
        } else if (title0 !== '平均值' && title0 !== '合计') {
          this.$data.dataItem.items.unshift(this.$data.averagesItem);
        }
      }


    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadItemTrendAnalysisListFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadItemTrendAnalysisList();
    },
    changeQuery() {
      this.selectIndex = this.query.selectIndex;
      this.loadItemTrendAnalysisListFirstPage()
    },
    //商品 / 采购员 / 展示分类选择
    onSelectArea() {
      this.loadItemTrendAnalysisListFirstPage();
    },
    resetQuery() {
      this.$data.selectIndex = 0;
    },
    loadItemTrendAnalysisListFirstPage() {
      this.query.page = 1;
      this.loadItemTrendAnalysisList();
    },
    loadItemTrendAnalysisList() {
      this.itemTrendAnalysis().catch(e => this.$message({title: '提示', message: e, type: 'error'}));
    },
    async itemTrendAnalysis(){
      let that = this;
      let { query, selectArea } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = selectArea === 'item' ? await Http.get(Config.api.statisticalItemTrendAnalysis, query) :
                                        await Http.get(Config.api.statisticalItemTrendAnalysisClass, query);
      if(res.code === 0){
        if (res.data.items && res.data.items.length > 0) {
          //插入平均值
          let averages = res.data.averages;
          averages.map(average => {
            average.count_real = DataHandle.returnAverage(average.count_real);
            average.store_num_ord = DataHandle.returnAverage(average.store_num_ord);
          });
          let averagesItem = {
            m_title: '平均值',
            items: averages
          };
          that.averagesItem = averagesItem;
          if (this.selectIndex !== 0 && this.selectIndex !== 1 && this.selectIndex !== 8) {
            res.data.items.unshift(averagesItem);
          }

          //插入合计值
          let totals = res.data.totals;
          totals.map(total => {
            total.count_real = DataHandle.returnAverage(total.count_real);
            total.store_num_ord = DataHandle.returnAverage(total.store_num_ord);
          });
          let totalsItem = {
            m_title: '合计',
            items: totals
          };
          that.totalsItem = totalsItem;
          if (this.selectIndex === 2 && this.selectIndex === 3 && this.selectIndex === 4) {
            res.data.items.unshift(totalsItem);
          }
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
