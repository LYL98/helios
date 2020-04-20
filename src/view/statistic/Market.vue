<template>
  <sub-menu>
    <!-- 查询 -->
    <div class="query" style="margin-bottom: 16px;">
      <el-row :gutter="32">
        <el-col :span="6">
          <my-query-item label="区域">
            <global-province type="select" @change="selectProvince" class="query-item-select" />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="时间">
            <el-date-picker
              v-model="pickerValue"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              class="query-item-date"
              :picker-options="fixDateOptions"
              :clearable="false"
              @change="changePicker"
            ></el-date-picker>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="运营专区">
            <!-- v-module="selectValue" -->
            <el-select  v-model="selectValue" placeholder="请选择" size="small">
              <el-option
                v-for="item in tagsOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div :style="'height:' + (viewWindowHeight - offsetHeight) + 'px; overflow-y: auto;'">
      <!-- 图表 -->
      <div class="echart-container">
        <div :style="{height: '420px', width: '100%'}" ref="myEchart" />
        <ul class="description">
          <li>
            订单商品总金额:
            <span>{{ returnPrice(totalItemTotalPrice) }}</span> 元
          </li>
          <li>
            筐总金额:
            <span>{{ returnPrice(totalFramPrice) }}</span> 元
          </li>
          <li>
            改单商品总金额:
            <span>{{ Math.abs(returnPrice(totalOrderModifyPrice)) }}</span> 元
          </li>
          <li>
            销售总量:
            <span>{{ totalCount }}</span> 件
          </li>
        </ul>
      </div>
      <!-- 列表 -->
      <el-table
        class="list-table"
        style="padding-bottom: 20px;"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        @sort-change="onSort"
      >
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="一级科学分类" prop="item_system_class">
          <template slot-scope="scope">
            <a
              href="javascript:void(0)"
              class="title"
              @click="handleShowClassDetail(scope.row)"
              v-if="!!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClass2 )"
            >{{ scope.row.item_system_class || '其它' }}</a>
            <div v-else>{{ scope.row.item_system_class || '其它' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">￥{{ returnPrice(scope.row.amount_real) }}</template>
        </el-table-column>
        <!--<el-table-column label="框金额" sortable="custom" prop="fram_total_price">-->
        <!--<template slot-scope="scope">-->
        <!--￥{{ returnPrice(scope.row.fram_total_price) }}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="件数" sortable="custom" prop="count_real" />
        <el-table-column label="占比">
          <template
            slot-scope="scope"
          >{{ returnPercentage(scope.row.amount_real, totalItemTotalPrice) }}%</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: !!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClass2 ),
                  command: () => handleShowClassDetail(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </sub-menu>
</template>

<script>
import {
  Row,
  Col,
  DatePicker,
  Table,
  TableColumn,
  Pagination,
  Select,
  Option
} from "element-ui";
import { QueryItem, TableOperate } from "@/common";
import { Http, Config, DataHandle, Constant } from "@/util";
import mainMixin from "@/share/mixin/main.mixin";
import { GlobalProvince } from "@/component";

import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";

export default {
  name: "Market",
  mixins: [mainMixin],
  components: {
    "el-row": Row,
    "el-col": Col,
    "el-date-picker": DatePicker,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-pagination": Pagination,
    "el-select": Select,
    "el-option":Option,
    "my-query-item": QueryItem,
    "my-table-operate": TableOperate,
    "global-province": GlobalProvince
  },
  data() {
    return {
      fixDateOptions: Constant.FIX_DATE_RANGE,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE,
      pickerValue: [],
      selectValue: "",
      tagsOptions:[],//运营专区数据
      query: {},
      listItem: [],
      orderClassSumData2: [],
      totalItemTotalPrice: 0,
      totalFramPrice: 0,
      totalOrderModifyPrice: 0,
      totalCount: 0,
      currentRow: {},
      chart: null,
      color: [
        "#E3D557", //1
        "#E9AB67", //2
        "#9C7CDE", //3
        "#C08DDB", //4
        "#819DE0", //5
        "#E081AF", //6
        "#8BC867", //7
        "#B2ABAB", //8
        "#DDB96B", //9
        "#918BAC", //10
        "#8DD29D", //11
        "#D190B1", //12
        "#DAAA96", //13
        "#C7BF94", //14
        "#9AA4CC", //15
        "#C29E9E", //16
        "#66BFD5", //17
        "#C7DE68", //18
        "#DF6666", //19
        "#67C8A9" //20
      ]
    };
  },
  created() {
    documentTitle("统计 - 商品销售统计");
    this.initQuery();
    this.getTagsOptions()
  },
  mounted() {
    this.saleClassList(() => {
      this.initChart();
    });
  },
  methods: {
    //选择区域后【页面初始化】
    selectProvince(data) {
      this.$data.query.province_code = data.code;
      this.saleClassList(() => {
        this.initChart();
      });
    },
    cellMouseEnter(row, column, cell, event) {
      if (row.id !== this.$data.currentRow.id) {
        this.$data.currentRow = row;
      }
    },

    cellMouseLeave(row, column, cell, event) {
      this.$data.currentRow = {};
    },

    isEllipsis(row) {
      return row.id != this.$data.currentRow.id ? "add-dot" : "";
    },
    highlightRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "stripe-row";
      } else if (rowIndex % 2 != 0) {
        return "default-row";
      }
      return "";
    },
    indexMethod(index) {
      return (
        (this.$data.query.page - 1) * this.$data.query.page_size + index + 1
      );
    },
    returnPrice(price) {
      return DataHandle.returnPrice(price);
    },
    //返回百分比
    returnPercentage(item_num, sun) {
      return DataHandle.returnPercentage(item_num, sun);
    },
    // 初始化查询对象
    initQuery() {
      let pickerValue = [];
      let tmpDate = DataHandle.getFixDateRange(8);
      let begin_date =
        this.$route.query.begin_date ||
        DataHandle.formatDate(tmpDate[0], "yyyy-MM-dd");
      let end_date =
        this.$route.query.end_date ||
        DataHandle.formatDate(tmpDate[1], "yyyy-MM-dd");

      // let totalItemTotalPrice = this.$data.totalItemTotalPrice
      pickerValue.push(begin_date);
      pickerValue.push(end_date);
      this.$data.pickerValue = pickerValue;
      this.$data.query = Object.assign(this.$data.query, {
        province_code: "",
        begin_date: begin_date,
        end_date: end_date,
        sort: "-amount_real",
        page: 1,
        page_size: Constant.PAGE_SIZE,
        totalItemTotalPrice: this.$route.query.totalItemTotalPrice
      });
    },
    // 改变查询日期
    changePicker(value) {
      if (value && value.length === 2) {
        this.$data.query.begin_date = value[0];
        this.$data.query.end_date = value[1];
      } else {
        this.$data.query.begin_date = "";
        this.$data.query.end_date = "";
      }
      this.$data.query.page = 1;
      this.saleClassList(() => {
        this.initChart();
      });
    },
    onSort({ column, prop, order }) {
      if (order === "ascending") {
        this.query.sort = prop;
      } else if (order === "descending") {
        this.query.sort = "-" + prop;
      } else {
        this.query.sort = "";
      }
      // this.$data.query.page = 1;
      this.saleClassList();
    },

    // 按分类查询列表
    async saleClassList(callback) {
      let that = this;
      let { query } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.statisticalOrderClassSum, query);
      if (res.code === 0) {
        that.$data.listItem = res.data;
        typeof callback === "function" && callback();
      } else {
        this.$message({ title: "提示", message: res.message, type: "error" });
      }
      this.$loading({ isShow: false });
    },
    initChart() {
      let that = this;
      if (!that.$refs.myEchart) {
        return;
      }
      let orderClassSumData = that.$data.listItem;
      let data = new Array(),
        data2 = new Array(),
        dataTemp = { value: 0, name: "其它" },
        dataTemp2 = {},
        totalItemTotalPrice = 0,
        totalFramPrice = 0,
        totalOrderModifyPrice = 0,
        totalCount = 0;
      for (let i = 0; i < orderClassSumData.length; i++) {
        //总数据
        totalItemTotalPrice += orderClassSumData[i].amount_real;
        totalFramPrice += orderClassSumData[i].fram_total_price;
        totalOrderModifyPrice += orderClassSumData[i].check_chg;
      }
      for (let i = 0; i < orderClassSumData.length; i++) {
        //饼图数据
        let percent = orderClassSumData[i].amount_real / totalItemTotalPrice;
        if (
          percent > 0.05 &&
          orderClassSumData[i].item_system_class !== "其它"
        ) {
          data.push({
            value: that.returnPrice(orderClassSumData[i].amount_real),
            name: orderClassSumData[i].item_system_class,
            system_class_code: orderClassSumData[i].system_class_code
          });
        } else {
          dataTemp.value += orderClassSumData[i].amount_real;
        }

        //列表数据
        if (orderClassSumData[i].item_system_class !== "其它") {
          data2.push(orderClassSumData[i]);
        } else {
          dataTemp2 = orderClassSumData[i];
        }

        totalCount += orderClassSumData[i].count_real;
      }
      if (dataTemp.value) {
        data.push({
          value: that.returnPrice(dataTemp.value),
          name: dataTemp.name,
          system_class_code: ""
        });
      }

      if (dataTemp2.item_system_class) {
        data2.push(dataTemp2);
      }

      that.$data.orderClassSumData2 = data2;
      that.$data.totalItemTotalPrice = totalItemTotalPrice;
      that.$data.totalFramPrice = totalFramPrice;
      that.$data.totalOrderModifyPrice = totalOrderModifyPrice;
      that.$data.totalCount = totalCount;
      that.$data.query.totalItemTotalPrice = totalItemTotalPrice;
      let formatter = "{all|{b}：{c}元}  {per|{d}%}";
      let color = that.color;
      if (data && data.length === 0) {
        data.push({ value: "0", name: "暂无数据", system_class_code: "" });
        color = ["#a5a5a5"];
        formatter = "{b}";
      }

      that.chart = echarts.init(that.$refs.myEchart);
      // 把配置和数据放这里
      that.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function(params, ticket, callback) {
            return params.name === "其它" || params.name === "暂无数据"
              ? ""
              : "点击查看详细信息";
          }
        },
        series: [
          {
            name: "商品销售统计",
            type: "pie",
            radius: "70%",
            avoidLabelOverlap: true,
            selectedMode: "single",
            color: color,
            label: {
              normal: {
                formatter: formatter,
                backgroundColor: "#eee",
                padding: [4, 6],
                borderRadius: 3,
                rich: {
                  all: {
                    fontSize: 14
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#334455",
                    padding: [2, 4],
                    borderRadius: 2,
                    fontSize: 14
                  }
                }
              }
            },
            data: data
          }
        ]
      });
      // 防止click触发两次
      that.chart.off("click");
      // 点击饼图事件处理
      that.chart.on("click", function(params) {
        if (params.componentType === "series") {
          if (params.name === "其它" || params.name === "暂无数据") {
            return;
          }
          that.$router.push({
            name: "StatisticMarketClass2",
            query: {
              system_class1: params.name,
              system_class_code1: params.data.system_class_code,
              begin_date: that.query.begin_date,
              end_date: that.query.end_date,
              province_code: that.$data.query.province_code,
              totalItemTotalPrice: that.$data.query.totalItemTotalPrice
            }
          });
        }
      });
    },
    handleShowClassDetail(item) {
      // console.log("query", this.$data.query)
      let that = this;
      this.$router.push({
        name: "StatisticMarketClass2",
        query: {
          system_class1: item.item_system_class,
          system_class_code1: item.system_class_code,
          begin_date: this.query.begin_date,
          end_date: this.query.end_date,
          province_code: this.$data.query.province_code,
          totalItemTotalPrice: this.$data.query.totalItemTotalPrice
        }
      });
    },
    //获取商品运营专区数据
   async getTagsOptions(){
      let that = this
       this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataItemTagsList, {
          province_code: ''
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.tagsOptions = res.data;
          // console.log(this.$data.tagsOptions);
          
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.echart-container {
  margin-bottom: 16px;
  background-color: #fff;
  padding: 16px;
  display: flex;

  .description {
    width: 260px;
  }
}
.title {
  color: inherit;
  padding: 5px 10px 5px 0;
  text-decoration: underline;
  cursor: pointer;
}
.title:hover {
  font-weight: 600;
}
.title-disable {
  color: inherit;
  padding: 5px 10px 5px 0;
}
</style>
