<template>
  <div>
    <div class="query">
      <el-row>
        <!--<el-col :xl="6" :lg="7" :span="7">-->
          <!--<my-query-item label="所在仓">-->
            <!--<my-select-city-->
              <!--size="small"-->
              <!--:isUseToQuery="true"-->
              <!--:provinceCode="province.code"-->
              <!--v-model="query.city_code"-->
              <!--placeholder="所在仓"-->
              <!--clearable-->
              <!--@change="changeQuery"-->
            <!--&gt;</my-select-city>-->
          <!--</my-query-item>-->
        <!--</el-col>-->
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="订单状态">
            <el-select
              class="query-item-select"
              v-model="query.status"
              @change="changeQuery"
              placeholder="全部"
              size="small"
              clearable
            >
              <el-option
                v-for="(item, key) in groupOrderStatus"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="下单时间">
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
              />
          </my-query-item>
        </el-col>
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <div style="display: flex">
              <el-input
                size="small"
                class="query-item-input"
                clearable
                v-model="query.condition"
                placeholder="订单编号、商品名称"
                @keyup.enter.native="changeQuery"
                @clear="changeQuery"
                ref="condition"
              />
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                         @click="changeQuery"></el-button>
              <el-button type="primary" size="small" class="query-item-reset" plain @click="initQuery">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="operate space-between">
      <el-button
        v-if="auth.isAdmin || auth.GroupOrderShip"
        :disabled="multipleSelection.length <= 0"
        size="mini"
        type="primary"
        @click="handleMultipleShip"
      >
        批量发货
      </el-button>
      <el-button
        v-if="auth.isAdmin || auth.GroupOrderAllShip"
        size="mini"
        type="primary"
        @click="showHideAllShip"
      >
        一键发货
      </el-button>

      <el-button
        v-if="auth.isAdmin || auth.GroupOrderExport"
        plain
        size="mini"
        type="primary"
        @click="handleOrderExport"
        style="margin-left: auto;"
      >
        导出订单列表
      </el-button>
    </div>

    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem.items"
        :row-class-name="highlightRowClassName"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="auth.isAdmin || auth.GroupOrderShip"
          type="selection"
          :selectable="selectable"
          width="30">
        </el-table-column>
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="订单编号" prop="code" min-width="130">
          <template slot-scope="scope">
            <span v-if="auth.isAdmin || auth.GroupOrderDetail">
              <a :class="`order-no ${isEllipsis(scope.row)}`"
                 href="javascript:void(0);"
                 @click.prevent="handleShowItemDetail(scope.row.id)"
              >
                {{scope.row.code}}
              </a>
            </span>
            <span v-else :class="isEllipsis(scope.row)">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="团购商品" prop="item_title" min-width="180">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.item_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货人" prop="linkman" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.linkman || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price_at_created" min-width="90">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.price_at_created ? '￥' : '' }}{{ returnPrice(scope.row.price_at_created) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" prop="pay_amount_at_created" min-width="90">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.pay_amount_at_created ? '￥' : '' }}{{ returnPrice(scope.row.pay_amount_at_created) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="80">
          <template slot-scope="scope">
            <el-tag disable-transitions size="small" :type="statusTagType[scope.row.status]"
            >{{ groupOrderStatus[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="created" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '发货',
                  isDisplay: (auth.isAdmin || auth.GroupOrderShip) && scope.row.status === 'wait_delivery_customer',
                  command: () => handleOrderShip(scope.row.id)
                },
                {
                  title: '取消',
                  isDisplay: (auth.isAdmin || auth.GroupOrderCancel) && (scope.row.status === 'init' || scope.row.status === 'paid'),
                  command: () => handleOrderCancel(scope.row.id)
                },
                {
                  title: '确认取货',
                  isDisplay: (auth.isAdmin || auth.GroupOrderConfirmPickUp) && scope.row.status === 'wait_pick',
                  command: () => handleOrderConfirmPickUp(scope.row.id)
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

    <!--一键发货-->
    <el-dialog title="一键发货" width="320px" :visible.sync="isShowAllShip" :before-close="showHideAllShip">
      <order-all-ship v-if="isShowAllShip" :query="query" @callback="allShipCallBack"></order-all-ship>
    </el-dialog>

  </div>
</template>

<script>

  /**
   * 初始化查询对象 query
   * 请求列表数据
   * changeQuery
   * resetQuery
   *
   */

  import { mapGetters } from 'vuex';
  import { Dialog, Row, Col, Button, Input, Select, Option, Table, TableColumn, Tag, DatePicker, Pagination, MessageBox } from 'element-ui';
  import { ButtonGroup, QueryItem, SelectCity, TableOperate, ImagePreview } from '@/common';
  import { Constant, Config, DataHandle, Http } from '@/util';
  import { Group } from "@/service";
  import { tableMixin } from "@/mixins";
  import OrderAllShip from './OrderAllShip';

  export default {
    name: "OrderList",
    components: {
      'el-dialog': Dialog,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-date-picker': DatePicker,
      'el-pagination': Pagination,
      'my-select-city': SelectCity,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-image-preview': ImagePreview,
      'order-all-ship': OrderAllShip
    },
    mixins: [tableMixin],
    props: {
      showDetail: { type: Function, required: true }
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        windowHeight: 'windowHeight'
      })
    },
    data() {
      return {
        groupOrderStatus: Constant.GROUP_ORDER_STATUS,
        statusTagType: {
          init: 'warning',
          paid: 'primary',
          wait_delivery_customer: 'primary',
          wait_pick: 'success',
          picked: 'regular',
          canceled: 'info'
        },
        /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE,
        pickerValue: null,
        query: {},
        listItem: {
          num: 0,
          items: []
        },
        multipleSelection: [],
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
        isShowAllShip: false
      }
    },
    created() {
      this.initQuery();
      if (this.auth.isAdmin || this.auth.GroupOrderExport || this.auth.GroupOrderShip) {
        this.$data.offsetHeight = this.$data.offsetHeight + Constant.OFFSET_OPERATE;
      }
    },

    methods: {
      initQuery() {
        this.$data.pickerValue = null;
        this.$data.query = {
          province_code: this.province.code,
          status: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        }
        this.orderQuery();
      },
      changeQuery() {
        this.$data.query = Object.assign(this.$data.query, { page: 1 });
        this.orderQuery();
      },
      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = Object.assign({}, query);
        this.orderQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.orderQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.orderQuery();
      },
      async orderQuery() {
        let res = await Group.orderQuery(this.$data.query);
        if (res.code === 0) {
          this.$data.listItem = Object.assign(this.$data.listItem, {
            num: res.data.num,
            items: res.data.items
          });
        } else {
          this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
        }
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      // 判断当前行是否可以被选中
      selectable(row) {
        return row.status === 'wait_delivery_customer';
      },

      handleSelectionChange(items) {
        this.$data.multipleSelection = items;
      },

      // 批量发货
      handleMultipleShip() {
        // 开始批量审核, 判断是否已经多选？
        if (this.$data.multipleSelection.length === 0) {
          return;
        } else {
          MessageBox.confirm('确认发货?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let ids = this.$data.multipleSelection.map(item => item.id);
            let res = await Group.orderShip({
              ids: ids
            });
            if (res.code === 0) {
              this.$store.dispatch('message', {title: '提示', message: '发货成功', type: 'success'});
              this.orderQuery();
            } else {
              this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
            }
          }).catch(() => {
            // console.log('取消');
          });
        }
      },

      //显示隐藏一键发货
      showHideAllShip(){
        if(this.isShowAllShip){
          this.$data.isShowAllShip = false;
        }else{
          if(this.query.status !== 'wait_delivery_customer'){
            this.$store.dispatch('message', {title: '提示', message: '请筛选待发货的订单再进行一键发货', type: 'error'});
          }else if(this.listItem.num === 0){
            this.$store.dispatch('message', {title: '提示', message: '暂无待发货的订单', type: 'error'});
          }else{
            this.$data.isShowAllShip = true;
          }
        }
      },

      //一键发货回调
      allShipCallBack(res){
        this.showHideAllShip();
        if(res === 'success') this.orderQuery();
      },

      handleOrderShip(id) {
        MessageBox.confirm('确认发货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let ids = [id];
          let res = await Group.orderShip({
            ids: ids
          });
          if (res.code === 0) {
            this.$store.dispatch('message', {title: '提示', message: '发货成功', type: 'success'});
            this.orderQuery();
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async handleOrderExport() {
        let api = Config.api.groupOrderExport;
        let { status, condition, begin_date, end_date } = this.query;
        let query = { status, condition, begin_date, end_date };

        //判断是否可导出
        this.$store.dispatch('loading', {isShow: true, isWhole: true});
        let res = await Http.get(`${api}_check?province_code=${this.province.code}`, query);
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$store.dispatch('message', { title: '提示', message: res.message, type: 'error' });
        }
        this.$store.dispatch('loading', {isShow: false});
      },

      handleOrderCancel(id) {
        MessageBox.confirm('确认取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.orderCancel({id: id});
          if (res.code === 0) {
            this.$store.dispatch('message', {title: '提示', message: '订单取消成功', type: 'success'});
            this.orderQuery();
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      //确认取货
      handleOrderConfirmPickUp(id) {
        MessageBox.confirm('确认取货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.orderConfirmPickUp({id: id});
          if (res.code === 0) {
            this.$store.dispatch('message', {title: '提示', message: '取货成功', type: 'success'});
            this.orderQuery();
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      handleShowItemDetail(id) {
        this.$props.showDetail(id);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-no {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .order-no:hover {
    font-weight: 600;
  }
</style>
