<template>
  <div>
    <el-dialog
      :title="title"
      :visible="isShow"
      width="1000px"
      @close="onCancel"
      :before-close="cancel">
      <div id="main" style="width: 100%; height: 600px;" ref="myChart"></div>
    </el-dialog>

  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';

import { Dialog } from 'element-ui';
import { DataHandle } from '@/util';

export default {
  name: "BusinessFluctuationChart",
  components: {
    'el-dialog': Dialog
  },
  props: ['data'],
  computed: {
    title: function () {
      let subTitle = '';
      if (this.isAverageLine()) {
        subTitle = '平均值'
      } else if (this.isTotalLine()) {
        subTitle = '总计'
      }
      return (this.isAverageLine() || this.isTotalLine() ? '' : this.areaName())
        + this.lineName()
        + subTitle + '数据波动分析'
    }
  },
  data() {
    return {
      isShow: false,
      detail: {

      },
    }
  },
  watch: {
    data: function (a, b) {
      this.detail = Object.assign({}, this.$data.detail, a);
      this.isShow = this.detail.isShow;
      // console.log(this.detail)
      if (this.isShow) {
        this.$nextTick(_ => {
          this.initChart();
        });
      }
    }
  },
  methods: {
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    cancel() {
      this.isShow = false;
    },
    onCancel() {
      this.$attrs.callback();
    },
    areaName() {
      let { detail } = this;
      switch (detail.selectArea) {
        case 'zone':
          return detail.rowData.zone_title;
        case 'city':
          return detail.rowData.city_title;
        default:
          return '-'
      }
    },
    isAverageLine() {
      let { detail } = this;
      switch (detail.selectArea) {
        case 'zone':
          return detail.rowData.zone_title === '平均值';
        case 'city':
          return detail.rowData.city_title === '平均值';
        default:
          return false
      }
    },
    isTotalLine() {
      let { detail } = this;
      switch (detail.selectArea) {
        case 'zone':
          return detail.rowData.zone_title === '总计';
        case 'city':
          return detail.rowData.city_title === '总计';
        default:
          return false
      }
    },
    lineName() {
      let { detail } = this;

      switch (detail.selectType) {
        case 'merchant':
          return '下单门店数';
        case 'item_total_price':
          return '订单商品金额';
        case 'amount_delivery':
          return '运费金额';
        case 'bonus_promotion':
          return '优惠金额';
        case 'check_chg':
          return '称重金额';
        case 'real_price':
          return '订单应付金额';
        case 'customer':
          return '客单价';
        default:
          return '-';
      }
    },
    unit() {
      let { detail } = this;

      switch (detail.selectType) {
        case 'merchant':
          return '';
        case 'item_total_price':
        case 'amount_delivery':
        case 'bonus_promotion':
        case 'check_chg':
        case 'real_price':
        case 'customer':
          return '(元)';
        default:
          return '-';
      }
    },
    initChart() {
      let that = this;
      if (!that.$refs.myChart) {
        return
      }
      let { detail } = this;

      if (!detail.rowData || !detail.averageColData || !detail.totalColData) {
        return
      }

      let xDates = detail.dateRange;
      let xAverage = Array();
      let xTotal = Array();
      let xCompare = Array();
      // console.log('start')
      for (let i=0; i<xDates.length; i++) {
        //列日期
        let yDate = xDates[i];

        if (!that.isTotalLine()) {
          //平均值
          let averageHasDate = false;
          for (let j=0; j<detail.averageColData.length; j++) {
            let rowItem = detail.averageColData[j];

            if (yDate === rowItem.opt_date) {
              averageHasDate = true;
              let result = 0;
              switch (detail.selectType) {
                case 'merchant':
                  result = rowItem.store_num_ord ? rowItem.store_num_ord : 0;
                  break;
                case 'item_total_price':
                  result = rowItem.item_total_price ? that.returnPrice(rowItem.item_total_price) : 0;
                  break;
                case 'amount_delivery':
                  result = rowItem.amount_delivery ? that.returnPrice(rowItem.amount_delivery) : 0;
                  break;
                case 'bonus_promotion':
                  result = rowItem.bonus_promotion ? that.returnPrice(rowItem.bonus_promotion) : 0;
                  break;
                case 'check_chg':
                  result = rowItem.check_chg ? that.returnPrice(rowItem.check_chg) : 0;
                  break;
                case 'real_price':
                  result = rowItem.real_price ? that.returnPrice(rowItem.real_price) : 0;
                  break;
                case 'customer':
                  result = rowItem.cust_price ? that.returnPrice(rowItem.cust_price) : 0;
                  break;
                default:
                  break;
              }
              xAverage.push(result);
              break;
            }
          }
          if (!averageHasDate) {
            xAverage.push(0)
          }
        }

        if (!that.isAverageLine()) {
          //总计
          let totalHasDate = false;
          for (let j=0; j<detail.totalColData.length; j++) {
            let rowItem = detail.totalColData[j];

            if (yDate === rowItem.opt_date) {
              totalHasDate = true;
              let result = 0;
              switch (detail.selectType) {
                case 'merchant':
                  result = rowItem.store_num_ord ? rowItem.store_num_ord : 0;
                  break;
                case 'item_total_price':
                  result = rowItem.item_total_price ? that.returnPrice(rowItem.item_total_price) : 0;
                  break;
                case 'amount_delivery':
                  result = rowItem.amount_delivery ? that.returnPrice(rowItem.amount_delivery) : 0;
                  break;
                case 'bonus_promotion':
                  result = rowItem.bonus_promotion ? that.returnPrice(rowItem.bonus_promotion) : 0;
                  break;
                case 'check_chg':
                  result = rowItem.check_chg ? that.returnPrice(rowItem.check_chg) : 0;
                  break;
                case 'real_price':
                  result = rowItem.real_price ? that.returnPrice(rowItem.real_price) : 0;
                  break;
                case 'customer':
                  result = rowItem.cust_price ? that.returnPrice(rowItem.cust_price) : 0;
                  break;
                default:
                  break;
              }
              xTotal.push(result);
              break;
            }
          }
          if (!totalHasDate) {
            xTotal.push(0)
          }
        }

        //根据日期匹配每一行的数据，每行数据的日期是不连续的，需要手动补全日期
        let hasDate = false;
        for (let j=0; j<detail.rowData.items.length; j++) {
          let rowItem = detail.rowData.items[j];

          if (yDate === rowItem.opt_date) {
            hasDate = true;
            let result = 0;
            switch (detail.selectType) {
              case 'merchant':
                result = rowItem.store_num_ord ? rowItem.store_num_ord : 0;
                break;
              case 'item_total_price':
                result = rowItem.item_total_price ? that.returnPrice(rowItem.item_total_price) : 0;
                break;
              case 'amount_delivery':
                result = rowItem.amount_delivery ? that.returnPrice(rowItem.amount_delivery) : 0;
                break;
              case 'bonus_promotion':
                result = rowItem.bonus_promotion ? that.returnPrice(rowItem.bonus_promotion) : 0;
                break;
              case 'check_chg':
                result = rowItem.check_chg ? that.returnPrice(rowItem.check_chg) : 0;
                break;
              case 'real_price':
                result = rowItem.real_price ? that.returnPrice(rowItem.real_price) : 0;
                break;
              case 'customer':
                result = rowItem.cust_price ? that.returnPrice(rowItem.cust_price) : 0;
                break;
              default:
                break;
            }
            xCompare.push(result);
            break;
          }
        }
        if (!hasDate) {
          xCompare.push(0)
        }
      }

      // 折线数据
      let lineSeries = Array();
      if (that.isTotalLine()) {
        lineSeries.push({
          name: '总计',
          type: 'line',
          smooth: true,
          data: xTotal,
        });
      } else if (that.isAverageLine()) {
        lineSeries.push({
          name: '平均值',
          type: 'line',
          smooth: true,
          data: xAverage,
        });
      } else {
        /*if (detail.selectType !== 'customer') {
          lineSeries.push({
            name: '总计',
            type: 'line',
            smooth: true,
            data: xTotal,
          })
        }*/
        lineSeries.push({
          name: '平均值',
          type: 'line',
          smooth: true,
          data: xAverage,
        },{
          name: that.lineName(),
          type:'line',
          smooth: true,
          data: xCompare,
        });
      }

      //图例，添加顺序要和上面的series顺序相同
      let legends = Array();
      if (that.isTotalLine()) {
        legends.push('总计')
      } else if (that.isAverageLine()) {
        legends.push('平均值')
      } else {
        //legends.push('总计');
        legends.push('平均值');
        legends.push(that.lineName())
      }

      let option = {
        // title : {
        //   text: '未来一周气温变化',
        //   subtext: '纯属虚构'
        // },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data: legends
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            // dataView : {show: true, readOnly: false},
            // magicType : {show: true, type: ['line']},
            // restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        calculable : true,
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : xDates
          }
        ],
        yAxis : [
          {
            type: 'value',
            name: that.lineName() + that.unit(),
            axisLabel : {
              formatter: '{value}'
            }
          }
        ],
        series : lineSeries
      };

      let myChart = echarts.init(this.$refs.myChart);
      myChart.clear();
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
