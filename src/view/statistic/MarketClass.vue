<template>
  <div>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/market', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date } }"
        >
          商品销售统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.display_class === '' ? '全部分类' : query.display_class }}</el-breadcrumb-item>
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
          <my-query-item label="分类">
            <my-select-display-class
              v-model="query.display_class"
              :use-name="true"
              v-on:change="changeQuery"
              :isUseToQuery="true"
              :hasAllSelection="true"
              size="small"
              :clearable="false"
              class="query-item-select"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="采购员">
            <my-select-buyer
              :provinceCode="query.province_code"
              v-model="query.buyer_id"
              v-on:change="changeQuery"
              :isUseToQuery="true"
              size="small"
              :clearable="false"
              class="query-item-select"
              :hasAllSelection="true"
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
        :data="listItem.items"
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
        <el-table-column label="商品" prop="item_display_class">
          <template slot-scope="scope">
            <a href="javascript:void(0)"
               class="title"
               @click="handleShowClassDetail(scope.row)"
               v-if="auth.isAdmin || auth.StatisticMarketClassItem"
            >
              {{ scope.row.code }} / {{ scope.row.title }}
            </a>
            <div v-else>
              {{ scope.row.code }} / {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类/采购员">
          <template slot-scope="scope">
            {{ scope.row.display_class_title || '' }} / {{ scope.row.buyer && scope.row.buyer.realname }}
          </template>
        </el-table-column>
        <el-table-column label="金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">
            {{ scope.row.amount_real > 0 ? '￥' : '' }}{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="count_real"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: auth.isAdmin || auth.StatisticMarketClassItem,
                  command: () => handleShowClassDetail(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
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
  import { mapGetters, mapActions } from 'vuex';
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem, Button } from 'element-ui';
  import { QueryItem, TableOperate, SelectBuyer, SelectDisplayClass } from '@/common';
  import { Statistic } from '@/service';
  import { DataHandle, Constant } from '@/util';

  export default {
    name: "MarketClass",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-breadcrumb': Breadcrumb,
      'el-breadcrumb-item': BreadcrumbItem,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-button': Button,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-select-buyer': SelectBuyer,
      'my-select-display-class': SelectDisplayClass
    },
    computed: mapGetters({
      auth: 'globalAuth',
      province: 'globalProvince',
      windowHeight: 'windowHeight'
    }),
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        pickerValue: [],
        breadcrumb: {},
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
      this.saleClassItemQuery();
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
      initBreadcrumb() {
        let display_class = this.$route.query.display_class;
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          display_class: display_class,
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
          sort: '-amount_real',
          buyer_id: '',
          display_class: this.$route.query.display_class === '全部分类' ? '' : this.$route.query.display_class,
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
        this.saleClassItemQuery();
      },
      changeQuery() {
        this.saleClassItemQuery();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.saleClassItemQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.saleClassItemQuery();
      },
      onSort({ column, prop, order }) {
        switch (prop) {
          case 'amount_real':
            if (order === 'ascending') {
              this.query.sort = 'amount_real'
            } else if (order === 'descending') {
              this.query.sort = '-amount_real'
            } else {
              this.query.sort = ''
            }
            break;
          case 'count_real':
            if (order === 'ascending') {
              this.query.sort = 'count_real'
            } else if (order === 'descending') {
              this.query.sort = '-count_real'
            } else {
              this.query.sort = ''
            }
            break;
        }
        // this.$data.query.page = 1;
        this.saleClassItemQuery();
      },
      resetQuery() {
        this.initQuery();
        this.saleClassItemQuery();
      },
      // 获取商品分类列表
      async saleClassItemQuery() {
        let that = this;
        let { query } = that;
        that.loading({isShow: true, isWhole: true});
        let res = await Statistic.statisticalOrderItemSum(query);
        if(res.code === 0){
          that.$data.listItem = res.data;
        }else{
          that.message({title: '提示', message: res.message, type: 'error'});
        }
        that.loading({isShow: false });
      },
      handleShowClassDetail(item) {
        this.$router.push({
            path: '/statistic/market/class/item',
          query: {
            item_id: item.id,
            item_title: item.title,
            display_class: this.$data.query.display_class === '' ? '全部分类' : this.$data.query.display_class,
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
