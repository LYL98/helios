<!--运营统计-->
<template>
  <div>
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
      </el-row>
    </div>
    <div :style="{ overflowY: 'auto', overflowX: 'auto', height: windowHeight - offsetHeight + 'px'}">
      <div style="background-color: white;">
        <!--<P style="text-align: center; padding-top: 10px">-->
          <!--<span style="color: blue; font-size: 20px">{{selectItemName ? selectItemName : '-'}}</span>-->
          <!--<span style="font-size: 20px">指标分析</span>-->
        <!--</P>-->
        <!--图表-->
        <div style="display: flex">
          <div id="main" style="margin-top: 20px; height: 600px; flex: 1" ref="myIndexChart"></div>
          <div style="flex: initial; width: 200px;">
            <div style="margin-top: 80px; font-size: 18px; color: black;">指标放大倍数</div>
            <div style="margin-top: 10px;">
              <span>订单商品金额: {{zoomRate[0]}}倍</span><br/>
              <span>优惠金额: {{zoomRate[2]}}倍</span><br/>
              <span>订单实付金额: {{zoomRate[4]}}倍</span><br/>
              <span>发货金额: {{zoomRate[5]}}倍</span><br/>
              <span>下单门店数: {{zoomRate[6]}}倍</span><br/>
              <span>订单数量: {{zoomRate[7]}}倍</span><br/>
              <span>下单件数: {{zoomRate[8]}}倍</span><br/>
              <span>下单商品数: {{zoomRate[9]}}倍</span><br/>
            </div>
          </div>
        </div>
      </div>
      <!--表格-->
      <div class="statistics-table-list-container">
        <el-table :data="dataItem"
                  :row-class-name="highlightRowClassName"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave">
          <el-table-column
            label="指标"
            fixed="left"
            width="120px"
            prop="city_title">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100px"
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
          <el-table-column label="合计" min-width="110" align="left">
            <template slot-scope="scope">
              <span :class="isEllipsis(scope.row)">{{ total(scope.row.cells, scope.$index) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
  import { DatePicker, Button, Table, Row, Col, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
  import { mapGetters, mapActions } from 'vuex';
  import { Statistic } from '@/service';
  import { DataHandle, Constant } from '@/util';
  import { QueryItem, SearchItem } from '@/common';

  import echarts from "echarts/lib/echarts";
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/toolbox';
  import 'echarts/lib/component/legend';

  export default {
    name: "OperationStatistics",
    computed: mapGetters({
      province: 'globalProvince',
      windowHeight: 'windowHeight'
    }),
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
      documentTitle("统计 - 运营统计");

      let { query, province } = this;

      if (province) {
        query.province_code = province.code;
      }

      let endDate = new Date();
      let endDateStr = DataHandle.formatDate(endDate, 'yyyy-MM-dd');
      let beginDate = new Date(endDate.setDate(endDate.getDate() - 30));
      this.currentDateRange.push(DataHandle.formatDate(beginDate, 'yyyy-MM-dd'));
      this.currentDateRange.push(endDateStr);

      let that = this;

      that.loadOperationStatistics(() => {
        that.initChart()
      });
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE,
        currentDateRange: [],
        beforeDateRange: [],
        dataItem: [],
        selectArea: 'zone',
        selectItemName: '',
        zoomRate: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lineColors: [
          '#E3D557',   //1
          '#8BC867',   //2
          '#E081AF',   //3
          '#819DE0',   //4
          '#C08DDB',   //5
          '#66BFD5',   //6
          '#F29152',   //7
          '#FA3B3B',   //8
          '#4E71F5',   //9
          '#40DFF2',   //10
        ],
        /**
         * item_cat_num: 下单商品数
         item_num: 下单件数
         - item_total_price: 订单商品金额
        - amount_delivery: 运费金额
        - bonus_promotion: 优惠金额
        - check_chg: 称重金额
        - amount_pay: 订单实付金额
         order_num: 订单数量
         store_num: 下单门店数
         total_delivery_item_price: 发货金额
         * */
        indexNames: [
          '订单商品金额',
          '运费金额',
          '优惠金额',
          '称重金额',
          '订单实付金额',
          '发货金额',
          '下单门店数',
          '订单数量',
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

        //放大指标
        that.zoomLines();

        let option = {
          tooltip : {
            trigger: 'axis',
            //show: true,   //default true
            // showDelay: 0,
            // hideDelay: 50,
            // transitionDuration:0,
            // backgroundColor : 'rgba(255,0,255,0.7)',
            // borderColor : '#f50',
            // borderRadius : 8,
            // borderWidth: 2,
            // padding: 10,    // [5, 10, 15, 20]
            // position : function(p) {
            //   // 位置回调
            //   // console.log && console.log(p);
            //   return [p[0] + 10, p[1] - 10];
            // },
            // textStyle : {
            //   color: 'yellow',
            //   decoration: 'none',
            //   fontFamily: 'Verdana, sans-serif',
            //   fontSize: 15,
            //   fontStyle: 'italic',
            //   fontWeight: 'bold'
            // },
            formatter: function (params,ticket,callback) {
              // console.log(params.length);
              var res = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                let zoomValue = params[i].value / that.narrowRate(params[i].seriesName);
                res += '<br/>' + params[i].seriesName + ' : ' + zoomValue;
              }
              //callback 异步时使用
              // callback(ticket, res);
              return res
            }
          },
          // toolbox: {
          //   show : true,
          //   feature : {
          //     mark : {show: true},
          //     dataView : {show: true, readOnly: false},
          //     magicType: {show: true, type: ['line', 'bar']},
          //     restore : {show: true},
          //     saveAsImage : {show: true}
          //   }
          // },
          calculable : true,
          legend: {
            data: indexNames,
            selected: {
              '订单商品金额': false,
              '优惠金额': false,
              '订单实付金额': true,
              '发货金额': false,
              '下单门店数': true,
              '订单数量': false,
              '下单件数': true,
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
            {
              name:'订单商品金额',
              type:'line',
              itemStyle: {normal: {color: lineColors[0], lineStyle: {color: lineColors[0]}}},
              smooth: true,
              data: this.lineData(0, xDates)
            },
            {
              name:'优惠金额',
              type:'line',
              itemStyle: {normal: {color: lineColors[2], lineStyle: {color: lineColors[2]}}},
              smooth: true,
              data: this.lineData(2, xDates)
            },
            {
              name:'订单实付金额',
              type:'line',
              itemStyle: {normal: {color: lineColors[4], lineStyle: {color: lineColors[4]}}},
              smooth: true,
              data: this.lineData(4, xDates)
            },
            {
              name:'发货金额',
              type:'line',
              itemStyle: {normal: {color: lineColors[5], lineStyle: {color: lineColors[5]}}},
              smooth: true,
              data: this.lineData(5, xDates)
            },
            {
              name:'下单门店数',
              type:'line',
              itemStyle: {normal: {color: lineColors[6], lineStyle: {color: lineColors[6]}}},
              smooth: true,
              data: this.lineData(6, xDates)
            },
            {
              name:'订单数量',
              type:'line',
              itemStyle: {normal: {color: lineColors[7], lineStyle: {color: lineColors[7]}}},
              smooth: true,
              data: this.lineData(7, xDates)
            },
            {
              name:'下单件数',
              type:'line',
              itemStyle: {normal: {color: lineColors[8], lineStyle: {color: lineColors[8]}}},
              smooth: true,
              data: this.lineData(8, xDates)
            },
            {
              name:'下单商品数',
              type:'line',
              itemStyle: {normal: {color: lineColors[9], lineStyle: {color: lineColors[9]}}},
              smooth: true,
              data: this.lineData(9, xDates)
            }
          ]
        };

        // console.log('init chart');
        echarts.init(that.$refs.myIndexChart).setOption(option)
      },
      //计算缩放比例
      zoomLines() {
        let { dataItem, zoomRate } = this;
        //恢复比例默认值
        for (let i = 0; i < zoomRate.length; i++) {
          zoomRate[i] = 1;
        }
        //缩放阈值，相差倍数大于这个值就进行放大
        let zoomThreshold = 5;
        //对指标进行分类放大
        if (dataItem && dataItem.length > 0) {
          let priceMaxValues = Array();
          let type1MaxValues = Array();
          let type2MaxValues = Array();
          let type3MaxValues = Array();
          for (let i = 0; i < dataItem.length; i++) {
            let item = dataItem[i];
            let length = item.cells.length;
            let originValues = Array();
            for (let j = 0; j < length; j++) {
              let cellValue = item.cells[j].origin_value;
              originValues.push(Number(this.handleIndexValue(i, cellValue)));
            }
            let maxCellValue = Math.max(...originValues);
            switch (i) {
              case 0:
              case 4:
              case 5:
                //价格
                priceMaxValues.push(maxCellValue);
                break;
              case 6:
              case 9:
                type1MaxValues.push(maxCellValue);
                break;
              case 2:
              case 7:
              case 8:
                type2MaxValues.push(maxCellValue);
                break;
              default:
                break;
            }
          }
          let priceMaxValue = Math.max(...priceMaxValues);
          let type1MaxValue = Math.max(...type1MaxValues);
          let type2MaxValue = Math.max(...type2MaxValues);

          //销售量放大比例
          if (priceMaxValue !== 0 && priceMaxValue / type1MaxValue > zoomThreshold) {
            let zoom = parseInt(priceMaxValue / type1MaxValue - 1);
            zoomRate[6] = zoom;
            zoomRate[9] = zoom;
          }

          //采购价、销售价、优惠价放大比例
          if (priceMaxValue !== 0 && priceMaxValue / type2MaxValue > zoomThreshold) {
            let zoom = parseInt(priceMaxValue / type2MaxValue - 1);
            zoomRate[2] = zoom;
            zoomRate[7] = zoom;
            zoomRate[8] = zoom;
          }
        }
      },
      //根据指标名称查找缩小比例
      narrowRate(seriesName) {
        let { zoomRate } = this;
        switch (seriesName) {
          case '订单商品金额':
            return zoomRate[0];
          case '运费金额':
            return zoomRate[1];
          case '优惠金额':
            return zoomRate[2];
          case '称重金额':
            return zoomRate[3];
          case '订单实付金额':
            return zoomRate[4];
          case '发货金额':
            return zoomRate[5];
          case '下单门店数':
            return zoomRate[6];
          case '订单数量':
            return zoomRate[7];
          case '下单件数':  //下单件数
            return zoomRate[8];
          case '下单商品数':  //下单商品数
            return zoomRate[9];
        }
      },
      /**
       * 每个指标的数据
       * @param index 指标序号
       * @param xDates x轴的日期，用来做比对
       * @returns {any[]}
       */
      lineData(index, xDates) {
        let { dataItem, zoomRate } = this;
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
                lineData.push(Number(this.handleIndexValue(index, cellValue)) * zoomRate[index]);
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
          case 2:
          case 3:
          case 4:
          case 5:
            return DataHandle.returnPrice(value);
          case 6:
          case 7:
          case 8:
          case 9:
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
          case 2:
          case 3:
          case 4:
          case 5:
            return this.returnPrice(value);
          case 6:
          case 7:
          case 8:
          case 9:
            return this.formatValue(value);
          default:
            return 0;
        }
      },

      cellDisplayValue(index, cellItem) {
        let that = this;
        let result = '-';
        switch (index) {
          case 0:
            result = that.returnPrice(cellItem.item_total_price);
            break;
          case 1:
            result = that.returnPrice(cellItem.amount_delivery);
            break;
          case 2:
            result = that.returnPrice(cellItem.bonus_promotion);
            break;
          case 3:
            result = that.returnPrice(cellItem.check_chg);
            break;
          case 4:
            result = that.returnPrice(cellItem.amount_pay);
            break;
          case 5:
            result = that.returnPrice(cellItem.total_delivery_item_price);
            break;
          case 6:
            result = that.formatValue(cellItem.store_num);
            break;
          case 7:
            result = that.formatValue(cellItem.order_num);
            break;
          case 8:
            result = that.formatValue(cellItem.item_num);
            break;
          case 9:
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
            result = cellItem.item_total_price;
            break;
          case 1:
            result = cellItem.amount_delivery;
            break;
          case 2:
            result = cellItem.bonus_promotion;
            break;
          case 3:
            result = cellItem.check_chg;
            break;
          case 4:
            result = cellItem.amount_pay;
            break;
          case 5:
            result = cellItem.total_delivery_item_price;
            break;
          case 6:
            result = cellItem.store_num;
            break;
          case 7:
            result = cellItem.order_num;
            break;
          case 8:
            result = cellItem.item_num;
            break;
          case 9:
            result = cellItem.item_cat_num;
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
        // if (index === 2 || index === 3 || index === 4) {
        //   return that.handleIndexValueToDisplay(index, sum);
        // } else {
        //   return '-';
        // }
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
        that.loading({isShow: true, isWhole: true});
        let res = await Statistic.statisticalSumBusinessDelivery(query);
        if(res.code === 0){
          //将日期维度转化成指标维度
          let dateItems = res.data;
          let indexItems = Array();
          if (dateItems && dateItems.length > 0) {
            for (let i = 0; i < indexNames.length; i++) {
              //初始化行变量
              let indexItem = {
                name: indexNames[i],
                cells: Array()
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
                  type: i
                };
                indexItem.cells.push(cell)
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
