<!--运营统计-->
<template>
  <sub-menu>
    <div class="query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province v-model="query.province_code" type="select" @change="selectProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="时间">
            <el-date-picker
              v-model="currentDateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              style="width: 100%;"
              :picker-options="fixDateOptions"
              :clearable="false"
              @change="onChangeDate">
            </el-date-picker>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="tabValue" :tab-panes="{'图表': 'chart', '表格': 'table'}"/>
        </div>
        <div class="right"></div>
      </div>
    </div>

    <!--图表-->
    <div style="background-color: white;" v-show="tabValue === 'chart'">
      <!--<P style="text-align: center; padding-top: 10px">-->
        <!--<span style="color: blue; font-size: 20px">{{selectItemName ? selectItemName : '-'}}</span>-->
        <!--<span style="font-size: 20px">指标分析</span>-->
      <!--</P>-->
      <div id="main" :style="`padding-top: 20px; height: ${viewWindowHeight - 192}px;`" ref="myIndexChart"></div>
    </div>
    <!--表格-->
    <div v-show="tabValue === 'table'">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName" :height="viewWindowHeight - 176">
        <el-table-column
          label="指标"
          fixed="left"
          width="140px"
          prop="city_title">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <el-tooltip class="item" effect="dark" content="GMV = 订单商品金额 + 运费 + 筐 - 优惠金额" placement="right" v-if="scope.row.name === 'GMV'">
              <span class="span-help-tooltip" style="margin-left: 5px; position: relative; top: -1px;">!</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="left" v-for="(d, index) in dateRange()" :key="index" :label="labelDate(d)">
          <el-tooltip slot-scope="scope" effect="dark" :content="scope.row.hints[index]" placement="top" v-if="false">
            <span>{{ cellValue(scope.row.cells, d) }}</span>
          </el-tooltip>
          <template slot-scope="scope" v-else>{{ cellValue(scope.row.cells, d) }}</template>
        </el-table-column>
        <el-table-column label="平均值" min-width="100" align="left">
          <template slot-scope="scope">{{ average(scope.row.cells, scope.$index) }}</template>
        </el-table-column>
        <el-table-column label="合计" min-width="110" align="left">
          <template slot-scope="scope">{{ total(scope.row.cells, scope.$index) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </sub-menu>
</template>

<script>
  import { DatePicker, Button, Table, Row, Col, TableColumn, Pagination, Select, Option, Input, Message, Tooltip } from 'element-ui';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import { QueryItem } from '@/common';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  import echarts from "echarts/lib/echarts";
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/toolbox';
  import 'echarts/lib/component/legend';

  export default {
    name: "OperationStatistics",
    mixins: [mainMixin],
    components: {
      'el-button': Button,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-row': Row,
      'el-col': Col,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-select': Select,
      'el-option': Option,
      'el-input': Input,
      'my-query-item': QueryItem,
      'el-tooltip': Tooltip,
      'global-province': GlobalProvince,
      'query-tabs': queryTabs
    },
    created() {
      documentTitle("统计 - 运营统计");

      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));
      this.currentDateRange.push(DataHandle.formatDate(beginDate, 'yyyy-MM-dd'));
      this.currentDateRange.push(endDateStr);
    },
    data() {
      return {
        tabValue: 'chart',
        offsetHeight: Constant.OFFSET_QUERY_CLOSE + 40,
        currentDateRange: [],
        beforeDateRange: [],
        dataItem: [],
        selectArea: 'zone',
        selectItemName: '',
        lineColors: [
          '#D27575',   //1
          '#E2BA6F',   //2
          '#E8E676',   //3
          '#C5E26F',   //4
          '#9AD782',   //5
          '#82D7AE',   //6
          '#82D7D7',   //7
          '#82A1D7',   //8
          '#8E82D7',   //9
          '#C682D7',   //10
          '#E58FBC',   //11
        ],
        /**
         * 
         * */
        indexNames: [
          'GMV',
          '订单商品金额',
          '下单门店数',
          '下单件数',
          '下单商品数'
        ],
        query: {
          province_code: '',
          item_id: '',
          begin_date: '',
          end_date: '',
        },
        /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE
      }
    },
    watch: {
      currentDateRange: function (a, b) {
        this.beforeDateRange = b;
      }
    },
    methods: {
      //查询选择区域后【初始化】
      selectProvince(){
        this.loadOperationStatistics(() => {
          this.initChart()
        });
      },

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'stripe-row'
        }
        return '';
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
      formatValue(value) {
        return value || value === 0 ? Math.round(value) : '-'
      },
      formatRate(value) {
        return value || value === 0 ? DataHandle.keepTwoDecimal(this.returnMarkup(value)) + '%' : '-'
      },
      //返回加价率
      returnMarkup(markup){
        return DataHandle.returnMarkup(markup);
      },

      onChangeDate() {
        this.loadOperationStatistics(() => {
          this.initChart()
        })
      },
      /**
       * 用户选择的时间范围
       * @param format 返回的日期格式：f1: yyyy-MM-dd, f2: MM-dd
       * @returns {*}
       */
      dateRange(format) {
        let { currentDateRange } = this;
        if (currentDateRange && currentDateRange.length === 2) {
          let begin = new Date(Date.parse(currentDateRange[0]));
          let end = new Date(Date.parse(currentDateRange[1]));
          let dateList = Array();
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
          }
          return dateList;
        } else {
          return this.defaultDateRange(format);
        }
      },
      defaultDateRange(format) {
        return Array()
      },
      labelDate(date) {
        return DataHandle.formatDateLabel(date)
      },
      initChart() {
        let that = this;
        if (!that.$refs.myIndexChart) {
          return
        }

        let { lineColors, indexNames } = this;

        //与接口数据比较的日期：例如 2018-1-1
        let xDates = this.dateRange('f1');
        //x轴日期：例如 1月1日
        let xDisplayDates = this.dateRange('f2');

        let option = {
          tooltip : {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
              var res = params[0].name;
              res += '<br/>' + params[0].seriesName + ' : ' + params[0].value;
              /*for (var i = 0, l = params.length; i < l; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
              }*/
              return res
            }
          },
          calculable : true,
          legend: {
            data: indexNames,
            selectedMode: 'single',
            selected: {
              'GMV': true,
              '订单商品金额': false,
              '下单门店数': false,
              '下单件数': false,
              '下单商品数': false,
            },
          },
          xAxis : [
            {
              type : 'category',
              data : xDisplayDates
            }
          ],
          yAxis : [
            {
              type : 'value',
              name : '参考值',
              axisLabel : {
                formatter: '{value}'
              }
            },
          ],
          series : [
            //GMV
            {
              name:'GMV',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data:this.lineData(0, xDates)
            },

            //订单商品金额
            {
              name:'订单商品金额',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data:this.lineData(1, xDates)
            },
            //下单门店数
            {
              name:'下单门店数',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data:this.lineData(2, xDates)
            },
            {
              name:'下单件数',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data:this.lineData(3, xDates)
            },
            {
              name:'下单商品数',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data:this.lineData(4, xDates)
            },
          ]
        };

        echarts.init(that.$refs.myIndexChart).setOption(option)
      },
      /**
       * 每个指标的数据
       * @param index 指标序号
       * @param xDates x轴的日期，用来做比对
       * @returns {any[]}
       */
      lineData(index, xDates) {
        let { dataItem } = this;
        let lineData = Array();
        if (dataItem && dataItem.length > 0) {
          //得到特定指标的行数据
          let item = dataItem[index];

          for (let i = 0; i < xDates.length; i++) {
            //得到当前列的日期
            let colDate = xDates[i];
            let hasDate = false;
            for (let i = 0; i < item.cells.length; i++) {
              let cellDate = item.cells[i].date;
              let cellValue = item.cells[i].origin_value;

              //如果单元格日期等于当前日期，说明当前日期对应的单元格存在
              if (cellDate === colDate) {
                hasDate = true;
                //放大相应的比例，方便数据比对
                lineData.push(Number(this.handleIndexValue(index, cellValue)));
                break;
              }
            }
            //如果当前列的日期无法匹配所有列单元格的日期，说明当前日期对应的单元格不存在，赋默认值0
            if (!hasDate) {
              lineData.push(0)
            }
          }
        }
        return lineData;
      },

      //根据特定的指标来处理对应的值
      handleIndexValue(index, value) {
        switch (index) {
          case 0:
          case 1:
            return DataHandle.returnPrice(value);
          case 2:
          case 3:
          case 4:
            return value;
          default:
            return 0;
        }
      },
      //根据特定的指标来处理对应的值
      handleIndexValueToDisplay(index, value) {
        switch (index) {
          case 0:
          case 1:
            return this.returnPrice(value);
          case 2:
          case 3:
          case 4:
            return this.formatValue(value);
          default:
            return 0;
        }
      },

      /**
       * - item_cat_num: 下单商品种类数量
          - item_num: 下单商品件数
          - amount_real: 商品金额
          - bonus_promotion: 优惠减免
          - real_price：应付金额
          - amount_delivery: 运费
          - order_num: 订单数量
          - store_num: 下单门店数
          - total_delivery_item_price: 发货金额
          - price_per_order: 平均每单发货金额
          - gmv:
          客单价：gmv / store_num
       */

      cellDisplayValue(index, cellItem) {
        let that = this;
        let result = '-';
        switch (index) {
          case 0:
            result = that.returnPrice(cellItem.gmv);
            break;
          case 1:
            result = that.returnPrice(cellItem.amount_real);
            break;
          case 2:
            result = that.formatValue(cellItem.store_num);
            break;
          case 3:
            result = that.formatValue(cellItem.item_num);
            break;
          case 4:
            result = that.formatValue(cellItem.item_cat_num);
            break;
          default:
            break;
        }
        return result
      },

      cellOriginValue(index, cellItem) {
        let result = '-';
        switch (index) {
          case 0:
            result = cellItem.gmv;
            break;
          case 1:
            result = cellItem.amount_real;
            break;
          case 2:
            result = cellItem.store_num;
            break;
          case 3:
            result = cellItem.item_num;
            break;
          case 4:
            result = cellItem.item_cat_num
            break;
          default:
            break;
        }
        return result
      },

      cellValue(rowItems, date) {
        let cellItem;
        let dateStr = DataHandle.formatDate(date, 'yyyy-MM-dd');
        rowItems.map(function (rowItem) {
          if (rowItem.date === dateStr) {
            cellItem = rowItem;
          }
        });
        return cellItem ? cellItem.value : '-'
      },
      total(rowItems, index) {
        let that = this;
        let sum = 0;
        for (let i = 0; i < rowItems.length; i ++) {
          let cellItem = rowItems[i];
          sum += Number(cellItem.origin_value)
        }
        return that.handleIndexValueToDisplay(index, sum);
      },
      average(rowItems, index) {
        let that = this;
        let sum = 0;
        for (let i = 0; i < rowItems.length; i ++) {
          let cellItem = rowItems[i];
          sum += Number(cellItem.origin_value)
        }
        return that.handleIndexValueToDisplay(index, sum / rowItems.length);
      },

      loadOperationStatistics(callback) {
        let { currentDateRange } = this;

        if (currentDateRange && currentDateRange.length === 2) {
          this.query.begin_date = currentDateRange[0];
          this.query.end_date = currentDateRange[1];
          //判断时间段是否超过31天
          let beginDate = Date.parse(currentDateRange[0]);
          let endDate = Date.parse(currentDateRange[1]);
          let interval = endDate - beginDate;
          if (interval >= 31*24*60*60*1000) {
            //时间超过31天
            Message({
              showClose: true,
              message: '日期间隔必须小于31天',
              type: 'error'
            });
            this.currentDateRange = this.beforeDateRange;
            return
          }
        } else {
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.statisticalSumBusinessDelivery(callback).catch(e => console.error(e))
      },

      async statisticalSumBusinessDelivery(callback) {
        let that = this;
        let { query, indexNames } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalSumBusinessDelivery, query);
        if(res.code === 0){
          //将日期维度转化成指标维度
          let dateItems = res.data;
          let indexItems = Array();
          if (dateItems && dateItems.length > 0) {
            for (let i = 0; i < indexNames.length; i++) {
              //初始化行变量
              let indexItem = {
                name: indexNames[i],
                cells: Array(),
                hints: Array(),
              };

              //计算列
              for (let j = 0; j < dateItems.length; j++) {
                let item = dateItems[j];
                //初始化一行中每列单元格
                let cell = {
                  date: item.date,
                  //用index区分赋值
                  value: this.cellDisplayValue(i, item),
                  origin_value: this.cellOriginValue(i, item),
                  type: i,
                };
                if(i === 0){
                  indexItem.hints.push(`订单商品金额：${this.returnPrice(item.amount_real)}  运费：${this.returnPrice(item.amount_delivery)}`);//gmv提示
                }
                indexItem.cells.push(cell);
              }

              indexItems.push(indexItem)
            }
          }
          // console.log(indexItems);
          indexItems.map((item, index) => {
            item.id = index;
          });
          that.$data.dataItem = indexItems;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
