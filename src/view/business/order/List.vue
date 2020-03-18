<template>
  <sub-menu>
    <query-order v-model="query" @change="changeQuery" :reset="resetQuery"></query-order>
    <div class="container-table">
      <div class="table-top" v-if="auth.isAdmin || auth.OrderListExport || auth.OrderItemExport">
        <div class="left"></div>
        <div class="right">
          <el-button
            v-if="auth.isAdmin || auth.OrderListExport"
            size="mini"
            type="primary"
            plain
            @click.native="(e) => {orderListExport();}"
          >导出订单列表
          </el-button>
          <el-button
            v-if="auth.isAdmin || auth.OrderItemExport"
            size="mini"
            type="primary"
            plain
            @click.native="(e) => {orderListExport(true);}"
          >导出订单商品详情
          </el-button>
        </div>
      </div>
      <!-- 表格start -->
      <div @mousemove="handleTableMouseMove" class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="dataItem.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          style="width: 100%"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column label="订单编号" prop="code" width="150">
            <template slot-scope="scope">
              <div style="position: relative;">
                <span v-if="auth.isAdmin || auth.OrderDetail">
                  <a class="order-no td-item add-dot2" href="javascript:void(0);" @click.prevent="orderShowHideDetail(scope.row.id)">
                    {{scope.row.code}}
                  </a>
                </span>
                <span v-else class="td-item add-dot2">{{scope.row.code}}</span>
                <span v-if="scope.row.is_presale" class="order-type-icon presale-order">预</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="县域" prop="city_title" min-width="70">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.city_title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门店名称" prop="store_title" min-width="120">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.store_title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单价格" min-width="90">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.order_price == 0 ? '' : '￥' }}{{ scope.row.order_price == 0 ? '-' : returnPrice(scope.row.order_price) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="付款状态" min-width="80">
            <template slot-scope="scope">
              <el-tag disable-transitions size="small" :type="scope.row.pay_status === 'wait_complete' ? 'danger' : 'info'">
                {{payStatus[scope.row.pay_status]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="已付款" min-width="85">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.amount_pay == 0 ? '' : '￥' }}{{ scope.row.amount_pay == 0 ? '-' : returnPrice(scope.row.amount_pay) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="待付款" min-width="85">
            <template slot-scope="scope">
              <div class="td-item add-dot2">
                {{ scope.row.order_price - scope.row.amount_pay == 0 ? '' : '￥' }}{{ scope.row.order_price - scope.row.amount_pay == 0 ? '-' : returnPrice(scope.row.order_price - scope.row.amount_pay) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" min-width="80">
            <template slot-scope="scope">
              <el-tag disable-transitions size="small" :type="statusTagType[scope.row.status]">
                {{orderStatus[scope.row.status]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" min-width="100" prop="created">
            <template slot-scope="scope">
              <div class="td-item add-dot2">{{returnDate(scope.row.created)}}</div>
              <div v-if="scope.row[rowIdentifier] === currentRow[rowIdentifier]">{{returnTime(scope.row.created)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '取消订单',
                    isDisplay: (auth.isAdmin || auth.OrderCancel) && orderStatus[scope.row.status] === '待确认',
                    command: () => handleOrderCancel(scope.row.id)
                  }
                ]"
              ></my-table-operate>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格end -->
      </div>
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
    </div>
    <!--订单详情-->
    <detail-order-list :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="DetailOrderList"/>
    <detail-order-after-sale :callback="myCallBack" :getPageComponents="viewGetPageComponents" ref="DetailOrderAfterSale"/>
    <!--订单修改价格-->
    <!--<order-price-update :callback="myCallBack" />-->
  </sub-menu>
</template>

<script>
  import { SelectOption, TableOperate, SelectCity } from '@/common';
  import { QueryOrder } from '@/container';
  import {Config, DataHandle, Constant, Http} from '@/util';
  import { DetailOrderList, DetailOrderAfterSale } from '@/container';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "OrderList",
    components: {
      'my-select-city': SelectCity,
      'select-option': SelectOption,
      'my-table-operate': TableOperate,
      'detail-order-list': DetailOrderList,
      'detail-order-after-sale': DetailOrderAfterSale,
      'query-order': QueryOrder,
    },
    mixins: [tableMixin, viewMixin],
    created() {
      documentTitle('订单 - 订单列表');
      this.initQuery();
      this.getOrderGetList(this.query);
    },
    data() {
      return {
        dataItem: {
          items: [],
          num: 0
        },
        orderStatus: Constant.ORDER_STATUS,
        payStatus: Constant.PAY_STATUS,
        query: { },
        statusTagType: {
          wait_confirm: 'warning',
          confirmed: 'primary',
          assigned: 'primary',
          wait_delivery: 'primary',
          deliveried: 'success',
          received: 'regular',
          order_done: 'regular',
          order_canceled: 'info'
        },
      }
    },
    methods: {

      //组件回调
      myCallBack(res) {
        this.getOrderGetList(this.query);
      },
      changePageSize(pageSize) {
        let {query} = this;
        query.page = 1;
        query.page_size = pageSize;
        this.$data.query = query;
        this.getOrderGetList(query);
        window.scrollTo(0, 0);
      },
      //翻页
      changePage(page) {
        let {query} = this;
        query.page = page;
        this.$data.query = query;
        this.getOrderGetList(query);
        window.scrollTo(0, 0);
      },

      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          city_id: '',
          status: '',
          pay_status: '',
          order_type: '',
          condition: '',
          to_be_canceled: '',
          begin_date: '',
          end_date: '',
          is_init: 1, // 初始状态下，返回列表不含已取消的订单。1 表示初始状态
          page: 1,
          page_size: Constant.PAGE_SIZE
        })
      },

      changeQuery() {
        // 判断是否输入了查询条件？如果输入了查询条件，则将is_init 设置为0，即查询列表返回已取消的订单。
        if (this.query.status === 'order_canceled') {
          this.query.is_init = 0;
        } else {
          this.query.is_init = 1;
        }
        this.getOrderGetList(this.query);
        window.scrollTo(0, 0);
      },
      resetQuery() {
        this.initQuery();
        this.getOrderGetList(this.query);
        window.scrollTo(0, 0);
      },

      // 默认不导出详情
      async orderListExport(hasItemDetail = false) {
        let api = hasItemDetail ? Config.api.orderItemExport : Config.api.orderListExport;
        let {city_id, status, pay_status, order_type, to_be_canceled, condition, begin_date, end_date, is_init} = this.query;
        let query = {
          city_id,
          status,
          pay_status,
          order_type,
          to_be_canceled,
          condition,
          begin_date,
          end_date,
          is_init
        }
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.province.code,
          ...query
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },

      //取消订单
      handleOrderCancel(id) {
        let {orderCancel, getOrderGetList, query} = this;
        this.$messageBox.confirm('取消该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderCancel({
            id: id,
            callback: function () {
              getOrderGetList(query);
            }
          })
        }).catch(() => {

        })
      },

      //获取订单列表
      async getOrderGetList() {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.orderQuery, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //显示订单详情
      orderShowHideDetail(id){
        let pc = this.viewGetPageComponents('DetailOrderList');
        pc.orderShowHideDetail(id);
      },
      //取消订单
      async orderCancel({id, callback}) {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.post(Config.api.orderCancel, { id: id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$message({title: '提示', message: '订单取消成功！', type: 'success'});
          callback && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/container/table/table.scss';
  .order-no {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .order-type-icon {
    position: absolute;
    top: 3px;
    left: 120px;
    color: #FFF;
    display: block;
    width: 16px;
    line-height: 16px;
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  /* is_gb_order === 1 */
  .gb-order {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAkRJREFUWAnNmLtOG0EUhs8ZTGJWFKa1RHoeARAFQaSBJg1vgQiKhFJSIqSIRLwFDQ1pWC4FlzwCfSIFiSZIkWwDjg/nX+8s64Fg7wZ7dpvZuZzzf3vmusOU8ZFPJ2ON25uFVkvmmegNMVVJqCokoxldPdlcffb21FYP3xO1lrX1jIiUerPK3qorUO3D0TRxc1OEprK7z27xTyDZkaH698PPIq2V7G7zWzwJJOvHldr13Y66nc/vOp/lo7HQhmmeq7uJfC7/z8qkzdFN7ciIFxiwdABhzGjZwLspHZRkDGE2CTVP05U+3h8ipFPbB4CrGQFh0RvUOuMCuPk4QtEK7NZ5yTP2pvpN46qf20GWLys1GvVFIXq0HmVx8pJtjTB7nebuxxg9Ooy7hT7zJjrP+CRwtBGhqlPmNYsI6ZguxsPMf7AOXRYDJ6K4RJf9KgyQshjtrx9FAQKL0RAdFAXIGA5NuTyyp4Op6RsKDOVXr78Z3pj5rTAnvoHAAJZ4tzfb/oHaDA8nxtX9M19nImY6D7beTSMocYT0TUpr3qKU0k6Agi9vz5jN10FDQRPaVjcBQsHI5NxHTUJbOYA0jDUTqQ4gXuK/QWV4iYgvkhZ9e+ELaEEzLdEBhApen70OKiVcLPQzUiE0oJWGifTdApvv12UDxgy6yY2M1U2mvS1w05e6jsHUxkxOD2BXC/muQNYoz4VVvCXpLmC2g625XevrubRnIOskutLDnwp+DnAej6/0onrWowyOM0w/WSSM9sn21mTNu6b3Ara+VuT3gvoAAAAASUVORK5CYII=");
  }

  /* is_presale === 1 */
  .presale-order {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAh9JREFUWAnNmL1OAkEQx2fOrwIKbUm09xUglhQIhRRW6iMYCxMfwsTC8AhiQ4MFaIGdwivYawKJjSZqo4ZxZvc+vZMDc9ztFrd7c3M7v/vv9yHMmOiyugYEVSAqA9IGEBY4L7AtP2NVke4YaY0wUrNWBxgfAtAWB1+McEnEFAtEzUqJVThlkGIiEWMq+ROIWrsL8PVxBmM6iqkj0ceRQNTeWYX3zxarUk402hSVhYBsmAHDbE7xfuIulr9G1UxamUxghCUApPpMBs3kF8VtMj2a4N7/MIuyp5Aa2lkgBGMqID3ppTPPBMOH72yFZAY2I6Fem8bP81wOZvlUVohqpsAIuMUwqc/GkxQThdYnOaT9jBXi/YxByVKbK6OACMkcHnyTeWhkDhCMpMmGxgAxi3TqR2OAmMXimejWGCDEHvch7ADCd+ZQwoDQtXCv+8JQd5kDMYOwyCjjZDV0nuVVM3g7xovtPi8jqZy9wp+NAzy4LondVohLSCdhx5QsvtguEO7f9MHC85QQvDAcU8W2LS6Qul/KHbNUPc973iWOpWJ6cdw+5JjSOyjiA+SXi1i/enViSx5UiA3KgR3nqxQrEwETCSRGBbWSq8ylT0k/5bp/KyNxJYWaTJu9a3K/Y3AgI9nfgb0oXikWyHH91w8rtSTJKmA1cL/TduqalE8N5FSijk36pMKHA96PO7/0xIFwqLcz+MTa82jFjl6anLfj8x/os6g7aTDsEgAAAABJRU5ErkJggg==");
  }

  .order-no:hover {
    font-weight: 600;
  }

  .action {
    a {
      font-size: 12px;
      text-decoration: underline;
    }

    a:hover {
      font-weight: 900;
    }
  }
</style>
<style lang="scss">
  @import '@/container/table/table.global.scss';
</style>
