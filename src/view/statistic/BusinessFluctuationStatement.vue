<!--
  业务波动表
-->
<template>
    <sub-menu>
      <query-business-fluctuation
        v-model="query"
        @change="changeQuery"
        :reset="resetQuery"/>
      <div style="height: 0">
        <el-select style=" width: 80px; position: relative; top: 8px;left: 25px;z-index: 100;" v-model="selectArea"
                   size="small" @change="loadOrderTrendCityFirstPage">
          <el-option label="区域" value="zone"></el-option>
          <el-option label="县域" value="city"></el-option>
        </el-select>
      </div>
      <div class="statistics-table-list-container">
        <el-table :data="dataItem.items"
                  :height="viewWindowHeight - 255"
                  :row-class-name="highlightRowClassName"
                  style="width: 100%">
          <!--  :label="selectArea === 'zone' ? '区域' : '县域'"-->
          <el-table-column
            class="custom-table-row"
            fixed="left"
            :min-width="maxLabelWidth"
            prop="city_title">
            <template slot-scope="scope">
              <span>{{formatValue(selectArea === 'zone' ? scope.row.zone_title : scope.row.city_title)}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" align="left" v-for="(d, index) in dateRange()" :key="index" :label="labelDate(d)">
            <template slot-scope="scope">
              <span>{{ cellValue(scope.row.items, d) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="平均值" min-width="100" align="left">
            <template slot-scope="scope">
              <span>{{ average(scope.row.items) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合计" min-width="120" align="left" v-if="selectType !== 'customer'">
            <template slot-scope="scope">
              <span>{{ total(scope.row.items) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            prop="operation">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="showFluctuationChart(scope.row, dataItem.averages, dataItem.total)">查看波动</a>
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


      <my-business-fluctuation-chart :data="chartData" :callback="cancelFluctuationChart"></my-business-fluctuation-chart>
    </sub-menu>
</template>

<script>
import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, RadioGroup, Radio, Message } from 'element-ui';
import { SelectZone } from '@/common';
import { Http, Config, DataHandle, Constant } from '@/util';
import BusinessFluctuationChart from "./BusinessFluctuationChart";
import QueryBusinessFluctuation from './QueryBusinessFluctuation';
import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: "BusinessFluctuationStatement",
  mixins: [mainMixin],
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
    'my-select-zone': SelectZone,
    'my-business-fluctuation-chart': BusinessFluctuationChart,
    'query-business-fluctuation': QueryBusinessFluctuation
  },
  data() {
    return {
      province: this.$province,
      dataItem: {
        items: [],
        num: 0
      },
      selectArea: 'zone',
      selectType: 'merchant',
      maxLabelWidth: 80,
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        zone_id: '',
        city_id: '',
        begin_date: '',
        end_date: '',
        selectType: 'merchant'
      },
      chartData: {}
    }
  },

  created() {
    // this.loadOrderTrendCityFirstPage()
  },
  methods: {
    highlightRowClassName({row, rowIndex}) {
      if (rowIndex === 0 || rowIndex === 1) {
        //总计、平均值
        return 'highlight-row';
      } else if (rowIndex % 2 === 1) {
        return 'stripe-row'
      }
      return '';
    },
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    formatValue(value) {
      return value || value === 0 ? value : '-'
    },
    //用户选择的时间范围
    dateRange(format) {
      let { query } = this;
      if (query.begin_date && query.end_date) {
        let begin = new Date(Date.parse(query.begin_date));
        let end = new Date(Date.parse(query.end_date));
        let dateList = Array();
        let tmpDate = new Date(begin.setDate(begin.getDate() - 1));
        // while (tmpDate < end) {
        //   tmpDate = new Date(begin.setDate(tmpDate.getDate() + 1));
        //   dateList.push(tmpDate);
        // }
        while (tmpDate < end) {
          tmpDate = new Date(begin.setDate(tmpDate.getDate() + 1));
          if (format === 'f1') {
            dateList.push(DataHandle.formatDate(tmpDate, 'yyyy-MM-dd'))
          } else if (format === 'f2') {
            dateList.push(this.labelDate(tmpDate, 'yyyy-MM-dd'))
          } else {
            dateList.push(tmpDate);
          }
        }
        return dateList;
      } else {
        return this.defaultDateRange(format);
      }
    },
    //默认的时间范围
    defaultDateRange(format) {
      // let today = new Date();
      // let yesterdayDate = new Date(today.setDate(today.getDate() - 1));
      // let yesterday;
      // if (format === 'f1') {
      //   yesterday = DataHandle.formatDate(yesterdayDate, 'yyyy-MM-dd');
      // } else if (format === 'f2') {
      //   yesterday = this.labelDate(yesterdayDate, 'yyyy-MM-dd');
      // } else {
      //   yesterday = yesterdayDate;
      // }
      return Array()
    },
    //格式化表格标题时间
    labelDate(date) {
      return DataHandle.formatDateLabel(date)
    },
    //显示波动图对话框
    showFluctuationChart(rowData, average, total) {
      this.$data.chartData = {
        isShow: true,
        selectType: this.$data.selectType,
        selectArea: this.$data.selectArea,
        rowData: rowData,
        averageColData: average,
        totalColData: total,
        dateRange: this.dateRange('f1')
      };
    },
    //关闭波动图对话框
    cancelFluctuationChart() {
      this.$data.chartData = {isShow: false};
    },
    //计算每个单元格的值
    cellValue(rowItems, date) {
      let that = this;
      let { selectType } = this;
      let cellItem;
      let dateStr = DataHandle.formatDate(date, 'yyyy-MM-dd');
      rowItems.map(function (rowItem) {
        if (rowItem.opt_date === dateStr) {
          cellItem = rowItem;
        }
      });
      let result = '-';
      if (cellItem) {
        switch (selectType) {
          case 'merchant':
            result = cellItem.store_num_ord || cellItem.store_num_ord === 0 ? cellItem.store_num_ord : '-';
            break;
          case 'gmv':
            result = cellItem.gmv || cellItem.gmv === 0 ? '¥' + that.returnPrice(cellItem.gmv) : '-';
            break;
          case 'amount_delivery':
            result = cellItem.amount_delivery || cellItem.amount_delivery === 0 ? '¥' + that.returnPrice(cellItem.amount_delivery) : '-';
            break;
          case 'bonus_promotion':
            result = cellItem.bonus_promotion || cellItem.bonus_promotion === 0 ? '¥' + that.returnPrice(cellItem.bonus_promotion) : '-';
            break;
          case 'check_chg':
            result = cellItem.check_chg || cellItem.check_chg === 0 ? '¥' + that.returnPrice(cellItem.check_chg) : '-';
            break;
          case 'real_price':
            result = cellItem.real_price || cellItem.real_price === 0 ? '¥' + that.returnPrice(cellItem.real_price) : '-';
            break;
          case 'customer':
            result = cellItem.cust_price || cellItem.cust_price === 0 ? '¥' + that.returnPrice(cellItem.cust_price) : '-';
            break;
          default:
            break;
        }
      }
      return result
    },
    total(rowItems) {
      let that = this;
      let { selectType } = this;
      let sum = 0;
      for (let i = 0;  i < rowItems.length; i++) {
        let cellItem = rowItems[i];
        let result = 0;
        if (cellItem) {
          switch (selectType) {
            case 'merchant':
              result = cellItem.store_num_ord ? cellItem.store_num_ord : 0;
              break;
            case 'gmv':
              result = cellItem.gmv ? cellItem.gmv : 0;
              break;
            case 'amount_delivery':
              result = cellItem.amount_delivery ? cellItem.amount_delivery : 0;
              break;
            case 'bonus_promotion':
              result = cellItem.bonus_promotion ? cellItem.bonus_promotion : 0;
              break;
            case 'check_chg':
              result = cellItem.check_chg ? cellItem.check_chg : 0;
              break;
            case 'real_price':
              result = cellItem.real_price ? cellItem.real_price : 0;
              break;
            case 'customer':
              result = cellItem.cust_price ? cellItem.cust_price : 0;
              break;
            default:
              break;
          }
        }
        sum += Number(result);
      }
      switch (selectType) {
        case 'merchant':
          return sum || sum === 0 ? DataHandle.formatCount(sum) : '-';
        case 'gmv':
        case 'amount_delivery':
        case 'bonus_promotion':
        case 'check_chg':
        case 'real_price':
        case 'customer':
          if(sum || sum === 0){
            if(sum < 0){
              return '-¥' + that.returnPrice(Math.abs(sum));
            }else{
              return '¥' + that.returnPrice(sum);
            }
          }else{
            return '-';
          }
        default:
          return '-';
      }
    },
    average(rowItems) {
      let that = this;
      let { selectType } = this;
      let sum = 0;
      for (let i = 0;  i < rowItems.length; i++) {
        let cellItem = rowItems[i];
        let result = 0;
        if (cellItem) {
          switch (selectType) {
            case 'merchant':
              result = cellItem.store_num_ord ? cellItem.store_num_ord : 0;
              break;
            case 'gmv':
              result = cellItem.gmv ? cellItem.gmv : 0;
              break;
            case 'amount_delivery':
              result = cellItem.amount_delivery ? cellItem.amount_delivery : 0;
              break;
            case 'bonus_promotion':
              result = cellItem.bonus_promotion ? cellItem.bonus_promotion : 0;
              break;
            case 'check_chg':
              result = cellItem.check_chg ? cellItem.check_chg : 0;
              break;
            case 'real_price':
              result = cellItem.real_price ? cellItem.real_price : 0;
              break;
            case 'customer':
              result = cellItem.cust_price ? cellItem.cust_price : 0;
              break;
            default:
              break;
          }
        }
        sum += Number(result);
      }
      switch (selectType) {
        case 'merchant':
          return sum || sum === 0 ? DataHandle.formatCount(sum / rowItems.length) : '-';
        case 'gmv':
        case 'amount_delivery':
        case 'bonus_promotion':
        case 'check_chg':
        case 'real_price':
        case 'customer':
          if(sum || sum === 0){
            if(sum < 0){
              return '-¥' + that.returnPrice(Math.abs(sum / rowItems.length));
            }else{
              return '¥' + that.returnPrice(sum / rowItems.length);
            }
          }else{
            return '-';
          }
        default:
          return '-';
      }
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadOrderTrendCityFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadOrderTrendCity();
    },
    changeQuery() {
      // console.log()
      this.selectType = this.query.selectType;
      this.loadOrderTrendCityFirstPage()
    },
    resetQuery() {
    },
    loadOrderTrendCityFirstPage() {
      this.query.page = 1;
      this.loadOrderTrendCity();
    },
    loadOrderTrendCity() {
      this.orderTrendCity().catch(e => {});
    },
    async orderTrendCity(){
      let that = this;
      let { query, selectArea } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = selectArea === 'zone' ?
        await Http.get(Config.api.statisticalOrderTrendZone, query):
        await Http.get(Config.api.statisticalOrderTrendCity, query);
      if(res.code === 0){
        if (res.data.items && res.data.items.length > 0) {
          let averages = res.data.averages;
          res.data.items.unshift({
            city_title: '平均值',
            zone_title: '平均值',
            items: averages
          });
          if (that.selectType !== 'customer') {
            let total = res.data.total;
            res.data.items.unshift({
              city_title: '总计',
              zone_title: '总计',
              items: total
            });
          }
        }

        res.data.items.map((item, index) => item.id = index);

        that.$data.dataItem = res.data;
        that.maxLabelWidth = DataHandle.computeTableLabelMinWidth(that.$data.dataItem.items,
          item => selectArea === 'zone' ? item.zone_title : item.city_title)
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
  }
}
</script>

<style>

</style>
