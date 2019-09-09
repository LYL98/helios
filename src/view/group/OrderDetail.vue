<template>
  <div>
    <div class="detail-title">
      <div>
        <span>下单时间：{{detail.created}}</span>
        <span style="margin-left: 120px;">订单编号：{{detail.code}}</span>
        <span style="margin-left: 120px;">发货时间：{{detail.delivery_date}}</span>
      </div>
      <div style="padding-right: 30px;">
        <el-tag size="small" :disable-transitions="true" :type="statusTagType[detail.status]">
          {{orderStatus[detail.status]}}
        </el-tag>
      </div>

    </div>
    <!--订单物流及状态start-->
    <div class="info">
      <div class="address">
        <h6>团员信息</h6>
        <div class="content">
          <span>姓名：{{detail.linkman}}</span>
          <span style="margin-left: 80px;">联系方式：{{detail.phone}}</span>
          <span style="margin-left: 80px;">团长门店名称：{{detail.store_title}}</span>
        </div>
      </div>
    </div>

    <!--订单商品start-->
    <div class="order-item-div">
      <el-table :data="detail.order_items" :row-class-name="highlightRowClassName" :highlight-current-row="true">
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">{{scope.row.item_code}}/{{scope.row.item_title}}</template>
        </el-table-column>
        <el-table-column prop="item_price_sale" label="团购价" width="140">
          <template slot-scope="scope">￥{{returnPrice(scope.row.item_price_sale)}}</template>
        </el-table-column>
        <el-table-column prop="num" label="购买件数" width="140">
        </el-table-column>        
        <el-table-column label="小计" width="140">
          <template slot-scope="scope">￥{{returnPrice(scope.row.item_price_sale * scope.row.num)}}</template>
        </el-table-column>
      </el-table>
      <div class="orderr-price">订单价格：<span>&yen;{{returnPrice(detail.price)}}</span></div>
    </div>

    <!--订单总计等信息end-->
    <div class="record-log">
      <div class="list-title">付款记录</div>
      <div class="record-log-title" v-if="detail.pay_record">
        <div>发起时间</div>
        <div>完成时间</div>
        <div>付款编号</div>
        <div>实付金额</div>
      </div>
      <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无付款历史</div>
      <div v-if="detail.pay_record && detail.pay_record.id" class="record-log-item">
        <div>{{detail.pay_record.created}}</div>
        <div>{{detail.pay_record.updated}}</div>
        <div>{{detail.pay_record.code}}</div>
        <div>{{ detail.pay_record.pay_fee ? '￥' : '' }}{{ detail.pay_record.pay_fee ? returnPrice(detail.pay_record.pay_fee) : '-' }}</div>
      </div>
      <!--<div v-if="detail.pay_record" v-for="(l, i) in detail.pay_record" :key="i" class="record-log-item">-->
        <!--<div>{{l.created}}</div>-->
        <!--<div>{{l.updated}}</div>-->
        <!--<div>{{l.code}}</div>-->
        <!--<div>{{ l.pay_fee ? '￥' : '' }}{{ l.pay_fee ? returnPrice(l.pay_fee) : '-' }}</div>-->
      <!--</div>-->
    </div>

    <div class="record-log">
      <div class="list-title">退款记录</div>
      <div class="record-log-title" v-if="detail.refund_record">
        <div>时间</div>
        <div>退款前订单总价格</div>
        <div>退款金额</div>
        <div>退款后订单总价格</div>
        <div>退款原因</div>
      </div>
      <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无退款记录</div>
      <div v-if="detail.refund_record && detail.refund_record.id" class="record-log-item">
        <div>{{detail.refund_record.created ? detail.refund_record.created : '-'}}</div>
        <div>{{ detail.refund_record.order_price_pre ? '￥' : '' }}{{detail.refund_record.order_price_pre ? returnPrice(detail.refund_record.order_price_pre) : '-'}}</div>
        <div>{{ detail.refund_record.refund_fee ? '￥' : '' }}{{detail.refund_record.refund_fee ? returnPrice(detail.refund_record.refund_fee) : '-'}}</div>
        <div>{{ detail.refund_record.order_price_post ? '￥' : '' }}{{detail.refund_record.order_price_post ? returnPrice(detail.refund_record.order_price_post) : '-'}}</div>
        <div>{{detail.refund_record.remark}}</div>
      </div>

      <!--<div v-if="detail.refund_record" v-for="(l, i) in detail.refund_record" :key="i" class="record-log-item">-->
        <!--<div>{{l.created}}</div>-->
        <!--<div>{{ l.order_price_pre ? '￥' : '' }}{{l.order_price_pre ? returnPrice(l.order_price_pre) : '-'}}</div>-->
        <!--<div>{{ l.refund_fee ? '￥' : '' }}{{l.refund_fee ? returnPrice(l.refund_fee) : '-'}}</div>-->
        <!--<div>{{ l.order_price_post ? '￥' : '' }}{{returnPrice(l.order_price_post)}}</div>-->
        <!--<div>{{l.remark}}</div>-->
      <!--</div>-->
    </div>

    <div class="record-log">
      <div class="list-title">订单日志</div>
      <div class="action-log" v-if="detail.action_logs && detail.action_logs.length > 0">
        <ul v-for="(item, index) in detail.action_logs" :key="index">
          <li class="remark-line">
            <span class="remark">{{orderActionLog[item.action]}}<template v-if="item.remark">({{ item.remark }})</template></span>
            <span class="line" v-if="index < detail.action_logs.length - 1"></span>
          </li>
          <li class="timestamp">{{item.created}}</li>
        </ul>
      </div>
      <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无订单日志</div>
    </div>

  </div>

</template>

<script>
  import {Row, Col, Button, Dialog, Tag, Table, TableColumn} from 'element-ui';
  import {Config, DataHandle, Constant} from '@/util';

  export default {
    name: "OrderDetail",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-table': Table,
      'el-table-column': TableColumn,
    },
    props: {
      detail: { type: Object, required: true }
    },
    computed: {
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
        tencentPath: Config.tencentPath,
        orderStatus: Constant.GROUP_ORDER_STATUS,
        statusTagType: Constant.GROUP_ORDER_STATUS_TYPE,
        orderActionLog: {
          create: '订单创建',
          pay: '订单付款',
          delivery: '订单发货',
          store_order_pick: '订单已到货',
          pick: '订单完成（用户取货）',
          platform_cofirm_pick: '订单完成（平台确认取货）',
          cancel: '订单取消',
        },

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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

//订单商品列表、商品价格
.order-item-div{
  >.orderr-price{
    margin: 10px 0 0 10px;
    >span{
      font-weight: bold;
      color: #ff5252;
    }
  }
}
  

  .detail-title {
    padding: 0 10px 10px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    font-size: 12px;

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


  .action-log {
    padding: 10px;
    display: flex;
    font-size: 12px;

    > ul {
      width: 252px;

      li {
        line-height: 2;
      }

      li.timestamp {
        color: #909399;
      }

      >.remark-line{
        display: flex;
        align-items: center;
        >.line {
          display: inline-block;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAACCAYAAAAw9X6zAAAAAXNSR0IArs4c6QAAACNJREFUGBljfPr06X8GGgApKSmwqc+ePUMxnZA4E4rqQcABAJDQCgDpcontAAAAAElFTkSuQmCC);
          background-repeat: repeat-x;
          flex: 1;
          height: 1px;
          margin: 0 25px;
        }
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
