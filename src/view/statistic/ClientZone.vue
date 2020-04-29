<template>
  <sub-menu>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/client', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date,total:breadcrumb.total } }"
        >
          客户订单统计
        </el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ path: '/statistic/client/province',
          query: {
          province_code: breadcrumb.province_code,
          province_title: breadcrumb.province_title,
          begin_date: breadcrumb.begin_date,
          end_date: breadcrumb.end_date,
          total:breadcrumb.total } }"
        >
          {{ breadcrumb.province_code === '' ? '全部省份' : breadcrumb.province_title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.zone_id === '' ? '全部片区' : query.zone_title }}</el-breadcrumb-item>
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
              :value="query.zone_id"
              :provinceCode="query.province_code"
              :clearable="false"
              size="small"
              :showAll="true"
              @change="changeZone"
              @changeTitle="changeZoneTitle"
              class="query-item-select"
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
        <el-table-column label="GMV" sortable="custom" prop="gmv" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.gmv) }}
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real" min-width="120">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="下单门店数" sortable="custom" prop="store_num">
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="piece_num"/>
        <el-table-column label="占比" prop="percent">
          <template slot-scope="scope">
            <!-- {{returnPercentage(scope.row.gmv, total)}}% -->
            {{ scope.row.ratio }}%

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
  </sub-menu>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, TableOperate, SelectZone } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "ClientZone",
    mixins: [mainMixin],
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

      onSort({ column, prop, order }) {
        if (order === 'ascending') {
          this.query.sort = prop;
        } else if (order === 'descending') {
          this.query.sort = '-' + prop
        } else {
          this.query.sort = ''
        }
        // this.$data.query.page = 1;
        this.zoneCityOrderList();
      },

      initBreadcrumb() {
        // console.log("this.$route.query", this.$route.query);
        let zone_id = this.$route.query.zone_id;
        let zone_title = this.$route.query.zone_title;
        let province_code = this.$route.query.province_code;
        let province_title = this.$route.query.province_title;
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        let total = this.$route.query.total

        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          zone_id: zone_id,
          zone_title: zone_title,
          province_code: province_code,
          province_title: province_title,
          begin_date: begin_date,
          end_date: end_date,
          total: total
        })
      },
      initQuery() {
        console.log("当前的请求参数", this.$route.query);
        let pickerValue = [];
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        let province_code = this.$route.query.province_code;
        let province_title = this.$route.query.province_title;
        pickerValue.push(begin_date);
        pickerValue.push(end_date);
        this.$data.pickerValue = pickerValue;
        this.$data.query = Object.assign(this.$data.query, {
          begin_date: begin_date,
          end_date: end_date,
          sort: '-gmv',
          zone_id: this.$route.query.zone_id,
          zone_title: this.$route.query.zone_title,
          province_code: province_code,
          province_title: province_title,
          page: 1,
          page_size: Constant.PAGE_SIZE,
          total:this.$route.query.total

        });
        this.$data.total = this.$route.query.total

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
          this.$data.query.zone_id = data;
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
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderCitySum, query);
        if(res.code === 0){
          // this.total = 0
          // res.data.map(item => {
          //   this.total += item.gmv
          // })
          that.$data.listItem = res.data;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
      handleShowClassDetail(item) {
        this.$router.push({
          path: '/statistic/client/zone/store',
          query: {
            city_id: item.city_id,
            city_title: item.city_title,
            zone_id: this.$data.query.zone_id,
            zone_title: this.$data.query.zone_title,
            province_code: this.$data.breadcrumb.province_code,
            province_title: this.$data.breadcrumb.province_title,
            begin_date: this.$data.query.begin_date,
            end_date: this.$data.query.end_date,
            total:this.$data.query.total

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
