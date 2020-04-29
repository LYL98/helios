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
  watch:{
    echartData:{
      deep:true,
      handler: function (a, b) {
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
            data: yData
          }
        ],
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     start: 0,
        //     end: 50
        //   },
        //   {
        //     type: "inside",
        //     realtime: true,
        //     start: 0,
        //     end: 50
        //   }
        // ]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>