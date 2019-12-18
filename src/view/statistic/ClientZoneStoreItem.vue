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

        <el-breadcrumb-item
          :to="{ path: '/statistic/client/zone/store',
            query: {
              city_code: breadcrumb.city_code,
              city_title: breadcrumb.city_title,
              zone_code: breadcrumb.zone_code,
              zone_title: breadcrumb.zone_title,
              begin_date: breadcrumb.begin_date,
              end_date: breadcrumb.end_date }
            }"
        >
          {{ breadcrumb.city_code === '' ? '全部县域' : breadcrumb.city_title }}
        </el-breadcrumb-item>

        <el-breadcrumb-item>{{ query.store_title }}</el-breadcrumb-item>
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
          <my-query-item label="科学分类">
            <my-select-system-class
              v-model="query.system_class_codes"
              :clearable="true"
              size="small"
              @change="changeSystemClass"
            />
            <el-button size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="merchantListData.items"
        :row-class-name="highlightRowClassName"
        :height="viewWindowHeight - offsetHeight"
        :highlight-current-row="true"
        @sort-change="onSort"
      >
        <el-table-column type="index" width="120" label="序号" :index="indexMethod" />
        <!-- 县域、订单金额、订单量、件数、占比、操作 -->
        <el-table-column label="编号/商品" prop="store_title">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.item_code + '/' + scope.row.item_title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="count_real">
          <template slot-scope="scope">
            <span :class="isEllipsis(scope.row)">{{scope.row.count_real}}件</span>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="筐金额" sortable="custom" prop="fram_total_price">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.fram_total_price) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="footer" v-if="merchantListData.num > 0">
        <div class="table-pagination">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="query.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="merchantListData.num">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem, Button } from 'element-ui';
  import { QueryItem, TableOperate, SelectSystemClass } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "ClientZoneStoreItem",
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
      'el-button': Button,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-select-system-class': SelectSystemClass,
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        pickerValue: [],
        breadcrumb: {},
        query: { },
        listItem: [],
        merchantListData: {
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
      this.storeSaleItems();
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

        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          store_id: this.$route.query.store_id,
          store_title: this.$route.query.store_title,
          city_code: this.$route.query.city_code,
          city_title: this.$route.query.city_title,
          zone_code: this.$route.query.zone_code,
          zone_title: this.$route.query.zone_title,
          begin_date: this.$route.query.begin_date,
          end_date: this.$route.query.end_date
        })
      },
      initQuery() {
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
          store_id: this.$route.query.store_id,
          store_title: this.$route.query.store_title,
          zone_code: this.$route.query.zone_code,
          zone_title: this.$route.query.zone_title,
          city_code: this.$route.query.city_code,
          city_title: this.$route.query.city_title,
          system_class: '',
          system_class_codes: [],
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
        this.storeSaleItems();
      },
      //改变科学分类
      changeSystemClass(value, data) {
        this.$data.query.system_class = data.title || '';
        this.storeSaleItems();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.storeSaleItems();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.storeSaleItems();
      },
      resetQuery() {
        this.initQuery();
        // this.$refs['condition'].currentValue = '';
        this.storeSaleItems();
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
        this.storeSaleItems();
      },

      // 获取商品分类列表
      async storeSaleItems(){
        let that = this;
        let { query } = that;
        query.is_gift = 0;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderStoreSaleItems, query);
        if(res.code === 0){
          res.data.items.map((item, index) => {
            item.id = index;
          });
          that.$data.merchantListData = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
