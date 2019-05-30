<template>
  <div>
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

    <div :style="'height:' + (windowHeight - offsetHeight) + 'px; overflow-y: auto;'">
      <!-- 图表 -->
      <div class="echart-container">
        <div :style="{height: '420px', width: '100%'}" ref="myEchart"/>
        <ul class="description">
          <li>订单商品总金额: <span>{{ returnPrice(totalItemTotalPrice) }}</span> 元</li>
          <li>运费总金额: <span>{{ returnPrice(totalAmountDelivery) }}</span> 元</li>
          <li>优惠总金额: <span>-{{ returnPrice(totalBonusPromotion) }}</span> 元</li>
          <li>称重总金额: <span>{{ returnPrice(totalCheckChg) }}</span> 元</li>
          <li>订单应付总金额: <span>{{ returnPrice(totalItemRealPrice) }}</span> 元</li>
          <li>订单总量: <span>{{ totalOrder }}</span> 单</li>
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
          <el-table-column label="片区" prop="zone_title" min-width="120">
            <template slot-scope="scope">
              <a href="javascript:void(0)"
                class="title"
                @click="handleShowZoneDetail(scope.row)"
                v-if="!!scope.row.zone_title && ( auth.isAdmin || auth.StatisticClientZone )"
              >
                {{ scope.row.zone_title || '其它' }}
              </a>
              <div v-else>
                {{ scope.row.zone_title || '其它' }}
              </div>

              <!--{{ scope.row.zone_title || '其它' }}-->
            </template>
          </el-table-column>
          <el-table-column label="订单商品金额" sortable="custom" prop="item_total_price" min-width="130">
            <template slot-scope="scope">
              ￥{{ returnPrice(scope.row.item_total_price) }}
            </template>
          </el-table-column>
          <el-table-column label="运费金额" sortable="custom" prop="amount_delivery" min-width="100">
            <template slot-scope="scope">
              ￥{{ returnPrice(scope.row.amount_delivery) }}
            </template>
          </el-table-column>
          <el-table-column label="优惠金额" sortable="custom" prop="bonus_promotion" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.bonus_promotion > 0 ? '-￥' : '￥' }}{{ returnPrice(scope.row.bonus_promotion) }}
            </template>
          </el-table-column>
          <el-table-column label="称重金额" prop="check_chg" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.check_chg === 0">￥0</span>
              <span class="color-red" v-else-if="scope.row.check_chg > 0">￥{{ returnPrice(scope.row.check_chg) }}</span>
              <span class="color-green" v-else>-￥{{ returnPrice(Math.abs(scope.row.check_chg)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单应付金额" sortable="custom" prop="real_price" min-width="130">
            <template slot-scope="scope">
              ￥{{ returnPrice(scope.row.real_price) }}
            </template>
          </el-table-column>
          <el-table-column label="订单量" sortable="custom" prop="order_count"  min-width="100"/>
          <el-table-column label="件数" sortable="custom" prop="piece_num" min-width="100"></el-table-column>
          <el-table-column label="占比" prop="percent">
            <template slot-scope="scope">
              {{returnPercentage(scope.row.item_total_price, totalItemTotalPrice)}}%
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                :list="[
                  {
                    title: '查看',
                    isDisplay: !!scope.row.zone_title && ( auth.isAdmin || auth.StatisticClientZone ),
                    command: () => handleShowZoneDetail(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Row, Col, DatePicker, Table, TableColumn, Pagination } from 'element-ui';
  import { QueryItem, TableOperate } from '@/common';
  import { Statistic } from '@/service';
  import { DataHandle, Constant } from '@/util';

  import echarts from "echarts/lib/echarts";
  import "echarts/lib/chart/pie";
  import 'echarts/lib/component/tooltip';

  export default {
    name: "Client",
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
    computed: mapGetters({
      auth: 'globalAuth',
      province: 'globalProvince',
      windowHeight: 'windowHeight'
    }),
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE,
        pickerValue: [],
        query: { },
        areaType: 'zone',
        listItem: [],
        orderClassSumData2: [],
        totalItemTotalPrice: 0,
        totalAmountDelivery: 0,
        totalBonusPromotion: 0,
        totalCheckChg: 0,
        totalItemRealPrice: 0,
        totalOrder: 0,
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
      this.zoneOrderList(() => {
        this.initChart();
      });
    },
    methods: {
      ...mapActions(['message', 'loading']),
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
          province_code: this.province.code,
          begin_date: begin_date,
          end_date: end_date,
          sort: '-item_total_price',
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
        this.zoneOrderList(() => {
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
        this.zoneOrderList();
      },

      //统计分析 - 商品销售统计 - 片区分类统计
      async zoneOrderList(callback){
        let that = this;
        let { query } = that;
        that.loading({isShow: true, isWhole: true});
        let res = await Statistic.statisticalOrderGradeSum(query);
        if(res.code === 0){
          that.$data.listItem = res.data;
          typeof callback === 'function' && callback();
        }else{
          that.message({title: '提示', message: res.message, type: 'error'});
        }
        that.loading({isShow: false });
      },
      initChart() {
        let that = this;
        if (!that.$refs.myEchart) {
          return
        }

        let { areaType } = that;
        let orderClassSumData = that.$data.listItem;

        let data = new Array(), data2 = new Array(), dataTemp = {value: 0, name: '其它'}, dataTemp2 = {},
        totalItemTotalPrice = 0, totalAmountDelivery = 0, totalBonusPromotion = 0, totalCheckChg = 0, totalItemRealPrice = 0, totalOrder = 0, totalPiece = 0;

        for (let i = 0; i < orderClassSumData.length; i++) {
          //总数据
          totalItemTotalPrice += orderClassSumData[i].item_total_price;
          totalAmountDelivery += orderClassSumData[i].amount_delivery;
          totalBonusPromotion += orderClassSumData[i].bonus_promotion;
          totalCheckChg += orderClassSumData[i].check_chg;
          totalItemRealPrice += orderClassSumData[i].real_price;
        }

        for(let i = 0; i < orderClassSumData.length; i++){

          //饼图数据
          let percent = orderClassSumData[i].item_total_price / totalItemTotalPrice;
          if(percent > 0.05 && (areaType === 'zone' ? orderClassSumData[i].zone_title : orderClassSumData[i].city_title) !== '其它'){
            data.push({
              value: that.returnPrice(orderClassSumData[i].item_total_price),
              name: (areaType === 'zone' ? orderClassSumData[i].zone_title : orderClassSumData[i].city_title),
              code: (areaType === 'zone' ? orderClassSumData[i].zone_code : orderClassSumData[i].city_code)
            });
          }else{
            dataTemp.value += orderClassSumData[i].item_total_price;
          }

          totalOrder += orderClassSumData[i].order_count;
          totalPiece += orderClassSumData[i].piece_num;
        }

        if(dataTemp.value) {
          data.push({
            value: that.returnPrice(dataTemp.value),
            name: dataTemp.name
          });
        }
        that.$data.totalItemTotalPrice = totalItemTotalPrice;
        that.$data.totalAmountDelivery = totalAmountDelivery;
        that.$data.totalBonusPromotion = totalBonusPromotion;
        that.$data.totalCheckChg = totalCheckChg;
        that.$data.totalItemRealPrice = totalItemRealPrice;
        that.$data.totalOrder = totalOrder;
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
          console.log("params", params);
          if (params.componentType === 'series') {
            if (params.name === '其它' || params.name === '暂无数据') {
              return;
            }

            that.$router.push({
              path: '/statistic/client/zone',
              query: {
                zone_code: params.data.code,
                zone_title: params.data.name,
                begin_date: that.$data.query.begin_date,
                end_date: that.$data.query.end_date
              }
            });

          }
        });
      },
      handleShowZoneDetail(item) {
        let zone_code = item.zone_code;
        let zone_title = item.zone_title;
        this.$router.push({
          path: '/statistic/client/zone',
          query: {
            zone_code: zone_code,
            zone_title: zone_title,
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
