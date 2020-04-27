<template>
    <div>
         <div id="main" style="padding-top: 20px; height: 600px;" ref="myIndexChart"></div>
    </div>
</template>
<script>

import echarts from "echarts/lib/echarts";
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/toolbox';
  import 'echarts/lib/component/legend';
export default {
    name: 'DetailEchart',
    
    methods: {
        initChart(){
            
        }
    },
}
</script>
<style lang="scss" scoped>

</style>