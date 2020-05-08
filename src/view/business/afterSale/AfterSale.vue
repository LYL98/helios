<template>
  <sub-menu>
    <query-order-aftersale v-model="query" @change="changeQuery" :reset="resetQuery"/>
    <div class="container-table">
      <!-- 头部end -->
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="query.status" @change="changeQuery" :tab-panes="afterSaleStatusTab"/>
        </div>
        <div class="right" v-if="auth.isAdmin || auth.OrderAftersaleExport">
          <el-button size="mini" type="primary" @click="handleExport('aftersaleListExport', query)" plain>导出售后汇总表</el-button>
          <el-button size="mini" type="primary" @click="handleExport('aftersaleRespListExport', query)" plain>导出售后追责表</el-button>
        </div>
      </div>
      <!-- 表格start -->
      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="dataItem.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          style="width: 100%"
          :row-key="rowIdentifier"
          @selection-change="handleSelectionChange"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="selection" :selectable="returnSelectStatus" width="42" disabled="false" v-if="auth.isAdmin || auth.OrderAfterSaleAllocate"></el-table-column>
          <el-table-column type="index" width="88" label="序号" :index="indexMethod"/>
          <el-table-column label="售后单号" prop="code" min-width="120">
            <template slot-scope="scope">
              <span v-if="auth.isAdmin || auth.OrderAfterSaleDetail || auth.OrderAfterSaleAppend || auth.OrderAfterSaleUpdate">
                <a class="order-no td-item add-dot2" href="javascript:void(0);"
                  @click="orderShowHideAfterSaleDetail(scope.row)">
                  {{scope.row.code}}
                </a>
              </span>
              <span v-else class="td-item add-dot2">{{scope.row.code}}</span>
            </template>
          </el-table-column>
          <el-table-column label="县域" prop="city_title" min-width="80">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.city_title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门店名称" prop="store_title" min-width="130">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.store_title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品编号 / 名称" prop="item_title" min-width="200">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{scope.row.item_code}} / {{scope.row.item_title}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="处理进度" min-width="100">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.handle_loading ? afterSaleHandleLoading[scope.row.handle_loading] : '-' }}
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="处理类型" min-width="140">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.opt_type === 'init' || !scope.row.opt_type ? '-' : afterSaleOptType[scope.row.opt_type] }}
              </div>
            </template>
          </el-table-column>-->
          <el-table-column label="下单日期" min-width="100" prop="order_date">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.order_date }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="等级" min-width="80">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                <span class="grade7" v-if="scope.row.flag_7"></span>
                <span class="grade2" v-if="scope.row.flag_2"></span>
                <span v-else-if="!scope.row.flag_7 && !scope.row.flag_2">-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div style="position: relative;">
                <my-table-operate
                  @command-click="handleCommandClick(scope.row)"
                  :list="[
                    {
                      title: judgeOrs(scope.row.status, ['waiting_dispose', 'handling']) ? (scope.row.status === 'waiting_dispose' ? '待处理' : '处理') : '详情',
                      isDisplay: judgeOrs(scope.row.status, ['waiting_dispose', 'handling']) && (auth.isAdmin || auth.OrderAfterSaleUpdate),
                      command: () => orderShowHideAfterSaleDetail(scope.row)
                    },
                    {
                      title: scope.row.status === 'init' ? '分配' : '重新分配',
                      isDisplay: scope.row.status !== 'close' && (auth.isAdmin || auth.OrderAfterSaleAllocate),
                      command: () => orderShowHideAllocateClose([scope.row.id])
                    },
                    {
                      title: '二次处理',
                      isDisplay: scope.row.status === 'close' && retuHandleSecond(scope.row) && (auth.isAdmin || auth.OrderAfterSaleHandleSecond),
                      command: () => orderShowHideHandleSecond(scope.row)
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
      <div class="table-bottom" v-if="dataItem.num > 0">
        <div class="left">
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleSelection.length <= 0"
            v-if="auth.isAdmin || auth.OrderAfterSaleAllocate"
            @click.native="orderShowHideAllocateClose(returnListKeyList('id',multipleSelection))"
          >批量分配</el-button>
        </div>
        <div class="right">
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
    </div>
    <detail-order-after-sale :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="DetailOrderAfterSale"/>
    <detail-order-list :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="OrderDetail"/>
    <!--商品详情-->
    <add-edit-item-detail :getPageComponents="viewGetPageComponents" ref="AddEditItemList" page="after-sale-detail"/>
    <form-order-after-sale-close :getPageComponents="viewGetPageComponents" ref="FormOrderAfterSaleClose" />
    <allocate :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="Allocate" />
    <handle-loading :getPageComponents="viewGetPageComponents" ref="HandleLoading"/>
    <handle-second :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="HandleSecond"/>
  </sub-menu>
</template>

<script>
import { Button, Badge, Input, Select, Option, Table, TableColumn, MessageBox, Pagination, Tag, DatePicker } from 'element-ui';
import { OmissionText, SelectCity, TableOperate } from '@/common';
import QueryOrderAfterSale from './QueryOrderAfterSale';
import DetailOrderAfterSale from './DetailOrderAfterSale';
import FormOrderAfterSaleClose from './FormOrderAfterSaleClose';
import DetailOrderList from '@/view/business/order/DetailOrderList';
import AddEditItemList from '@/view/item/list/AddEditItemList';
import Allocate from './Allocate';
import HandleLoading from './HandleLoading';
import HandleSecond from './HandleSecond';
import { Config, DataHandle, Constant, Http } from '@/util';
import tableMixin from '@/share/mixin/table.mixin';
import mainMixin from '@/share/mixin/main.mixin';
import queryTabs from '@/share/layout/QueryTabs';

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
    'detail-order-after-sale': DetailOrderAfterSale,
    'detail-order-list': DetailOrderList,
    'add-edit-item-detail': AddEditItemList,
    'form-order-after-sale-close': FormOrderAfterSaleClose,
    'allocate': Allocate,
    'handle-loading': HandleLoading,
    'handle-second': HandleSecond,
    'my-table-operate': TableOperate,
    'query-tabs': queryTabs
  },
  mixins: [mainMixin, tableMixin],
  created(){
    let that = this;
    documentTitle('订单 - 售后列表');
    this.initQuery();

    //在Query组件初始化
    //this.orderAfterSaleQuery();
  },
  computed: {
    afterSaleStatusTab() {
      let d = Constant.AFTER_SALE_STATUS('value_key');
      return {'全部': '', ...d}
    },
  },
  data(){
    return {
      dataItem: {
        items: [],
        num: 0
      },
      afterSaleStatus: Constant.AFTER_SALE_STATUS(),
      afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE(),
      afterSaleHandleLoading: Constant.AFTER_SALE_HANDLE_LOADING(),
      payStatus: Constant.PAY_STATUS,
      query: {},
    }
  },
  methods: {
    initQuery(resetData) {
      let provinceCode = '';
      if(resetData && resetData.province_code) provinceCode = resetData.province_code;

      this.$data.query = Object.assign({}, this.$data.query, {
        province_code: provinceCode,
        city_id: '',
        condition: '',
        status: '',
        opt_type: '',
        begin_date: '',
        end_date: '',
        flag_7: null,
        flag_2: null,
        handle_begin_date: '',
        handle_end_date: '',
        operator_id: '',
        page: 1,
        page_size: Constant.PAGE_SIZE
      });
    },
    changeQuery() {
      this.query.page = 1;
      this.orderAfterSaleQuery();
    },
    resetQuery(resetData) {
      this.initQuery(resetData);
      this.orderAfterSaleQuery();
    },
    changePageSize(pageSize) {
      let {query} = this;
      query.page = 1;
      query.page_size = pageSize;
      this.$data.query = query;
      this.orderAfterSaleQuery();
      window.scrollTo(0, 0);
    },
    //翻页
    changePage(page){
      let { query } = this;
      query.page = page;
      this.$data.query = query;
      this.orderAfterSaleQuery();
      window.scrollTo(0, 0);
    },

    //组件回调
    myCallBack(res){
      this.orderAfterSaleQuery();
    },
    //获取售后列表
    async orderAfterSaleQuery(){
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.afterSaleQuery, this.query);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.dataItem = res.data;
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //售后详情
    orderShowHideAfterSaleDetail(item){
      let pc = this.viewGetPageComponents('DetailOrderAfterSale');
      pc.orderShowHideAfterSaleDetail(item);
    },
    //分配
    orderShowHideAllocateClose(ids){
      let pc = this.viewGetPageComponents('Allocate');
      pc.orderShowHideAllocateClose(ids);
    },
    //二次处理
    orderShowHideHandleSecond(item){
      let pc = this.viewGetPageComponents('HandleSecond');
      pc.orderShowHideHandleSecond(item);
    },

    //是否禁用选择
    returnSelectStatus(item){
      return item.status !== 'close' ? true : false;
    },

    //返回是否二次退货
    retuHandleSecond(item){
      //如已二次处理
      if(item.handle_second_time) return;

      //完成小于72小时，可二次处理
      let date = DataHandle.returnDateStr();
      let hours = DataHandle.dateTimeCalc(item.done_time, date, 'hours');
      if(hours < 72) return true;
      return false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
    .order-no {
      color: inherit;
      padding: 5px 10px 5px 0;
      text-decoration: underline;
      cursor: pointer;
    }
    .order-no:hover {
      font-weight: 600;
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

    //超过七小时 超过两小时
    .grade7, .grade2{
      display: inline-block;
      width: 14px;
      height: 16px;
      margin-left: 5px;
      position: relative;
      top: 1px;
      //超过七小时
      &.grade7{
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAATtJREFUKBVjZICC/7q6ggx//kQx/P9vxcDIKAcUfgxkH2NgYVnNeOXKS7g6bW1Hhn//ehn/a2hsByq8CZRIBirkgSlAov8C2SeB+DlQnQFQjTKQ/sMCJH4COflICtGZzEABK7Dg//9wOSYgawqcRwKDEaQW6NzrQEqDaH1Ap4JsBIGpEIp4EqJRWHghUMtn4rUxMIA1Mh49+hkYSItI0Pgf7EeQhv86OprAeLwG1fwdaNBSIPsRMMQVgbQ6kK8OZAsD6YcMTEzFUHUQ6r+m5h4gfvRfWxuUADDAf0tLTgxBkABQUwAohP//R7gEq0KgICxUIfI6OpuBTuFk0NJyxqUBpzjQ1nIg3oBTAVQC1UaQIBfXXCDpAtQsD1WDlcLQyHj27Btg6C0BqvbGqgOf4P+GBqb/oaGgxI0TAADERlgLIYfinAAAAABJRU5ErkJggg==");
      }
      //超过两小时
      &.grade2{
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAVJJREFUKBWVkrFKA0EURe+bhMRIQMRSiIhFLK3TiXY22gSygk0KCwUVf8Af2KhgtFFBUYRYWthYC36BWBoLEewskpUk17djpljdyLrNY+6cM8u8eYL+d+hxNJDAI1kiUADxIiL3Zjh7vXksb47zvdYsKL7UKu1bCJ4UrBLMO8BVgXQ1f9BDXknMAJwCpJNWKdC/bDjwZ1UppVlJmciWEeAgkiRcqAf4XvsR5HRCRzHpmBBWu55c+iatODKUPYPIx39kK1ZPrXSeVBQB0w42Kan3OlwL1/oELQouDaSpvZwke0WFi9rYMd18JmXbebZqk+78Squ5v8JCZKO/qG0xF5djtxIshh3WN7PdjoX6ob2jA8aXMjc6Gbm95WDOZYNqRCyXpQuYI73X+iDB5RExDPPMnKg4f+BxwkFx9Ze4eiXvOocXnwwW4oQ/M+7QNBp2uAdyX+R1cejQ/GkLAAAAAElFTkSuQmCC");
      }
    }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
