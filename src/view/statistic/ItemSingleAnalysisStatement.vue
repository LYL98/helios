<!--
  商品单品分析
-->
<template>
  <sub-menu>
    <div class="query" style="margin-bottom: 20px">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="时间">
            <el-date-picker
              v-model="currentDateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              class="query-item-date"
              :picker-options="fixDateOptions"
              :clearable="false"
              @change="onChangeDate">
            </el-date-picker>
          </my-query-item>
        </el-col>
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <div style="display: flex">
              <my-search-item v-model="selectItemName" size="small" class="query-item-input" ref="mySelectItem" @onSelectItem="onSelectItem"></my-search-item>
              <el-button type="primary" size="small" class="query-item-reset" @click="clearQuery">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div :style="{ overflowY: 'auto', overflowX: 'auto', height: viewWindowHeight - offsetHeight + 'px'}">
      <div style="background-color: white">
        <P style="text-align: center; padding-top: 10px">
          <span style="color: blue; font-size: 20px">{{selectItemName ? selectItemName : '-'}}</span>
          <span style="font-size: 20px">指标分析</span>
        </P>
        <div id="main" style="margin-top: 20px; height: 600px;" ref="myIndexChart"></div>
      </div>
      <!--表格-->
      <div class="statistics-table-list-container">
        <el-table :data="dataItem"
                  :row-class-name="highlightRowClassName"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  style="width: 100%;">
          <el-table-column
            :label="(selectItemName ? selectItemName : '-') + '指标'"
            fixed="left"
            width="140px"
            prop="city_title">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            align="left"
            v-for="(d, index) in dateRange()"
            :key="index"
            :label="labelDate(d)">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ cellValue(scope.row.cells, d) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="平均值" min-width="100" align="left">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ average(scope.row.cells, scope.$index) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合计" min-width="120" align="left">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ total(scope.row.cells, scope.$index) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </sub-menu>
</template>

<script>
  import { DatePicker, Button, Table, Row, Col, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import { QueryItem, SearchItem } from '@/common';
  import mainMixin from '@/share/mixin/main.mixin';

  import echarts from "echarts/lib/echarts";
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/toolbox';
  import 'echarts/lib/component/legend';

  export default {
    name: "ItemSingleAnalysisStatement",
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
      'my-search-item': SearchItem,
      'my-query-item': QueryItem
    },
    created() {
      let { defaultItemQuery, province } = this;

      if (province) {
        defaultItemQuery.province_code = province.code;
      }

      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));

      this.resetBeginDate = DataHandle.formatDate(beginDate, 'yyyy-MM-dd')
      this.resetEndDate = endDateStr

      this.currentDateRange.push(this.resetBeginDate);
      this.currentDateRange.push(this.resetEndDate);

      let that = this;
      if (!that.$data.selectItemName || that.$data.selectItemName === '') {
        that.loadDefaultItem((item) => {
          that.query.item_id = item.item_id;
          that.resetItemId = item.item_id;
          that.$data.selectItemName = item.item_title;
          that.$data.resetItemName = item.item_title,
          that.loadItemSingleAnalysisList(() => { that.initChart() });
        });
      } else {
        that.loadItemSingleAnalysisList(() => { that.initChart() });
      }
    },
    data() {
      return {
        currentDateRange: [],
        beforeDateRange: [],
        resetBeginDate: '',
        resetEndDate: '',
        resetItemId: '',
        resetItemName: '',
        dataItem: [],
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS  + Constant.OFFSET_QUERY_CLOSE,
        selectArea: 'zone',
        selectItemName: '',
        lineColors: [
          '#4FF222',  //1
          '#F22222',  //2
          '#F2B022',  //3
          '#22F2C2',  //4
          '#2279F2',  //5
          '#8E22F2',  //6
          '#F222A9',  //7
          '#D4FF00',  //8
          '#FFBDFB'   //9
        ],
        query: {
          item_id: '',
          begin_date: '',
          end_date: '',
        },
        defaultItemQuery: {
          province_code: '',
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
        fixDateOptions: Constant.FIX_DATE_RANGE,
        currentRow: {}
      }
    },
    watch: {
      currentDateRange: function (a, b) {
        this.beforeDateRange = b;
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
      //返回价格
      returnPrice(price){
        return price || price === 0 ? '¥' + DataHandle.returnPrice(price) : '-';
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
      onSelectItem(item) {
        if (item) {
          this.query.item_id = item.id;
          this.selectItemName = item.title;
        }
        this.loadItemSingleAnalysisList(() => { this.initChart() });
      },
      onChangeDate() {
        this.loadItemSingleAnalysisList(() => {
          this.initChart()
        })
      },
      clearQuery() {
        this.$data.query = {
          item_id: this.resetItemId,
          begin_date: this.resetBeginDate,
          end_date: this.resetEndDate
        };
        this.$refs.mySelectItem.clear();
        this.$data.selectItemName = this.resetItemName;
        this.$data.currentDateRange = [this.resetBeginDate, this.resetEndDate];
        this.loadItemSingleAnalysisList(() => { this.initChart() });
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
        return Array();
      },
      labelDate(date) {
        return DataHandle.formatDateLabel(date)
      },
      initChart() {
        let that = this;
        if (!that.$refs.myIndexChart) {
          return;
        }

        let { lineColors } = this;

        //与接口数据比较的日期：例如 2018-1-1
        let xDates = this.dateRange('f1');
        //x轴日期：例如 1月1日
        let xDisplayDates = this.dateRange('f2');


        let option = {
          tooltip : {
            trigger: 'axis',
            formatter: function (params,ticket,callback) {
              var res = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
              }
              return res
            }
          },
          calculable : true,
          legend: {
            data: this.indexNames(),
            selectedMode: 'single',
            selected: {
              '采购价': true,
              '销售价': false,
              '销售量': false,
              '销售金额': false,
              '下单客户数': false,
              '下单率': false,
              '加价率': false,
              '退赔率': false,
              '采购价格偏差': false
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
            //采购价
            {
              name:'采购价',
              type:'line',
              itemStyle: {normal: {color: lineColors[0], lineStyle: {color: lineColors[0]}}},
              smooth: true,
              data: this.lineData(0, xDates)
            },
            {
              name:'采购价',
              type:'bar',
              itemStyle: {normal: {color: lineColors[1], lineStyle: {color: lineColors[1]}}},
              data:this.lineData(0, xDates)
            },

            //销售价
            {
              name:'销售价',
              type:'line',
              itemStyle: {normal: {color: lineColors[1], lineStyle: {color: lineColors[1]}}},
              smooth: true,
              data: this.lineData(1, xDates)
            },
            {
              name:'销售价',
              type:'bar',
              itemStyle: {normal: {color: lineColors[0], lineStyle: {color: lineColors[0]}}},
              data:this.lineData(1, xDates)
            },

            //销售量
            {
              name:'销售量',
              type:'line',
              itemStyle: {normal: {color: lineColors[2], lineStyle: {color: lineColors[2]}}},
              smooth: true,
              data: this.lineData(2, xDates)
            },
            {
              name:'销售量',
              type:'bar',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              data: this.lineData(2, xDates)
            },

            //销售金额
            {
              name:'销售金额',
              type:'line',
              itemStyle: {normal: {color: lineColors[3], lineStyle: {color: lineColors[3]}}},
              smooth: true,
              data: this.lineData(3, xDates)
            },
            {
              name:'销售金额',
              type:'bar',
              itemStyle: {normal: {color: lineColors[2], lineStyle: {color: lineColors[2]}}},
              data:this.lineData(3, xDates)
            },

            //下单客户数
            {
              name:'下单客户数',
              type:'line',
              itemStyle: {normal: {color: lineColors[4], lineStyle: {color: lineColors[4]}}},
              smooth: true,
              data: this.lineData(4, xDates)
            },
            {
              name:'下单客户数',
              type:'bar',
              itemStyle: {normal: {color: lineColors[5], lineStyle: {color: lineColors[5]}}},
              data:this.lineData(4, xDates)
            },

            //下单率
            {
              name:'下单率',
              type:'line',
              itemStyle: {normal: {color: lineColors[5], lineStyle: {color: lineColors[5]}}},
              smooth: true,
              data: this.lineData(5, xDates)
            },
            {
              name:'下单率',
              type:'bar',
              itemStyle: {normal: {color: lineColors[4], lineStyle: {color: lineColors[4]}}},
              data:this.lineData(5, xDates)
            },

            //加价率
            {
              name:'加价率',
              type:'line',
              itemStyle: {normal: {color: lineColors[6], lineStyle: {color: lineColors[6]}}},
              smooth: true,
              data: this.lineData(6, xDates)
            },
            {
              name:'加价率',
              type:'bar',
              itemStyle: {normal: {color: lineColors[7], lineStyle: {color: lineColors[7]}}},
              data:this.lineData(6, xDates)
            },

            //退赔率
            {
              name:'退赔率',
              type:'line',
              itemStyle: {normal: {color: lineColors[7], lineStyle: {color: lineColors[7]}}},
              smooth: true,
              data: this.lineData(7, xDates)
            },
            {
              name:'退赔率',
              type:'bar',
              itemStyle: {normal: {color: lineColors[6], lineStyle: {color: lineColors[6]}}},
              data:this.lineData(7, xDates)
            },

            //采购价格偏差
            {
              name:'采购价格偏差',
              type:'line',
              itemStyle: {normal: {color: lineColors[8], lineStyle: {color: lineColors[8]}}},
              smooth: true,
              data: this.lineData(8, xDates)
            },
            {
              name:'采购价格偏差',
              type:'bar',
              itemStyle: {normal: {color: lineColors[5], lineStyle: {color: lineColors[5]}}},
              data:this.lineData(8, xDates)
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

          for (let i=0; i<xDates.length; i++) {
            //得到当前列的日期
            let colDate = xDates[i];
            let hasDate = false;
            for (let i=0; i<item.cells.length; i++) {
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

      indexNames() {
        let indexNames = Array();
        indexNames.push('采购价');
        indexNames.push('销售价');
        indexNames.push('销售量');
        indexNames.push('销售金额');
        indexNames.push('下单客户数');
        indexNames.push('下单率');
        indexNames.push('加价率');
        indexNames.push('退赔率');
        indexNames.push('采购价格偏差');
        return indexNames;
      },
      indexName(index) {
        let indexNames = this.indexNames();
        return indexNames[index];
      },
      //根据特定的指标来处理对应的值
      handleIndexValue(index, value) {
        switch (index) {
          case 5:
          case 6:
          case 7:
          case 8:
            return DataHandle.returnMarkup(value);
          case 0:
          case 1:
          case 3:
            return DataHandle.returnPrice(value);
          case 2:
          case 4:
            return value;
          default:
            return 0;
        }
      },
      //根据特定的指标来处理对应的值
      handleIndexValueToDisplay(index, value) {
        switch (index) {
          case 5:
          case 6:
          case 7:
          case 8:
            return this.formatRate(value);
          case 0:
          case 1:
          case 3:
            return this.returnPrice(value);
          case 2:
          case 4:
            return this.formatValue(value);
          default:
            return 0;
        }
      },
      cellDisplayValueForIndex(index, cellItem) {
        let that = this;
        let result = '-';
        switch (index) {
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
        return result
      },
      cellValueForIndex(index, cellItem) {
        let result = '-';
        switch (index) {
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
        if (index === 2 || index === 3 || index === 4) {
          return that.handleIndexValueToDisplay(index, sum);
        } else {
          return '-';
        }
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

      //加载默认商品
      loadDefaultItem(callback) {
        let { currentDateRange, defaultItemQuery } = this;
        if (currentDateRange && currentDateRange.length === 2) {
          defaultItemQuery.begin_date = currentDateRange[0];
          defaultItemQuery.end_date = currentDateRange[1];
        } else {
          defaultItemQuery.begin_date = '';
          defaultItemQuery.end_date = '';
        }
        this.defaultItem(callback).catch(e => {})
      },

      loadItemSingleAnalysisList(callback) {
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
        this.itemSingleAnalysisList(callback).catch(e => {})
      },

      async itemSingleAnalysisList(callback){
        let { query } = this;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalItemSingleAnalysis, query);
        this.$loading({ isShow: false });
        if(res.code === 0){
          //将日期维度转化成指标维度
          let dateItems = res.data;
          let indexItems = Array();
          if (dateItems && dateItems.length > 0) {
            for (let i = 0; i < 9; i++) {
              //初始化行变量
              let indexItem = {
                name: this.indexName(i),
                cells: Array()
              };

              //计算列
              for (let j = 0; j < dateItems.length; j++) {
                let item = dateItems[j];
                //初始化一行中每列单元格
                let cell = {
                  date: item.opt_date,
                  //用index区分赋值
                  value: this.cellDisplayValueForIndex(i, item),
                  origin_value: this.cellValueForIndex(i, item),
                  type: i
                };
                indexItem.cells.push(cell)
              }
              indexItems.push(indexItem)
            }
          }
          //console.log(indexItems);
          indexItems.map((item, index) => item.id = index);
          this.$data.dataItem = indexItems;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },

      async defaultItem(callback){
        let that = this;
        let { defaultItemQuery } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalItemSaleGreatest, defaultItemQuery);
        if(res.code === 0){
          typeof callback === 'function' && callback(res.data);
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
