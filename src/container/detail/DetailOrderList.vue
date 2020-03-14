<template>
  <div>
    <detail-layout title="订单详情" :isShow="isShow" direction="ttb" :before-close="cancel" type="drawer">
      <div>
        <div class="detail-title">
          <span>下单时间：{{detail.created}}</span>
          <span style="margin-left: 120px;">订单编号：{{detail.code}}</span>
          <span style="margin-left: 120px;">订单类型：{{detail.is_presale ? '预售订单' : '普通订单'}}</span>
          <span style="margin-left: 120px;">配送时间：{{detail.delivery_date}}</span>
        </div>
        <!--订单物流及状态start-->
        <div class="info">
          <div class="address">
            <h6>收货地址</h6>
            <div class="content">
              <div class="title">
                {{detail.city_title}} /
                <span style="font-size: 14px; color: #666;">{{detail.store_title}}</span>
              </div>
              <div class="name-phone">
                <span>收件人：{{detail.linkman}} {{detail.phone ? '(' + detail.phone + ')' : '' }}</span>
                <span style="margin-left: 80px;">收货地址：{{detail.address}}</span>
              </div>
            </div>
          </div>
          <div style="padding-right: 30px;">
            <el-tag size="small" :disable-transitions="true" :type="detail.status === 'order_canceled' ? 'info' : 'danger'">
              {{orderStatus[detail.status]}}
            </el-tag>
          </div>
        </div>

        <div class="info" v-if="detail.express && detail.express.success" style="padding-bottom: 20px; display: flex;align-items: flex-end">
          <div class="express" style="flex: 1;">
            <h6>物流信息</h6>
            <div style="margin-bottom: 20px">
              <span>{{detail.express.shipper_title}}</span>:
              <span>{{detail.express.logistic_code}}</span>
            </div>
            <div style="display: flex; align-items: center; height: 100px;" v-if="detail.express.traces.length === 0">
              <p style="text-align: center; width: 100%;font-size: 14px;">暂无物流信息</p>
            </div>
            <template v-else>
              <template v-if="index <= 1 || (index > 1 && isShowExpressAll)">
                <div v-for="(trace, index) in detail.express.traces" :key="index">
                  <div v-if="index !== 0">
                    <span style="border-right: 1px #99a9bf solid;height: 5px;width: 2px;margin-left: 170px"></span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="width: 160px;text-align: right;">{{trace.accept_time}}</span>
                    <div style="background: #99a9bf; width: 10px; height: 4px; border-radius: 2px; margin: 0 5px"></div>
                    <div style="display: inline-flex; flex-direction: column; justify-content: center">
                      <p v-if="trace.remark" style="color: #000;">{{trace.remark}}</p>
                      <p style="font-size: 12px">{{trace.accept_station}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>
          <div style="width: 100px;height: 100%;display: flex;flex-direction: column;align-items: end;" v-if="detail.express.traces.length > 0">
            <div>
              <a href="javascript:void(0)" @click="expandExpress">点击{{isShowExpressAll ? '收起' : '展开'}}</a>
            </div>
          </div>
        </div>
        <!--订单物流及状态end-->

        <!--订单商品start-->
        <div class="order-item-div">
          <el-table :data="detail.items" :row-class-name="highlightRowClassName" :highlight-current-row="true">
            <el-table-column label="商品图" width="70">
              <template slot-scope="scope">
                <my-image-preview>
                  <img :src="tencentPath + scope.row.item_image + '_min200x200'" width="48" height="48"/>
                </my-image-preview>
              </template>
            </el-table-column>
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                {{ scope.row.item_code }} / {{scope.row.item_title}}
              </template>
            </el-table-column>
            <el-table-column label="商品参数" width="200">
              <template slot-scope="scope">
                <ul class="item-attrs">
                  <li v-for="(item, index) in scope.row.item_attrs" :key="index">
                    {{item}}<span v-if="index < (scope.row.item_attrs.length - 1)">、</span>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="170">
              <!-- 未享受单品满折扣的情况 原价 <= 折扣后的价格 -->
              <template slot-scope="scope">
                <ul>
                  <li>
                    &yen;{{returnPrice(scope.row.item_price_sale)}} / 件
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="件数" width="200">
              <template slot-scope="scope">
                <ul class="count-weight">
                  <li>
                    <p>{{ scope.row.count_pre }}件</p>
                  </li>
                  <template v-if="scope.row.count_real !== scope.row.count_pre">
                    <li class="line"></li>
                    <li>
                      <p :class="scope.row.count_real > scope.row.count_pre ? 'red' : 'green'">
                        {{ scope.row.count_real }}件
                      </p>
                    </li>
                  </template>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="小计" width="200">
              <template slot-scope="scope">
                <ul class="count-weight">
                  <li>&yen;{{ returnPrice(scope.row.amount_pre) }}</li>
                  <li class="line" v-if="scope.row.amount_real !== scope.row.amount_pre"></li>
                  <li
                    v-if="scope.row.amount_real !== scope.row.amount_pre"
                    :class="scope.row.amount_real > scope.row.amount_pre ? 'red' : 'green'"
                  >&yen;{{ returnPrice(scope.row.amount_real) }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="售后情况" prop="aftersale" width="130">
              <template slot-scope="scope">
                <!-- 如果存在售后情况，判断是否已完成，如果未完成，则提示用户查看售后详情 -->
                <div v-if="scope.row.aftersale">
                  <!-- 有售后单的情况下，如果是已经完成，则直接显示已完成即可 -->
                  <span v-if="scope.row.aftersale.status === 'close'">{{afterSaleStatus['close']}}</span>
                  <span v-else>{{afterSaleStatus['waiting_dispose']}}</span>
                  <a
                    class="operator"
                    href="javascript:void(0);"
                    @click="orderShowHideAfterSaleDetail(scope.row.aftersale)"
                    v-if="auth.isAdmin || auth.OrderAfterSaleDetail"
                  >
                    {{scope.row.aftersale.status === 'waiting_dispose' ? '查看进度':'查看详情'}}
                  </a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--订单商品end-->
        <!--订单总计等信息start-->
        <div>
          <ul class="total-price">
            <li style="position: relative;">
              商品总额
              <span>￥{{ returnPrice(detail.item_total_price) }}</span>
              <span
                v-if="detail.item_total_price !== detail.price_at_created && (detail.coupon_reduction > 0 || detail.promotion_reduction > 0)"
                @click="isShowAmountDetail = !isShowAmountDetail"
                style="cursor: pointer; position: absolute; right: -60px; font-weight: 600; color: #a8a8a8; line-height: 12rpx; font-size: 12rpx;"
              >
                {{ isShowAmountDetail ? '-收起' : '+展开' }}
              </span>
            </li>
            <li v-if="isShowAmountDetail && detail.coupon_reduction && detail.coupon_reduction > 0">
              优惠券
              <span>- &yen;{{ returnPrice(detail.coupon_reduction) }}</span>
            </li>
            <li v-if="isShowAmountDetail && detail.promotion_reduction && detail.promotion_reduction > 0">
              <span v-if="detail.promotion && detail.promotion.promotion_type === 'scope_discount'">全场满折</span>
              <span v-else>全场满减</span>
              <span>- &yen;{{ returnPrice(detail.promotion_reduction) }}</span>
            </li>
            <li v-if="isShowAmountDetail && detail.fram_total_price > 0">
              筐费用
              <span>+ &yen;{{returnPrice(detail.fram_total_price)}}</span>
            </li>
            <li v-if="isShowAmountDetail">
              运费
              <span>{{ detail.delivery_fee > 0 ? '+ &yen;' : ''}}{{returnPrice(detail.delivery_fee)}}</span>
            </li>
          </ul>
          <ul>
            <li style="color:#333333; padding: 10px; font-weight: 600; display: flex; flex-direction: column;">
              <div style="width: 300px;  display: flex; justify-content: space-between;">合计 <span>&yen;{{returnPrice(detail.price_at_created)}}</span></div>
              <ul v-if="detail.price_at_created !== detail.order_price">
                <li style="width: 300px; display: flex; justify-content: space-between;" v-if="detail.delivery_fee_chg !== 0">
                  <div>
                    <span>运费重算</span>
                  </div>
                  <span style="color: #ff3724;" v-if="detail.delivery_fee_chg > 0">
                    + &yen;{{ returnPrice(Math.abs(detail.delivery_fee_chg)) }}
                  </span>
                  <span style="color: #00d600;" v-if="detail.delivery_fee_chg < 0">
                    - &yen;{{ returnPrice(Math.abs(detail.delivery_fee_chg)) }}
                  </span>
                </li>
                <li style="width: 300px; display: flex; justify-content: space-between;" v-if="detail.check_chg + detail.fram_total_price_chg !== 0">
                  <div>
                    <span>价格变动</span>
                    <span style="margin-left: 20px; font-size: 12px;">因商品数量发生变化</span>
                  </div>
                  <span style="color: #00d600;">
                    - &yen;{{ returnPrice(Math.abs(detail.check_chg + detail.fram_total_price_chg)) }}
                  </span>
                </li>
              </ul>
            </li>
            <li>
              <ul style="border-top: 1px solid #eee; padding: 10px; display: flex; justify-content: space-between;">
                <li style="width: 300px; display: flex; justify-content: space-between;">订单价格 <span>&yen;{{returnPrice(detail.order_price)}}</span></li>
                <li v-if="detail.status !== 'order_canceled'">
                  <span>已付款 &yen;{{returnPrice(detail.amount_pay)}}</span>
                  <span v-if="detail.remain_pay > 0" style="margin-left: 20px;">
                    待付款 <span style="color: #ff3724;">&yen;{{returnPrice(detail.remain_pay)}}</span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!--订单总计等信息end-->
        <div class="record-log">
          <div class="list-title">付款记录</div>
          <div class="record-log-title" v-if="detail.pay_record && detail.pay_record.length > 0">
            <div>发起时间</div>
            <div>完成时间</div>
            <div>付款编号</div>
            <div>支付总金额</div>
            <div>余额支付</div>
            <div>第三方支付</div>
            <div>状态</div>
          </div>
          <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无付款历史</div>
          <div v-for="(l, i) in detail.pay_record" :key="i" class="record-log-item">
            <div>{{l.created}}</div>
            <div>{{l.status === 'success' ? l.updated : '-'}}</div>
            <div>{{l.code}}</div>
            <div>{{returnPrice(l.total_fee)}}</div>
            <div>{{returnPrice(l.balance_fee)}}</div>
            <div>{{returnPrice(l.pay_fee)}}</div>
            <div v-if="l.status === 'success'" style="color: #67c23a;">
              <el-tag size="small" type="success">成功</el-tag>
            </div>
            <div v-else style="color: #ccc;">
              <el-tag size="small" type="info">失败</el-tag>
            </div>
          </div>
        </div>

        <div class="record-log">
          <div class="list-title">退款记录</div>
          <div class="record-log-title" v-if="detail.refund_record && detail.refund_record.length > 0">
            <div>时间</div>
            <div>订单总金额</div>
            <div>退款前订单支付金额</div>
            <div>退款金额</div>
            <div>退款后订单支付金额</div>
            <div>退款方式</div>
            <div>退款原因</div>
          </div>
          <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无退款记录</div>
          <div v-for="(l, i) in detail.refund_record" :key="i" class="record-log-item">
            <div>{{l.created}}</div>
            <div>{{returnPrice(l.amount_order)}}</div>
            <div>{{returnPrice(l.amount_pay_pre)}}</div>
            <div>{{returnPrice(l.amount)}}</div>
            <div>{{returnPrice(l.amount_pay)}}</div>
            <div>账户余额</div>
            <div>{{refundReason[l.reason]}}</div>
          </div>
        </div>

        <div class="record-log">
          <div class="list-title">订单日志</div>
          <div class="action-log">
            <ul v-for="(item, index) in detail.action_log" :key="index">
              <li>
                {{actionLogs[item.action]}}
                <span class="remark" v-if="item.remark">({{ item.remark }})</span>
              </li>
              <li class="timestamp">{{item.created}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div style="margin-left: 20px;">
        <el-button @click.native="cancel">关 闭</el-button>
      </div>
    </detail-layout>
  </div>
</template>

<script>
  import { ImagePreview } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import detailMixin from '@/container/detail/detail.mixin';

  export default {
    name: "DetailOrderList",
    mixins: [detailMixin],
    components: {
      'my-image-preview': ImagePreview
    },
    computed: {
      stepActive() {
        let {detail} = this;
        switch (detail.status) {
          case 'wait_confirm':
            return 1;
          case 'wait_delivery':
            return 2;
          case 'order_done':
            return 3;
        }
      },
      actionLog: {
        get() {
          let log = {};
          this.detail.action_log && this.detail.action_log.map(item => {
            log[item.action] = item.created;
          })
          return [log];
        }
      }
    },
    data() {
      return {
        isShow: false,
        detail: {
          items: [{item_attrs: []}],
          price_log: [],
          pay_record: []
        },
        orderStatus: Constant.ORDER_STATUS,
        afterSaleStatus: Constant.AFTER_SALE_STATUS,
        afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE(),
        priceChange: Constant.PRICE_CHANGE,
        refundReason: Constant.ORDER_REFUND_RECORD_REASON,
        activeName: 'second',
        isShowAmountDetail: false,
        //订单日志
        actionLogs: {
          order: '订单创建', // 下单
          pay: '订单付款',
          confirm: '订单确认',
          delivery: '订单发货',
          receive: '订单完成',
          cancel: '订单取消',
          launch_pay: '支付发起',
          callback_begin: '支付回调',
          callback_success: '回调成功'
        },
          isShowExpressAll: false,
        }
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      returnWeight(value) {
        return DataHandle.returnWeight(value);
      },
      //返回金额
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      //返回支付类型
      returnPayType(weixin, balance) {
        return DataHandle.returnPayType(weixin, balance);
      },
      expandExpress() {
        this.isShowExpressAll = !this.isShowExpressAll;
      },
      //取消
      cancel() {
        this.$attrs.callback(); // 调用父组件的callback
        this.orderShowHideDetail();
      },
      // 组件回调
      myCallBack(res) {
        let {detail} = this;
        this.orderGetDetail(detail.id);
      },
      //显示隐藏订单详情
      orderShowHideDetail(id){
        if(id){
          if(this.isShow){
            this.$data.isShow = false;
            this.orderGetDetail(id);
          }else{
            this.orderGetDetail(id);
          }
        }else{
          this.$data.isShow = false;
        }
      },
      //获取订单详情
      async orderGetDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.orderDetail, { id: id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //查看售后进度
      orderShowHideAfterSaleDetail(aftersale){
        let pc = this.getPageComponents('DetailOrderAfterSale');
        pc.orderShowHideAfterSaleDetail(aftersale);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .detail-title {
    padding: 0 10px 10px;
    border-bottom: 1px solid #f3f4f6;
  }

  .attrs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    span {
      margin: 3px 0;
      border: 1px solid #999;
      border-radius: 3px;
      padding: 0 3px;
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .item_attrs {
    .el-tag {
      display: block;
    }
  }

  .after-sale-detail {
    line-height: 25px;

    .title {
      display: inline-block;
      color: #99a9bf;
      width: 120px;
      font-weight: 900;
    }

  }

  .info {
    padding: 12px 15px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f3f4f6;

    .address {
      h6 {
        font-size: 14px;
        color: #333333;
        margin: 0 0 10px 0;
      }
    }

    .express {
      h6 {
        font-size: 14px;
        color: #333333;
        margin: 0 0 10px 0;
      }
    }

    > .img {
      flex: initial;
      width: 42px;

      > i {
        font-size: 32px;
      }
    }

    .content {
      flex: 1;
      padding-bottom: 12px;

      .title {
        font-size: 16px;
        margin-bottom: 5px;
      }

      .name-phone {
        font-size: 12px;
        margin-bottom: 5px;
        color: #666;
      }

      .address-str {
        color: #666;
        font-size: 12px;
      }
    }
  }

  a.operator {
    text-decoration: underline;
  }

  a.operator:hover {
    font-weight: 600;
  }

  .leave-msg {
    padding: 12px 15px;
    display: flex;
    align-items: center;

    > .img {
      flex: initial;
      width: 42px;

      > i {
        font-size: 32px;
      }
    }

    .content {
      flex: 1;

      .title {
        font-size: 16px;
        margin-bottom: 2px;
      }

      .str {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .order-item-div {
    border-top: 10px solid #f3f4f6;
    padding: 10px 0;

    .item-attrs {
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      display: flex;
      padding: 6px 0;
      align-items: center;

      div {
        flex: 1;
      }

      > .img {
        flex: initial !important;
        width: 84px;

        > img {
          width: 72px;
          height: 72px;
          background-color: #f3f4f6;
          float: left;
        }
      }

      > .content {
        flex: 1;

        .title {
          font-size: 14px;
          margin-bottom: 4px;

          span {
            margin-right: 10px;
          }
        }

        .label {
          overflow: hidden;

          > span {
            float: left;
            border: 1px solid #999;
            color: #999;
            font-size: 12px;
            border-radius: 3px;
            padding: 0 4px;
            margin-right: 4px;
          }
        }

        .price-unit {
          margin-top: 5px;
          color: #999;
          font-size: 16px;
        }
      }

      .num {
        font-size: 16px;
        flex: initial !important;
        width: 120px;
        text-align: right;
        color: #999;
      }
    }
  }

  .freight, .coupon, .balance-pay {
    display: flex;
    align-items: center;
    padding: 5px 10px;

    > div {
      flex: 1;
    }
  }

  .total-price {
    padding: 10px;
    border-bottom: 1px solid #f3f4f6;
    li {
      width: 300px;
      display: flex;
      justify-content: space-between;
    }
  }

  .list-title {
    margin-top: 20px;
    padding: 10px;
    border-bottom: 10px solid #f3f4f6;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    /*margin-bottom: 10px;*/
  }

  .record-log {

    .pay-title {
      font-size: 16px;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
      color: #333;
    }

    .record-log-title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
      padding: 10px 0;
      font-size: 12px;

      > div {
        flex: 1;
        text-align: center;
      }
    }

    .record-log-item {
      border-bottom: 1px solid #f3f4f6;
      padding: 10px 0;
      font-size: 12px;
      display: flex;
      align-items: center;

      > div {
        flex: 1;
        text-align: center;
        color: #999;
      }
    }
  }

  .price-log-item {
    border-bottom: 1px solid #f3f4f6;

    .date {
      color: #a2a2a2;
      padding: 6px 11px;
      border-bottom: 1px solid #F4F5F7;
    }
  }

  .price-log-item > .wrap {
    .cause, .cause_name {
      color: #999;
      margin-top: 9px;
    }

    .cause_name {
      margin-top: 6px;
    }

    margin: 15px 27px 27px 27px;

    .content {
      display: flex;
      align-items: center;

      .view {
        flex: 1;
        height: 34px;
        line-height: 34px;

        .price {
          margin-bottom: 2px;
          color: #333;
        }

        .price2 {
          position: absolute;
          top: -9px;
          width: 246px;
          text-align: center;
          color: #041A28;
        }
      }

      .line {
        flex: inherit;
        position: relative;
        width: 246px;
        height: 34px;
      }

      .line::after {
        position: absolute;
        height: 2px;
        content: ' ';
        width: 246px;
        top: 17px;
        background-color: #041A28;
      }

      .line::before {
        width: 0;
        height: 0;
        content: '';
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 10px solid #041A28;
        transform: rotate(90deg);
        right: -4px;
        top: 12px;
        position: absolute;
      }
    }

    .content.nums {
      margin-top: 30px;
    }

  }

  .count-weight {
    display: flex;
    align-items: center;
    /*background: red;*/
    .line {
      padding: 0 10px;
      margin: 0 10px;
      width: 5px;
      height: 1px;
      background: #909399;
    }

    .red {
      color: #ff3724;
    }

    .green {
      color: #00d600;
    }
  }

  .action-log {
    padding: 0 10px;
    font-size: 12px;
    overflow: hidden;
    > ul {
      width: 162px;
      float: left;
      margin: 15px 0;
      li {
        line-height: 2;
      }
      li.timestamp {
        color: #909399;
      }
    }
  }

  .dot {
    width: 10px;
    height: 10px;
    background: #99a9bf;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

</style>
