<template>
  <sub-menu>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item :to="{ name: 'StatisticMarket', query: { province_code: query.province_code, begin_date: query.begin_date, end_date: query.end_date, totalItemTotalPrice:query.totalItemTotalPrice} }">
          商品销售统计
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'StatisticMarketClass2', query: {
            totalItemTotalPrice:query.totalItemTotalPrice,
            province_code: query.province_code,
            begin_date: query.begin_date,
            end_date: query.end_date,
            system_class1: query.system_class1,
            system_class_code1: query.system_class_code1,

        }}">
          {{ query.system_class1 === '' ? '全部分类' : query.system_class1 }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'StatisticMarketClass3', query: {
            totalItemTotalPrice:query.totalItemTotalPrice,

            province_code: query.province_code,
            begin_date: query.begin_date,
            end_date: query.end_date,
            system_class1: query.system_class1,
            system_class_code1: query.system_class_code1,
            system_class2: query.system_class2,
            system_class_code2: query.system_class_code2,
        }}">
          {{ query.system_class2 === '' ? '全部分类' : query.system_class2 }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'StatisticMarketClassItem', query: {
            totalItemTotalPrice:query.totalItemTotalPrice,
            province_code: query.province_code,
            begin_date: query.begin_date,
            end_date: query.end_date,
            system_class1: query.system_class1,
            system_class_code1: query.system_class_code1,
            system_class2: query.system_class2,
            system_class_code2: query.system_class_code2,
            system_class3: query.system_class3,
            system_class_code3: query.system_class_code3,
        }}">
          {{ query.system_class3 === '' ? '全部分类' : query.system_class3 }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.item_title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query" style="margin-bottom: 20px;">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="片区">
            <my-select-zone
              v-model="query.zone_id"
              :provinceCode="query.province_code"
              clearable
              size="small"
              @change="changeQuery"
              class="query-item-select"
              :showAll="true"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="县域">
            <my-select-city
              size="small"
              placeholder="县域"
              clearable
              v-model="query.city_id"
              :provinceCode="query.province_code"
              :zoneId="query.zone_id"
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
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real">
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
  </sub-menu>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Input, Button, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, SelectZone, SelectCity } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "MarketClassItem",
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
        currentRow: {},
        totalItemTotalPrice: 0,

      }
    },
    created() {
      documentTitle("统计 - 商品销售统计");
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
      //初始化参数
      initQuery() {
        let q = this.$route.query;
        this.$data.pickerValue = [q.begin_date, q.end_date];
        this.$data.query = {
          totalItemTotalPrice:q.totalItemTotalPrice,
          province_code: q.province_code,
          begin_date: q.begin_date,
          end_date: q.end_date,
          sort: '-amount_real',
          item_id: q.item_id,
          item_title: q.item_title,
          system_class1: q.system_class1,
          system_class_code1: q.system_class_code1,
          system_class2: q.system_class2,
          system_class_code2: q.system_class_code2,
          system_class3: q.system_class3,
          system_class_code3: q.system_class_code3,
          zone_id: '',
          city_id: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
        this.$data.totalItemTotalPrice = q.totalItemTotalPrice
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
