<template>
  <div>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/market', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          商品销售统计
        </el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ path: '/statistic/market/class', query: { display_class: breadcrumb.display_class, begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          {{ breadcrumb.display_class }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumb.item_title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query" style="margin-bottom: 20px;">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="片区">
            <my-select-zone
              v-model="query.zone_code"
              :provinceCode="query.province_code"
              clearable
              size="small"
              @change="changeQuery"
              class="query-item-select"
              :isUseToQuery="true"
              :showAll="true"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="所在仓">
            <my-select-city
              size="small"
              :isUseToQuery="true"
              placeholder="所在仓"
              clearable
              v-model="query.city_code"
              :provinceCode="query.province_code"
              :zoneCode="query.zone_code"
              @change="changeQuery"
              class="query-item-select"
              :showAll="true"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <div style="display: flex">
            <el-input
              size="small"
              class="query-item-input"
              placeholder="请输入门店名称、电话"
              v-model="query.condition"
              clearable
              @keyup.enter.native="changeQuery"
              @clear="changeQuery"
              ref="condition"
            />
            <el-button size="small" type="primary" @click="changeQuery" style="margin-left: 4px" icon="el-icon-search"></el-button>
            <el-button size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem.items"
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
        <el-table-column label="门店" prop="store_title">
          <template slot-scope="scope">
            {{ scope.row.store_title || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="item_total_price">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.item_total_price) }}
          </template>
        </el-table-column>
        <el-table-column label="称重金额" prop="check_chg">
          <template slot-scope="scope">
            <span v-if="scope.row.check_chg === 0">￥0</span>
            <span class="color-red" v-else-if="scope.row.check_chg > 0">￥{{ returnPrice(scope.row.check_chg) }}</span>
            <span class="color-green" v-else>-￥{{ returnPrice(Math.abs(scope.row.check_chg)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="称重后商品金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="count_real" />
      </el-table>
    </div>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="listItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Input, Button, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, SelectZone, SelectCity } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "MarketClassItem",
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
      'el-input': Input,
      'el-button': Button,
      'my-query-item': QueryItem,
      'my-select-zone': SelectZone,
      'my-select-city': SelectCity,
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        pickerValue: [],
        breadcrumb: { },
        query: { },
        listItem: {
          num: 0,
          items: []
        },
        currentRow: {}
      }
    },
    created() {
      documentTitle("统计 - 商品销售统计");
      this.initBreadcrumb();
      this.initQuery();
      this.saleClassItemStoreQuery();
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
      initBreadcrumb() {
        let display_class = this.$route.query.display_class;
        let item_title = this.$route.query.item_title;
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          display_class: display_class,
          item_title: item_title,
          begin_date: begin_date,
          end_date: end_date
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
          sort: '-item_total_price',
          item_id: this.$route.query.item_id,
          zone_code: '',
          city_code: '',
          condition: '',
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
        this.saleClassItemStoreQuery();
      },

      changeQuery() {
        this.saleClassItemStoreQuery();
      },

      resetQuery() {
        this.initQuery();
        this.$refs['condition'].currentValue = '';
        this.saleClassItemStoreQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.saleClassItemStoreQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.saleClassItemStoreQuery();
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
        this.saleClassItemStoreQuery();
      },

      // 获取商品分类列表
      async saleClassItemStoreQuery() {
        let that = this;
        let { query } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderItemSaleStores, query);
        if(res.code === 0){
          res.data.items.map((item, index) => {
            item.id = index;
          });
          that.$data.listItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
