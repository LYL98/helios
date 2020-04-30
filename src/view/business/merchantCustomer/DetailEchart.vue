<template>
  <div>
    <div id="main" style="width:100%;padding-top: 20px; height: 700px;" ref="myIndexChart"></div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legend";
import "echarts/lib/component/dataZoom";
export default {
  name: "DetailEchart",
  props: {
    echartData: {
      type: Array
    }
  },
  mounted() {
    this.initChart();
  },
  watch: {
    echartData: {
      deep: true,
      handler: function(a, b) {
        this.initChart();
      }
    }
  },
  methods: {
    initChart() {
      let that = this;
      let xData = [];
      let yData = [];
      this.$props.echartData.map(item => {
        xData.push(item.display_class);
        yData.push(item.num);
      });
      var myChart = echarts.init(document.getElementById("main"));

      var option = {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: ["提报次数"]
        },
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: "提报次数",
            type: "bar",
            data: yData,
            barCategoryGap:'50%',
          }
        ],
        
        dataZoom: [
          // {
          //   type: "slider",
          //   show: true, //flase直接隐藏图形
          //   xAxisIndex: [0],
          //   left: "9%", //滚动条靠左侧的百分比
          //   bottom: -5,
          //   start: 0, //滚动条的起始位置
          //   end: 100 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          // }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>