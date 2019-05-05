/**
* 常量配置
* xuxuepu create 2016-3-23
*/
import { DataHandle } from '@/util';

const Constant = {
  PAGE_SIZE: 20,
  //重量浮动范围 +-50%
  WEIGHT_SCOPE: 0.50,
  //与建议价格浮动范围 +-2%
  PRICE_SCOPE: 0.02,
  //与昨日售价价格浮动范围 +-5%
  SALE_PRICE_SCOPE: 0.05,
  //筛选区展开收起时页面的高度变化
  //筛选区一行的高度值，如果筛选区有两行隐藏，则需要乘以2，以此类推
  QUERY_OFFSET_LINE_HEIGHT: 48,
  //表格高度计算参数, 16为模块之间的间距
  OFFSET_BASE_HEIGHT: 74,   //基础偏置高度42+16+16
  OFFSET_OPERATE: 44,   //操作区行高28+16
  OFFSET_TABS: 40,   //tab切换器高度
  OFFSET_BREADCRUMB: 30, // 面包屑的高度
  OFFSET_QUERY_CLOSE: 80,  //筛选区高度(关闭状态)64+16
  OFFSET_PAGINATION: 46, //分页器高度
  OFFSET_CHART: 468,  //图表高度
  // 商户充值操作人类型
  MERCHANT_BALANCE_OPERATOR_CLASS: {
    member: '用户',
    operator: '运营人员',
    background: '后台',
  },
  MERCHANT_BALANCE_RECHARGE_REASON: {
    manual_aftersale: '退赔售后',
    manual_discount: '优惠充值',
    manual_promotion: '活动充值',
    manual_frame_return: '周转筐充值',
    manual_return_cash: '返点充值',
    manual_freight_redone: '运费充值',
    manual_other: '其他',
  },
  // 商户金额变更原因
  MERCHANT_BALANCE_REASON: {
    manual_deduct: '手动扣款',
    pay: '用户支付',
    top_up: '用户充值',
    freight_redone: '运费重算',
    sys_refund: '系统退款',
    cancel_order_refund: '订单取消退款',
    after_sale_refund: '售后退款',
    frame_return: '退框退款',
    refund_for_pay_after_cancel: '金额退回',
    manual_aftersale: '退赔售后(手动充值)',
    manual_discount: '优惠充值(手动充值)',
    manual_promotion: '活动充值(手动充值)',
    manual_frame_return: '周转筐充值(手动充值)',
    manual_return_cash: '返点充值(手动充值)',
    manual_freight_redone: '运费充值(手动充值)',
    gb_profit: '团购收益金',
    manual_other: '其他(手动充值)'
  },
  PURCHASE_SUPPLIER_PAY_TYPE: {
    cash: '现付',
    week: '周结（每周五）',
    half_month: '半月结（每月20号、5号）',
    month: '月结（每月5号）'
  },
  PURCHASE_ITEM_STATUS: {
    create: '仓管待审',
    init: '仓管待审',
    first_checked: '仓管审核通过',
    first_declined: '仓管审核驳回',
    second_checked: '财务审核通过',
    second_declined: '财务审核驳回',
    decline: '驳回', // 兼容历史数据
    declined: '驳回' // 兼容接口
  },
  PURCHASE_ITEM_LOG_TYPE: {
    create: '仓管待审',
    init: '仓管待审',
    first_check: '仓管审核通过',
    first_decline: '仓管审核驳回',
    second_check: '财务审核通过',
    second_decline: '财务审核驳回',
    decline: '驳回', // 兼容历史数据
    declined: '驳回' // 兼容接口
  },
  // 退框变更原因
  MERCHANT_REFUND_REASON: {
    frame_return: '门店退框',
    order_done: '发货增加',
    manual_fix: '手动修改'
  },
  //商品状态
  ITEM_STATUS: {
    auditing: '待审核',
    audited: '已审核',
    on_ground: '已上架',
    under_ground: '已下架'
  },
  ITEM_PROMOTION_STATUS: {
    st_activated: '进行中',
    st_deactivated: '未开展'
  },
  ITEM_PROMOTION_TYPE: {
    type_reduction: '全场满减',
    scope_discount: '全场满折',
    single_discount: '单品满折',
  },
  ITEM_PROMOTION_DATE_STATUS: {
    date_before: '未开展',
    date_on: '进行中',
    date_out_of: '已结束'
  },
  ITEM_COUPON_STATUS: {
    st_on_date: '未过期',
    st_out_of_date: '已过期'
  },
  ITEM_COUPON_TYPE: {
    type_reduction: '满减',
    type_discount: '满折',
    type_gift: '满赠'
  },
  // 优惠券发放方式
  ITEM_COUPON_DIS_TYPE: {
    type_grade: '商户等级',
    type_city: '县域',
    type_merchant: '指定商户',
    type_city_grade: '商户等级&县域',
    type_auto: '系统自动发放'
  },

  // 团购订单状态
  GROUP_ORDER_STATUS: {
    init: '待付款',
    paid: '团购中',
    wait_delivery_customer: '待发货',
    wait_pick: '已发货',
    picked: '已完成',
    canceled: '已取消'
  },

  //订单状态
  ORDER_STATUS: {
    wait_confirm: '待确认',
    confirmed: '待发货',
    assigned: '待发货',
    wait_delivery: '待发货',
    deliveried: '待收货',
    received: '已完成',
    order_done: '已完成',
    order_canceled: '已取消'
  },
  // 订单退款记录原因
  ORDER_REFUND_RECORD_REASON: {
    sys_refund: '改单退款',
    cancel_order_refund: '取消订单退款',
    freight_redone: '运费重算',
    pay_after_cancel: '金额退回'
  },
  //付款状态
  PAY_STATUS: {
    wait_complete: '未付清',
    done: '已付清'
  },
  //付款类型
  PAY_TYPE: {
    weixin: '微信',
    balance: '余额'
  },
  //订单价格变动原因
  PRICE_CHANGE: {
    short: '缺货',
    weight_up: '实重上升',
    weight_down: '实重下降',
    update_amount: '手动改价'
  },
  //售后单状态
  AFTER_SALE_STATUS: {
    waiting_dispose: '待处理',
    close: '已完成',
  },
  // 售后单处理类型
  AFTER_SALE_OPT_TYPE: {
    quality: '质量异常',
    delivery: '物流异常',
    amount_delivery: '运费退还',
    weight: '少称',
    not_match: '与SKU描述不相符',
    num: '缺货/错货',
    big_order_bonus: '大单优惠',
    other: '其他'
  },
  //售后单处理结果
  AFTER_SALE_RESULT: {
    init: '商家提交售后申请，待处理', //正在处理
    refund: '退款', //退款
    return: '退货', //退货
    refund_return: '退款、退货', //退款、退货
    ignore: '协商无需处理' //不处理
  },
  //零钱变更记录
  BALANCE_CHANGE: {
    pay: '订单支付',
    top_up: '余额充值',
    sys_refund: '系统退款',
    cancel_order_refund: '订单取消退款',
    after_sale_refund: '售后退款'
  },
  //运营人员数据权限级别1:全国 2:省 3:片区 4:县市 5:线路
  OPERATOR_DATA_LEVEL: {
    '1': '全国',
    '2': '省',
    '3': '片区',
    '4': '县域',
    '5': '线路'
  },
  //运营人员职务
  OPERATOR_POST: {
    salesman: '业务员',
    buyer: '采购员',
    distributor: '配送员'
  },
  // 退框记录的状态
  OPERATE_REFUND_FRAME_STATUS: {
    init: '未审核',
    checked: '审核通过',
    reject: '驳回'
  },
  IMGS: {
    defaultAvatar: require('@/assets/img/default_avatar.png')
  },

  FIX_DATE_RANGE: {
    shortcuts: [{
      text: '今日',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(8));
      }
    }, {
      text: '昨日',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(9));
      }
    }, {
      text: '本周',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(2))
      }
    }, {
      text: '上周',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(3))
      }
    }, {
      text: '本月',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(4))
      }
    }, {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(5))
      }
    }, {
      text: '最近30天',
      onClick(picker) {
        picker.$emit('pick', DataHandle.getFixDateRange(1));
      }
    }]
  },
};

export default Constant;