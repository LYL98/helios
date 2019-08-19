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
  name: "ItemFluctuationChart",
  components: {
    'el-dialog': Dialog
  },
  props: ['data'],
  computed: {
    title: function () {
      let { detail } = this;
      return (detail.rowData.item_title ? detail.rowData.item_title : '') + this.lineName() + (detail.rowData.m_title ? '平均值' : '')  + '数据波动分析'
    }
  },
  data() {
    return {
      isShow: false,
      detail: {
        rowData: {
          item_title: ''
        }
      },
    }
  },
  watch: {
    data: function (a, b) {
      this.detail = Object.assign({}, this.$data.detail, a);
      this.isShow = this.detail.isShow;
      if (this.isShow) {
        this.$nextTick(_ => {
          this.initChart();
        });
      }
    }
  },
  methods: {
    //返回价格
    returnPriceValue(price){
      return price || price === 0 ? DataHandle.returnPrice(price) : 0;
    },
    returnValue(value) {
      return value || value === 0 ? value : 0
    },
    returnRate(value) {
      return value || value === 0 ? this.returnMarkup(value) : 0
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    cancel() {
      this.isShow = false;
    },
    onCancel() {
      this.$attrs.callback();
    },
    isAverageLine() {
      let { detail } = this;
      return detail.rowData.m_title && detail.rowData.m_title === '平均值'
    },
    lineName() {
      let { detail } = this;

      switch (detail.selectIndex) {
        case 0:
          return '采购价';
        case 1:
          return '销售价';
        case 2:
          return '销售量';
        case 3:
          return '销售金额';
        case 4:
          return '下单客户数';
        case 5:
          return '下单率';
        case 6:
          return '加价率';
        case 7:
          return '退赔率';
        case 8:
          return '采购价格偏差';
        default:
          return '-';
      }
    },
    unit() {
      let { detail } = this;

      switch (detail.selectIndex) {
        case 5:
        case 6:
        case 7:
        case 8:
          return '(%)';
        case 0:
        case 1:
        case 3:
          return '(元)';
        default:
          return '';
      }
    },
    initChart() {
      let that = this;
      if (!that.$refs.myChart) {
        return
      }
      let { detail } = this;

      if (!detail.rowData || !detail.colData) {
        return
      }

      let xDates = Array();
      let xAverage = Array();
      let xCompare = Array();
      for (let i=0; i<detail.colData.length; i++) {
        let colItem = detail.colData[i];
         xDates.push(colItem.opt_date);
         let result = 0;
        switch (detail.selectIndex) {
          case 0:
            result = that.returnPriceValue(colItem.price_buy);
            break;
          case 1:
            result = that.returnPriceValue(colItem.price_sale);
            break;
          case 2:
            result = that.returnValue(colItem.count_real);
            break;
          case 3:
            result = that.returnPriceValue(colItem.amount_real);
            break;
          case 4:
            result = that.returnValue(colItem.store_num_ord);
            break;
          case 5:
            result = that.returnRate(colItem.lower_rate);
            break;
          case 6:
            result = that.returnRate(colItem.markup_rate);
            break;
          case 7:
            result = that.returnRate(colItem.return_rate);
            break;
          case 8:
            result = that.returnRate(colItem.deviation_rate);
            break;
          default:
            break;
        }
        xAverage.push(result);

        //根据平均值日期匹配每一行的数据，每行数据的日期是不连续的，需要手动补全日期
        let hasDate = false;
        //获取当前列的日期
        let yDate = detail.colData[i].opt_date;
        for (let j=0; j<detail.rowData.items.length; j++) {
          let rowItem = detail.rowData.items[j];

          if (yDate === rowItem.opt_date) {
            hasDate = true;
            let result = 0;
            switch (detail.selectIndex) {
              case 0:
                result = that.returnPriceValue(rowItem.price_buy);
                break;
              case 1:
                result = that.returnPriceValue(rowItem.price_sale);
                break;
              case 2:
                result = that.returnValue(rowItem.count_real);
                break;
              case 3:
                result = that.returnPriceValue(rowItem.amount_real);
                break;
              case 4:
                result = that.returnValue(rowItem.store_num_ord);
                break;
              case 5:
                result = that.returnRate(rowItem.lower_rate);
                break;
              case 6:
                result = that.returnRate(rowItem.markup_rate);
                break;
              case 7:
                result = that.returnRate(rowItem.return_rate);
                break;
              case 8:
                result = that.returnRate(rowItem.deviation_rate);
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

      let series = Array();
      if (detail.selectIndex !== 0 && detail.selectIndex !== 1 && detail.selectIndex !== 8) {
        series.push( {
          name: '平均值',
          type: 'line',
          smooth: true,
          data: xAverage,
        });
      }
      if (!that.isAverageLine()) {
        series.push( {
          name: that.lineName(),
          type:'line',
          smooth: true,
          data: xCompare,
        });
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
          data:['平均值',that.lineName()]
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
        series : series
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
