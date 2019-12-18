<template>
  <div>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item :to="{ name: 'StatisticMarket', query: { begin_date: query.begin_date, end_date: query.end_date } }">
          商品销售统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.system_class === '' ? '全部分类' : query.system_class }}</el-breadcrumb-item>
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
          <my-query-item label="一级分类">
            <select-system-class-list
              v-model="query.system_class_code"
              @change="changeSystemClass"
              size="small"
              :clearable="false"
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
        :data="dataItem"
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
        <el-table-column label="二级科学分类" prop="item_system_class">
          <template slot-scope="scope">
            <a href="javascript:void(0)"
              class="title"
              @click="handleShowClassDetail(scope.row)"
              v-if="!!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClass3 )"
            >
              {{ scope.row.item_system_class || '其它' }}
            </a>
            <div v-else>
              {{ scope.row.item_system_class || '其它' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="框金额" sortable="custom" prop="fram_total_price">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.fram_total_price) }}
          </template>
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="count_real" />
        <el-table-column label="占比">
          <template slot-scope="scope">
            {{ returnPercentage(scope.row.amount_real, totalItemTotalPrice) }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: !!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClass3 ),
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
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem, Button } from 'element-ui';
  import { QueryItem, TableOperate, SelectSystemClassList } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "MarketClass",
    mixins: [viewMixin],
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
      'select-system-class-list': SelectSystemClassList
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        totalItemTotalPrice: 0,
        pickerValue: [],
        breadcrumb: {},
        query: {},
        dataItem: [],
        currentRow: {}
      }
    },
    created() {
      documentTitle("统计 - 商品销售统计");
      this.initQuery();
      this.statisticalOrderClassSum();
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
          province_code: this.province.code,
          begin_date: q.begin_date,
          end_date: q.end_date,
          sort: '-amount_real',
          system_class: q.system_class1,
          system_class_code: q.system_class_code1,
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
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
        this.statisticalOrderClassSum();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.statisticalOrderClassSum();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.statisticalOrderClassSum();
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
        this.statisticalOrderClassSum();
      },
      resetQuery() {
        this.initQuery();
        this.statisticalOrderClassSum();
      },
      //改变分类
      changeSystemClass(data){
        this.$data.query.system_class = data.title;
        this.statisticalOrderClassSum();
      },
      // 获取列表
      async statisticalOrderClassSum() {
        let { query } = this;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderClassSum, query);
        if(res.code === 0){
          let rd = res.data, totalItemTotalPrice = 0;
          for (let i = 0; i < rd.length; i++) {
            //总数据
            totalItemTotalPrice += rd[i].amount_real;
          }
          this.$data.totalItemTotalPrice = totalItemTotalPrice;
          this.$data.dataItem = rd;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
      handleShowClassDetail(item) {
        this.$router.push({
          name: 'StatisticMarketClass3',
          query: {
            item_id: item.id,
            system_class1: this.query.system_class,
            system_class_code1: this.query.system_class_code,
            system_class2: item.item_system_class,
            system_class_code2: item.system_class_code,
            begin_date: this.query.begin_date,
            end_date: this.query.end_date
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
