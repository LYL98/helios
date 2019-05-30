<template>
  <div>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/client', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          客户订单统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.zone_code === '' ? '全部片区' : query.zone_title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query" style="margin-bottom: 20px;">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="时间">
            <el-date-picker
              size="small"
              v-model="pickerValue"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              unlink-panels
              :picker-options="fixDateOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changePicker"
              class="query-item-date"
              :clearable="false"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="片区">
            <my-select-zone
              :value="query.zone_code"
              :provinceCode="query.province_code"
              :clearable="false"
              size="small"
              :showAll="true"
              @change="changeZone"
              @changeTitle="changeZoneTitle"
              class="query-item-select"
              :isUseToQuery="true"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem"
        :row-class-name="highlightRowClassName"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        @sort-change="onSort"
      >
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <!-- 县域、订单金额、订单量、件数、占比、操作 -->
        <el-table-column label="县域" prop="city_title">
          <template slot-scope="scope">
            <!--{{ scope.row.city_title }}-->

            <a href="javascript:void(0)"
               class="title"
               @click="handleShowClassDetail(scope.row)"
               v-if="auth.isAdmin || auth.StatisticClientZoneStore"
            >
              {{ scope.row.city_title }}
            </a>
            <div v-else>
              {{ scope.row.city_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="item_total_price" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.item_total_price) }}
          </template>
        </el-table-column>
        <el-table-column label="运费金额" sortable="custom" prop="amount_delivery">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_delivery) }}
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" sortable="custom" prop="bonus_promotion">
          <template slot-scope="scope">
            {{ scope.row.bonus_promotion > 0 ? '-￥' : '￥' }}{{ returnPrice(scope.row.bonus_promotion) }}
          </template>
        </el-table-column>
        <el-table-column label="称重金额" sortable="custom" prop="check_chg">
          <template slot-scope="scope">
            <span v-if="scope.row.check_chg === 0">￥0</span>
            <span class="color-red" v-else-if="scope.row.check_chg > 0">￥{{ returnPrice(scope.row.check_chg) }}</span>
            <span class="color-green" v-else>-￥{{ returnPrice(Math.abs(scope.row.check_chg)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单应付金额" sortable="custom" prop="real_price" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.real_price) }}
          </template>
        </el-table-column>
        <el-table-column label="订单量" sortable="custom" prop="order_count">
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="piece_num"/>
        <el-table-column label="占比" prop="percent">
          <template slot-scope="scope">
            {{returnPercentage(scope.row.item_total_price, total)}}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: auth.isAdmin || auth.StatisticClientZoneStore,
                  command: () => handleShowClassDetail(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, TableOperate, SelectZone } from '@/common';
  import { Statistic } from '@/service';
  import { DataHandle, Constant } from '@/util';

  export default {
    name: "ClientZone",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-breadcrumb': Breadcrumb,
      'el-breadcrumb-item': BreadcrumbItem,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-select-zone': SelectZone
    },
    computed: mapGetters({
      auth: 'globalAuth',
      province: 'globalProvince',
      windowHeight: 'windowHeight'
    }),
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE,
        pickerValue: [],
        breadcrumb: {},
        query: { },
        listItem: [],
        currentRow: {},
        total: 0
      }
    },
    created() {
      documentTitle("统计 - 客户订单统计");
      this.initBreadcrumb();
      this.initQuery();
      this.zoneCityOrderList();
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

      onSort({ column, prop, order }) {
        switch (prop) {
          case 'item_total_price':
            if (order === 'ascending') {
              this.query.sort = 'item_total_price'
            } else if (order === 'descending') {
              this.query.sort = '-item_total_price'
            } else {
              this.query.sort = ''
            }
            break;
          case 'amount_delivery':
            if (order === 'ascending') {
              this.query.sort = 'amount_delivery'
            } else if (order === 'descending') {
              this.query.sort = '-amount_delivery'
            } else {
              this.query.sort = ''
            }
            break;
          case 'bonus_promotion':
            if (order === 'ascending') {
              this.query.sort = 'bonus_promotion'
            } else if (order === 'descending') {
              this.query.sort = '-bonus_promotion'
            } else {
              this.query.sort = ''
            }
            break;
          case 'check_chg':
            if (order === 'ascending') {
              this.query.sort = 'check_chg'
            } else if (order === 'descending') {
              this.query.sort = '-check_chg'
            } else {
              this.query.sort = ''
            }
            break;
          case 'order_count':
            if (order === 'ascending') {
              this.query.sort = 'order_count'
            } else if (order === 'descending') {
              this.query.sort = '-order_count'
            } else {
              this.query.sort = ''
            }
            break;
          case 'piece_num':
            if (order === 'ascending') {
              this.query.sort = 'piece_num'
            } else if (order === 'descending') {
              this.query.sort = '-piece_num'
            } else {
              this.query.sort = ''
            }
            break;
        }
        // this.$data.query.page = 1;
        this.zoneCityOrderList();
      },

      initBreadcrumb() {
        let zone_code = this.$route.query.zone_code;
        let zone_title = this.$route.query.zone_title;
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          zone_code: zone_code,
          zone_title: zone_title,
          begin_date: begin_date,
          end_date: end_date
        })
      },
      initQuery() {
        // console.log("当前的请求参数", this.$route.query);
        let pickerValue = [];
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        pickerValue.push(begin_date);
        pickerValue.push(end_date);
        this.$data.pickerValue = pickerValue;
        this.$data.query = Object.assign(this.$data.query, {
          province_code: this.province.code,
          begin_date: begin_date,
          end_date: end_date,
          sort: '-amount_real',
          zone_code: this.$route.query.zone_code,
          zone_title: this.$route.query.zone_title,
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
        this.zoneCityOrderList();
      },
      changeZone(data, isInit) {
        if (!isInit) {
          // console.log("改变片区", data);
          this.$data.query.zone_code = data;
          this.zoneCityOrderList();
        }
      },
      changeZoneTitle(title, isInit) {
        if (!isInit) {
          // console.log('changeZoneTitle', title)
          this.$data.query.zone_title = title
        }
      },
      changePage(page) {
        this.$data.query.page = page;
        this.zoneCityOrderList();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.zoneCityOrderList();
      },
      // 获取商品分类列表
      async zoneCityOrderList(callback) {
        let that = this;
        let { query } = that;
        that.loading({isShow: true, isWhole: true});
        let res = await Statistic.statisticalOrderCitySum(query);
        if(res.code === 0){
          this.total = 0
          res.data.map(item => {
            this.total += item.item_total_price
          })
          that.$data.listItem = res.data;
          typeof callback === 'function' && callback();
        }else{
          that.message({title: '提示', message: res.message, type: 'error'});
        }
        that.loading({isShow: false });
      },
      handleShowClassDetail(item) {
        this.$router.push({
          path: '/statistic/client/zone/store',
          query: {
            city_code: item.city_code,
            city_title: item.city_title,
            zone_code: this.$data.query.zone_code,
            zone_title: this.$data.query.zone_title,
            begin_date: this.$data.query.begin_date,
            end_date: this.$data.query.end_date
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
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
