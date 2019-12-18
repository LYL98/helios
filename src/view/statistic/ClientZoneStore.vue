<template>
  <div>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/client', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          客户订单统计
        </el-breadcrumb-item>

        <el-breadcrumb-item
          :to="{ path: '/statistic/client/zone', query: { zone_code: breadcrumb.zone_code, zone_title: breadcrumb.zone_title, begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          {{ breadcrumb.zone_code === '' ? '全部片区' : breadcrumb.zone_title }}
        </el-breadcrumb-item>

        <el-breadcrumb-item>{{ query.city_code === '' ? '全部县域' : query.city_title }}</el-breadcrumb-item>
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
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="县域">
            <my-select-city
              :value="query.city_code"
              :zoneCode="query.zone_code"
              :provinceCode="query.province_code"
              :clearable="false"
              size="small"
              :showAll="true"
              @change="changeCity"
              @changeCityName="changeCityName"
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
        :data="orderItemSumData.items"
        :row-class-name="highlightRowClassName"
        :height="viewWindowHeight - offsetHeight"
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
        <el-table-column label="门店名称" prop="city_title">
          <template slot-scope="scope">
            <!--{{ scope.row.store_title }}-->

            <a href="javascript:void(0)"
               class="title"
               @click="handleShowClassDetail(scope.row)"
               v-if="auth.isAdmin || auth.StatisticClientZoneStoreItem"
            >
              {{ scope.row.store_title }}
            </a>
            <div v-else>
              {{ scope.row.store_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="GMV" sortable="custom" prop="gmv" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.gmv) }}
          </template>
        </el-table-column>
        <el-table-column label="订单应付金额" sortable="custom" prop="real_price" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.real_price) }}
          </template>
        </el-table-column>
        <el-table-column label="框金额" sortable="custom" prop="fram_total_price">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.fram_total_price) }}
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" sortable="custom" prop="bonus_promotion">
          <template slot-scope="scope">
            {{ scope.row.bonus_promotion > 0 ? '-￥' : '￥' }}{{ returnPrice(scope.row.bonus_promotion) }}
          </template>
        </el-table-column>
        <el-table-column label="订单量" sortable="custom" prop="order_count">
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="piece_num"/>
        <el-table-column label="占比" prop="percent">
          <template slot-scope="scope">
            {{returnPercentage(scope.row.gmv, total)}}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: auth.isAdmin || auth.StatisticClientZoneStoreItem,
                  command: () => handleShowClassDetail(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="footer" v-if="orderItemSumData.num > 0">
        <div class="table-pagination">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="query.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="orderItemSumData.num">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, TableOperate, SelectZone, SelectCity } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "ClientZoneStore",
    mixins: [viewMixin],
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
      'my-select-zone': SelectZone,
      'my-select-city': SelectCity
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        pickerValue: [],
        breadcrumb: {},
        query: { },
        listItem: [],
        orderItemSumData: {
          items: []
        },
        currentRow: {},
        total: 0,
      }
    },
    created() {
      documentTitle("统计 - 客户订单统计 - 商户汇总");
      this.initBreadcrumb();
      this.initQuery();
      this.statisticalOrderMerchantSum();
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

      initBreadcrumb() {
        // console.log('store_title', this.$route.query)

        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          city_code: this.$route.query.city_code,
          city_title: this.$route.query.city_title,
          zone_code: this.$route.query.zone_code,
          zone_title: this.$route.query.zone_title,
          begin_date: this.$route.query.begin_date,
          end_date: this.$route.query.end_date
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
          sort: '-gmv',
          zone_code: this.$route.query.zone_code,
          zone_title: this.$route.query.zone_title,
          city_code: this.$route.query.city_code,
          city_title: this.$route.query.city_title,
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
        this.statisticalOrderMerchantSum();
      },
      changeZone(data, isInit) {
        if (!isInit) {
          // console.log("改变片区", data);
          this.$data.query.zone_code = data;
          this.$data.query.city_code = '';
          this.$data.breadcrumb.zone_code = data;
          this.statisticalOrderMerchantSum();
        }
      },
      changeZoneTitle(title, isInit) {
        if (!isInit) {
          // console.log('changeZoneTitle', title)
          this.$data.query.zone_title = title;
          this.$data.breadcrumb.zone_title = title;
        }
      },
      changeCity(data, isInit) {
        if (!isInit) {
          // console.log("改变县域", data);
          this.$data.query.city_code = data;
          this.statisticalOrderMerchantSum();
        }
      },
      changeCityName(cityName) {
        this.$data.query.city_title = cityName;
      },
      changePage(page) {
        this.$data.query.page = page;
        this.statisticalOrderMerchantSum();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.statisticalOrderMerchantSum();
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
        this.statisticalOrderMerchantSum();
      },

      // 获取商品分类列表
      async statisticalOrderMerchantSum(callback) {
        let that = this;
        let { query } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderMerchantSum, query);
        if(res.code === 0){
          this.total = 0
          res.data.items.map(item => {
            this.total += item.gmv
          })

          that.$data.orderItemSumData = res.data;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
      handleShowClassDetail(item) {
        console.log('handleShowClassDetail' , this.$data.query)
        this.$router.push({
          path: '/statistic/client/zone/store/item',
          query: {
            store_id: item.store_id,
            store_title: item.store_title,
            city_code: this.$data.query.city_code,
            city_title: this.$data.query.city_title,
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
