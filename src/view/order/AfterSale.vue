<template>
  <div class="after-sale">
    <query-order-aftersale
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    >
    </query-order-aftersale>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.OrderAftersaleExport">
      <el-button
        v-if="auth.isAdmin || auth.OrderAftersaleExport"
        size="mini"
        type="primary"
        @click="afterSaleListExport"
        plain
      >
        导出售后单列表
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :height="windowHeight - offsetHeight"
        style="width: 100%"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
        </el-table-column>
        <el-table-column label="售后单号" prop="code" min-width="120">
          <template slot-scope="scope">
          <span v-if="auth.isAdmin || auth.OrderAfterSaleDetail || auth.OrderAfterSaleAppend || auth.OrderAfterSaleUpdate">
            <a :class="`order-no ${isEllipsis(scope.row)}`" href="javascript:void(0);"
               @click="orderShowHideAfterSaleDetail({ data: scope.row, isShow: true })">
              {{scope.row.code}}
            </a>
          </span>
            <span v-else :class="isEllipsis(scope.row)">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在仓" prop="city_title" min-width="110">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店名称" prop="store_title" min-width="150">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品编号 / 名称" prop="item_title" min-width="220">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{scope.row.item_code}} / {{scope.row.item_title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处理类型" min-width="140">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ afterSaleOptType[scope.row.opt_type] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单日期" min-width="100" prop="order_date">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.order_date }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div style="position: relative;">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: scope.row.status === 'waiting_dispose' ? '待处理' : '详情',
                    isDisplay: scope.row.status === 'waiting_dispose' && (auth.isAdmin || auth.OrderAfterSaleUpdate),
                    command: () => orderShowHideAfterSaleDetail({ data: scope.row, isShow: true })
                  }
                ]"
              >
              </my-table-operate>
              <div class="new-message" v-if="!scope.row.is_read">new</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
    <after-sale-detail :callback="myCallBack" />
    <order-detail :callback="myCallBack" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Button, Badge, Input, Select, Option, Table, TableColumn, MessageBox, Pagination, Tag, DatePicker } from 'element-ui';
import { OmissionText, SelectCity, TableOperate } from '@/common';
import { QueryOrderAfterSale } from "@/container";
import { Config, DataHandle, Constant } from '@/util';
import AfterSaleDetail from './AfterSaleDetail';
import OrderDetail from './OrderDetail';
import { tableMixin } from '@/mixins';

export default {
  name: "AfterSale",
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-tag': Tag,
    'my-omission-text': OmissionText,
    'query-order-aftersale': QueryOrderAfterSale,
    'after-sale-detail': AfterSaleDetail,
    'order-detail': OrderDetail,
    'my-table-operate': TableOperate
  },
  mixins: [tableMixin],
  created(){
    let that = this;
    documentTitle('订单 - 售后列表');
    this.initQuery();
    this.orderAfterSaleQuery(this.query);

    if (!this.auth.isAdmin && !this.auth.OrderAftersaleExport) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
    }
  },
  computed: mapGetters({
    auth: 'globalAuth',
    windowHeight: 'windowHeight',
    dataItem: 'orderAfterSaleDataItem',
    province: 'globalProvince',
    isShow: 'orderIsShowAfterSaleDetail'
  }),
  data(){
    return {
      tencentPath: Config.tencentPath,
      afterSaleStatus: Constant.AFTER_SALE_STATUS,
      afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE,
      payStatus: Constant.PAY_STATUS,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
      query: { },
    }
  },
  methods: {

    indexMethod(index) {
      return (this.query.page - 1) * this.query.page_size + index + 1;
    },

    onExpandChange(isExpand) {
      if (isExpand) {
        this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
      } else {
        this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
      }
    },

    initQuery() {
      this.$data.query = Object.assign({}, this.$data.query, {
        province_code: this.province.code,
        city_code: '',
        condition: '',
        item: '',
        status: '',
        opt_type: '',
        begin_date: '',
        end_date: '',
        page: 1,
        page_size: Constant.PAGE_SIZE
      });
    },
    changeQuery() {
      this.query.page = 1;
      this.orderAfterSaleQuery(this.query);
    },
    resetQuery() {
      this.initQuery();
      this.orderAfterSaleQuery(this.query);
    },
    changePageSize(pageSize) {
      let {query} = this;
      query.page = 1;
      query.page_size = pageSize;
      this.$data.query = query;
      this.orderAfterSaleQuery(query);
      window.scrollTo(0, 0);
    },
    //翻页
    changePage(page){
      let { query } = this;
      query.page = page;
      this.$data.query = query;
      this.orderAfterSaleQuery(query);
      window.scrollTo(0, 0);
    },

    //组件回调
    myCallBack(res){
      this.orderAfterSaleQuery(this.query);
    },
    afterSaleListExport() {
      let queryStr = Config.api.afterSaleListExport + `?province_code=${this.province.code}`;
      let {city_code, status, opt_type, condition, item, begin_date, end_date} = this.query;
      let query = {
        city_code,
        status,
        opt_type,
        condition,
        item,
        begin_date,
        end_date
      }
      for (let item in query) {
        queryStr += `&${item}=${query[item]}`
      }
      window.open(queryStr);
    },
    ...mapActions(['orderAfterSaleQuery', 'orderShowHideAfterSaleDetail', 'orderShowHideDetail'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .after-sale {
    .form-search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    .order-no {
      color: inherit;
      padding: 5px 10px 5px 0;
      text-decoration: underline;
      cursor: pointer;
    }
    .order-no:hover {
      font-weight: 600;
    }
    .attrs{
      span{
        border: 1px solid #999;
        border-radius: 3px;
        padding: 1px 3px;
        font-size: 12px;
        margin-right: 5px;
      }
    }

    .new-message {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAgCAYAAABdP1tmAAAAAXNSR0IArs4c6QAAAOdJREFUWAntmLENAjEMRb9PwABHdRI7sEJ2uF2ooWURquxwK7ADUipuAChCfFDASSC5sXBkF1FiKXL+f05jAke8bkD3Y9kF5NxNOSsLUSpPHZCXO/TrC01icDuXZGtFw5d3jsBq27zIWBfDGlvW0pRN4FMlERpzf+aX8+X/M6GqwgX9O04n5ISUHfCWUzZcXM4JiS1TvuCElA0Xl3NCYsuULzghZcPF5ZyQ2DLlC05I2XBZuTKjq43QUJOgkaen9gXxKJjoxFNTHgUvZk16QN/tZzlTx3dC5sU8nY8pIybTVD5bqCoxwANXUyeIMbpO7wAAAABJRU5ErkJggg==");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      width: 26px;
      height: 16px;
      color: #FFF;
      line-height: 12px;
      font-size: 12px;
      padding-bottom: 5px;
      font-weight: 700;
      font-style: italic;
      position: absolute;
      top: 0px;
      left: 38px;
    }


  }


</style>
