<template>
  <sub-menu>
    <!-- 查询 -->
    <div class="query" style="margin-bottom: 16px;">
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
          @change="changePicker">
        </el-date-picker>
      </my-query-item>
    </div>

    <div :style="'height:' + (viewWindowHeight - offsetHeight) + 'px; overflow-y: auto;'">
      <!-- 图表 -->
      <div class="echart-container">
        <div :style="{height: '420px', width: '100%'}" ref="myEchart"/>
        <ul class="description">
          <li>GMV: <span>{{ returnPrice(totalItemTotalPrice) }}</span> 元</li>
          <li>订单商品金额: <span>{{ returnPrice(totalOrderItemPrice) }}</span> 元</li>
          <li>筐总金额: <span>{{ returnPrice(totalFramPrice) }}</span> 元</li>
          <li>优惠总金额: <span>-{{ returnPrice(totalBonusPromotion) }}</span> 元</li>
          <li>下单门店数: <span>{{ totalOrderMerchantNum }}</span> 个</li>
          <li>总件数: <span>{{ totalPiece }}</span> 件</li>
        </ul>
      </div>

      <!-- 列表 -->
      <div>
        <el-table
          class="list-table"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :data="listItem"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          @sort-change="onSort"
        >
          <!-- 片区、订单金额、订单量、件数、占比、操作 -->
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          />
          <el-table-column label="区域" prop="province_title" min-width="120">
            <template slot-scope="scope">
              <a href="javascript:void(0)"
                class="title"
                @click="handleShowZoneDetail(scope.row)"
                v-if="!!scope.row.province_title && ( auth.isAdmin || auth.StatisticClientProvince )"
              >
                {{ scope.row.province_title || '其它' }}
              </a>
              <div v-else>
                {{ scope.row.province_title || '其它' }}
              </div>

              <!--{{ scope.row.zone_title || '其它' }}-->
            </template>
          </el-table-column>
          <el-table-column label="GMV" sortable="custom" prop="gmv" min-width="130">
            <template slot-scope="scope">
              ￥{{ returnPrice(scope.row.gmv) }}
            </template>
          </el-table-column>
          <el-table-column label="订单商品金额" sortable="custom" prop="real_price" min-width="130">
            <template slot-scope="scope">
              ￥{{ returnPrice(scope.row.amount_real) }}
            </template>
          </el-table-column>
          <el-table-column label="下单门店数" sortable="custom" prop="store_num"  min-width="100"/>
          <el-table-column label="件数" sortable="custom" prop="piece_num" min-width="100"></el-table-column>
          <el-table-column label="占比" prop="percent">
            <template slot-scope="scope">
              {{returnPercentage(scope.row.gmv, totalItemTotalPrice)}}%
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                :list="[
                  {
                    title: '查看',
                    isDisplay: !!scope.row.province_title && ( auth.isAdmin || auth.StatisticClientProvince ),
                    command: () => handleShowZoneDetail(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </sub-menu>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination } from 'element-ui';
  import { QueryItem, TableOperate } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  import echarts from "echarts/lib/echarts";
  import "echarts/lib/chart/pie";
  import 'echarts/lib/component/tooltip';

  export default {
    name: "Client",
    mixins: [mainMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE,
        pickerValue: [],
        query: { },
        areaType: 'province',
        listItem: [],
        orderClassSumData2: [],
        totalItemTotalPrice: 0,
        totalBonusPromotion: 0,
        totalOrderItemPrice: 0,
        totalFramPrice: 0,
        totalOrderMerchantNum: 0,
        totalPiece: 0,
        currentRow: {},
        chart: null,
        color: [
          '#E3D557',   //1
          '#E9AB67',   //2
          '#9C7CDE',   //3
          '#C08DDB',   //4
          '#819DE0',   //5
          '#E081AF',   //6
          '#8BC867',   //7
          '#B2ABAB',   //8
          '#DDB96B',   //9
          '#918BAC',   //10
          '#8DD29D',   //11
          '#D190B1',   //12
          '#DAAA96',   //13
          '#C7BF94',   //14
          '#9AA4CC',   //15
          '#C29E9E',   //16
          '#66BFD5',   //17
          '#C7DE68',   //18
          '#DF6666',   //19
          '#67C8A9'    //20
        ],
      }
    },
    created() {
      documentTitle("统计 - 客户订单统计");
      this.initQuery();
    },
    mounted() {
      this.provinceOrderList(() => {
        this.initChart();
      });
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
        return row.id != this.$data.currentRow.id ? 'add-dot' : ''
      },
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      indexMethod(index) {
        return (this.$data.query.page - 1) * this.$data.query.page_size + index + 1;
      },
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      //返回百分比
      returnPercentage(item_num, sun){
        return DataHandle.returnPercentage(item_num, sun);
      },
      // 初始化查询对象
      initQuery() {
        let pickerValue = [];
        let tmpDate = DataHandle.getFixDateRange(8)
        let begin_date = this.$route.query.begin_date || DataHandle.formatDate(tmpDate[0], 'yyyy-MM-dd');
        let end_date = this.$route.query.end_date || DataHandle.formatDate(tmpDate[1], 'yyyy-MM-dd');

        pickerValue.push(begin_date);
        pickerValue.push(end_date);
        this.$data.pickerValue = pickerValue;
        this.$data.query = Object.assign(this.$data.query, {
          province_code: "",
          begin_date: begin_date,
          end_date: end_date,
          sort: '-gmv',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },
      // 改变查询日期
      changePicker(value) {
        if(value && value.length === 2){
          this.$data.query.begin_date = value[0];
          this.$data.query.end_date = value[1];
        }else{
          this.$data.query.begin_date = '';
          this.$data.query.end_date = '';
        }
        this.$data.query.page = 1;
        this.provinceOrderList(() => {
          this.initChart();
        });
      },

      onSort({ column, prop, order }) {
        if (order === 'ascending') {
          this.query.sort = prop;
        } else if (order === 'descending') {
          this.query.sort = '-' + prop
        } else {
          this.query.sort = ''
        }
        // this.$data.query.page = 1;
        this.provinceOrderList();
      },

      // //统计分析 - 商品销售统计 - 省份分类统计
      // async zoneOrderList(callback){
      //   let that = this;
      //   let { query } = that;
      //   this.$loading({ isShow: true, isWhole: true });
      //   let res = await Http.get(Config.api.statisticalOrderGradeSum, query);
      //   if(res.code === 0){
      //     that.$data.listItem = res.data;
      //     typeof callback === 'function' && callback();
      //   }else{
      //     this.$message({title: '提示', message: res.message, type: 'error'});
      //   }
      //   this.$loading({ isShow: false });
      // },

      async provinceOrderList(callback) {
        let that = this;
        let { query } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderProvinceSum, query);
        if(res.code === 0){
          that.$data.listItem = res.data;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },

      initChart() {
        let that = this;
        if (!that.$refs.myEchart) {
          return
        }

        let { areaType } = that;
        let orderClassSumData = that.$data.listItem;

        let data = new Array(), data2 = new Array(), dataTemp = {value: 0, name: '其它'}, dataTemp2 = {},
        totalItemTotalPrice = 0, totalBonusPromotion = 0, totalOrderItemPrice = 0, totalFramPrice = 0, totalOrderMerchantNum = 0, totalPiece = 0;

        // 总计字段
        for (let i = 0; i < orderClassSumData.length; i++) {
          // 总数据
          totalItemTotalPrice += orderClassSumData[i].gmv;
          totalBonusPromotion += orderClassSumData[i].bonus_promotion;
          totalOrderItemPrice += orderClassSumData[i].amount_real;
          totalFramPrice += orderClassSumData[i].fram_total_price;
        }

        // 饼图占比数据
        for(let i = 0; i < orderClassSumData.length; i++){
          let percent = orderClassSumData[i].gmv / totalItemTotalPrice;
          if(percent > 0.05 && this.chartTitle(orderClassSumData[i]) !== '其它'){
            data.push({
              value: that.returnPrice(orderClassSumData[i].gmv),
              name: this.chartTitle(orderClassSumData[i]),
              code: this.dataCode(orderClassSumData[i])
            });
          }else{
            dataTemp.value += orderClassSumData[i].gmv;
          }

          totalOrderMerchantNum += orderClassSumData[i].store_num;
          totalPiece += orderClassSumData[i].piece_num;
        }

        if(dataTemp.value) {
          data.push({
            value: that.returnPrice(dataTemp.value),
            name: dataTemp.name
          });
        }
        that.$data.totalItemTotalPrice = totalItemTotalPrice;
        that.$data.totalBonusPromotion = totalBonusPromotion;
        that.$data.totalOrderItemPrice = totalOrderItemPrice;
        that.$data.totalFramPrice = totalFramPrice;
        that.$data.totalOrderMerchantNum = totalOrderMerchantNum;
        that.$data.totalPiece = totalPiece;

        that.chart = echarts.init(that.$refs.myEchart);

        let formatter = "{all|{b}：{c}元}  {per|{d}%}";
        let color = that.color;
        if (data && data.length === 0) {
          data.push({value: '0', name: '暂无数据'});
          color = ['#a5a5a5'];
          formatter = "{b}";
        }

        // 把配置和数据放这里
        that.chart.setOption({
          tooltip : {
            trigger: 'item',
            formatter: function (params,ticket,callback) {
              return params.name === '其它' || params.name === '暂无数据' ? '' : '点击查看详细信息';
            }
          },
          series: [
            {
              name: "客户订单统计",
              type: "pie",
              radius : '70%',
              selectedMode: 'single',
              avoidLabelOverlap: true,
              color: color,
              label: {
                normal: {
                  formatter: formatter,
                  backgroundColor: "#eee",
                  padding: [4, 6],
                  borderRadius: 3,
                  rich: {
                    all: {
                      fontSize: 16
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
        that.chart.off('click');
        // 点击饼图事件处理
        that.chart.on('click', function (params) {
          if (params.componentType === 'series') {
            if (params.name === '其它' || params.name === '暂无数据') {
              return;
            }

            that.$router.push({
              path: '/statistic/client/province',
              query: {
                province_code: params.data.code,
                province_title: params.data.name,
                begin_date: that.$data.query.begin_date,
                end_date: that.$data.query.end_date
              }
            });

          }
        });
      },

      chartTitle(data) {
        switch (this.$data.areaType) {
          case "province":
            return data.province_title
          case "zone":
            return data.zone_title
          default:
            return ""
        }
      },

      dataCode(data) {
        switch (this.$data.areaType) {
          case "province":
            return data.province_code
          case "zone":
            return data.zone_id
          default:
            return -1
        }
      },

      handleShowZoneDetail(item) {
        let province_code = item.province_code;
        let province_title = item.province_title;
        this.$router.push({
          path: '/statistic/client/province',
          query: {
            province_code: province_code,
            province_title: province_title,
            begin_date: this.$data.query.begin_date,
            end_date: this.$data.query.end_date
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dot {
    width: 10px;
    height: 10px;
    background: red;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  .echart-container {
    margin-bottom: 16px;
    background-color: #FFF;
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
