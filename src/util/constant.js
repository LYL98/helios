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
  OFFSET_BASE_HEIGHT: 78,   //基础偏置高度46+16+16
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
    frame_return: '退筐退款',
    refund_for_pay_after_cancel: '金额退回',
    manual_aftersale: '退赔售后(手动充值)',
    manual_discount: '优惠充值(手动充值)',
    manual_promotion: '活动充值(手动充值)',
    manual_frame_return: '周转筐充值(手动充值)',
    manual_return_cash: '返点充值(手动充值)',
    manual_freight_redone: '运费充值(手动充值)',
    gb_transfer: '团购余额转账',
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
  // 退筐变更原因
  MERCHANT_REFUND_REASON: {
    frame_return: '门店退筐',
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
    wait_pick: '已到货',
    picked: '已完成',
    canceled: '已取消'
  },
  GROUP_ORDER_STATUS_TYPE: {
    init: 'warning',
    paid: 'primary',
    wait_delivery_customer: 'primary',
    wait_pick: 'success',
    picked: 'regular',
    canceled: 'info'
  },

  //团购门店订单状态
  GROUP_STORE_ORDER_STATUS: {
    init: '待发货',
    wait_pick: '已发货',
    picked: '已完成'
  },
  GROUP_STORE_ORDER_STATUS_TYPE: {
    init: 'danger',
    wait_pick: 'success',
    picked: 'info'
  },

  //团购活动上下架状态
  GROUP_ACTIVITY_STATUS: {
    activated: '已上架',
    deactivated: '未上架',
  },
  //团购活动状态
  GROUP_ACTIVITY_PROGRESS_STATUS: {
    pre: '未开展',
    ing: '团购中',
    post: '已结束',
    is_deleted: '已作废'
  },
  //团购活动状态(tag type)
  GROUP_ACTIVITY_PROGRESS_STATUS_TYPE: {
    pre: 'warning',
    ing: '',
    post: 'regular',
    is_deleted: 'info'
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
    update_amount: '手动改价'
  },
  //售后单状态
  AFTER_SALE_STATUS: (type) => {
    let data = [
      { key: 'init', value: '待分配' },
      { key: 'waiting_dispose', value: '待处理' },
      { key: 'handling', value: '处理中' },
      { key: 'close', value: '已完成' }
    ];
    return handleKeyValue(type, data);
  },
  //售后状态颜色
  AFTER_SALE_STATUS_TYPE: {
    init: 'primary',
    waiting_dispose: 'warning',
    handling: 'warning',
    close: 'regular'
  },
  // 售后单处理类型
  AFTER_SALE_OPT_TYPE: (type) => {
    let data = [
      { key: 'quality', value: '质量异常' },
      { key: 'delivery', value: '物流异常' },
      { key: 'amount_delivery', value: '运费退还' },
      { key: 'weight', value: '少称' },
      { key: 'not_match', value: '与SKU描述不相符' },
      { key: 'num', value: '缺货/错货' }, //新增时不显示
      { key: 'num_short', value: '缺货' },
      { key: 'num_error', value: '错货' },
      { key: 'big_order_bonus', value: '大单优惠' },
      { key: 'betray_low_price', value: '违反低价承诺' },
      { key: 'other', value: '其他' }
    ];
    return handleKeyValue(type, data);
  },

  //售后处理进度
  AFTER_SALE_HANDLE_LOADING: (type) => {
    let data = [
      { key: 'supplement_material', value: '素材补充' },
      { key: 'verify_offline', value: '线下核实' },
      { key: 'restoring', value: '退货中' }
    ];
    return handleKeyValue(type, data);
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
  //运营人员数据权限级别1:总部 2:区域 3:片区 4:县域
  OPERATOR_DATA_LEVEL: {
    '1': '总部',
    '2': '区域',
    '3': '片区',
    '4': '县域'
  },
  // 配送人员职务
  DELIVER_POST: (type) => {
    let data = [
      { key: 'deliver', value: '司机' },
      { key: 'sorter', value: '装车员' },
      { key: 'local_distributor', value: '配送员' },
    ];
    return handleKeyValue(type, data);
  },
  //运营人员职务
  OPERATOR_POST: (type) => {
    let data = [
      { key: 'buyer', value: '商品' },
      { key: 'salesman', value: '业务' },
      { key: 'supply', value: '供应链' },
      { key: 'service', value: '客服' },
      { key: 'other', value: '其他' },
    ];
    return handleKeyValue(type, data);
  },
  // 退筐记录的状态
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
  //供应商类型
  SUPPLIER_TYPE: (type) => {
    let data = [
      { key: 'global_pur', value: '全国' },
      { key: 'local_pur', value: '区域' }
    ];
    return handleKeyValue(type, data);
  },
  //供应商账期
  SUPPLIER_BILL_TERM: (type) => {
    let data = [
      { key: 0, value: '现结' },
      { key: 7, value: '周结' },
      { key: 14, value: '双周结' },
      { key: 30, value: '单月' },
      { key: 60, value: '双月' }
    ];
    return handleKeyValue(type, data);
  },
  //供应商账期2
  SUPPLIER_BILL_TERM2: (type) => {
    let data = [
      { key: 0, value: '现结' },
      { key: 7, value: '账期' },
      { key: 14, value: '账期' },
      { key: 30, value: '账期' },
      { key: 60, value: '账期' }

    ];
    return handleKeyValue(type, data);
  },
  //审核状态(共用)
  AUDIT_STATUS: (type)=>{
    let data = [
      { key: 'init', value: '待审核' },
      { key: 'success', value: '审核通过' },
      { key: 'fail', value: '作废' }
    ];
    return handleKeyValue(type, data);
  },
  //审核状态(颜色)
  AUDIT_STATUS_TYPE: {
    init: 'primary',
    success: 'regular',
    fail: 'info'
  },
  //采购订单状态（预采、反采）
  PURCHASE_STATUS: (type)=>{
    let data = [
      { key: 'init', value: '待审核' },
      { key: 'audit_success', value: '待收货' },
      { key: 'part_in', value: '部分收货' },
      { key: 'all_in', value: '已完成' },
      { key: 'audit_fail', value: '作废' },
      { key: 'closed', value: '关闭' }
    ];
    return handleKeyValue(type, data);
  },
  //采购订单状态(颜色)
  PURCHASE_STATUS_TYPE: {
    init: 'primary',
    audit_success: 'success',
    part_in: 'warning',
    all_in: 'regular',
    audit_fail: 'info',
    closed: 'info'
  },
  // 商品 - 调拨 - 调拨计划状态
  DISTRIBUTE_PLAN_STATUS: (type) => {
    let data = [
      { key: 'init', value: '待审核' },
      { key: 'audit_success', value: '已完成' },
      { key: 'audit_fail', value: '作废' },
      { key: 'closed', value: '关闭' }
    ];
    return handleKeyValue(type, data);
  },
  // 调拨计划状态(颜色)
  DISTRIBUTE_PLAN_STATUS_TYPE: {
    init: 'primary',
    audit_success: 'success',
    audit_fail: 'info',
    closed: 'info'
  },
  // 商品 - 调拨 - 调拨单状态
  DISTRIBUTE_WAYBILL_STATUS: (type) => {
    let data = [
      { key: 'init', value: '待装车' },
      { key: 'wait_delivery', value: '待发车' },
      { key: 'deliveried', value: '待收货' },
      { key: 'part_in', value: '部分收货' },
      { key: 'all_in', value: '已完成' },
      { key: 'closed', value: '关闭' }
    ];
    return handleKeyValue(type, data);
  },
  // 调拨单状态(颜色)
  DISTRIBUTE_WAYBILL_STATUS_TYPE: {
    init: 'primary',
    wait_delivery: 'warning',
    deliveried: 'regular',
    all_in: 'success',
    part_in: 'info',
    closed: 'info'
  },
  // 场地 - 品控收货 - 调拨
  DISTRIBUTE_RECEIVE_STATUS: (type) => {
    let data = [
      { key: 'init', value: '待收货' },
      { key: 'all_in', value: '已收货' }
    ];
    return handleKeyValue(type, data);
  },
  // 场地 - 品控收货 - 调拨(颜色)
  DISTRIBUTE_RECEIVE_STATUS_TYPE: {
    init: 'primary',
    all_in: 'regular'
  },
  //调拨单状态
  DISTRIBUTE_STATUS: (type)=>{
    let data = [
      { key: 'success', value: '待收货' },
      { key: 'part_in', value: '部分收货' },
      { key: 'all_in', value: '已完成' }
    ];
    return handleKeyValue(type, data);
  },
  //调拨单状态(颜色)
  DISTRIBUTE_STATUS_TYPE: {
    success: 'primary',
    part_in: 'warning',
    all_in: 'regular'
  },
  //财务结款状态
  S_STATEMENT_PAID_STATUS: (type)=>{
    let data = [
      { key: 'init', value: '待结款' },
      { key: 'paid', value: '已结款' }
    ];
    return handleKeyValue(type, data);
  },
  //财务结款状态(颜色)
  S_STATEMENT_PAID_STATUS_TYPE: {
    init: 'warning',
    paid: 'info'
  },
  //财务对财单状态
  S_STATEMENT_STATUS: (type)=>{
    let data = [
      { key: 'init', value: '待确认' },
      { key: 'confirmed', value: '已确认' },
      { key: 'wait_paid', value: '待结款' },
      { key: 'paid', value: '已结款' }
    ];
    return handleKeyValue(type, data);
  },
  //财务对财表状态(颜色)
  S_STATEMENT_STATUS_TYPE: {
    init: 'primary',
    confirmed: 'warning',
    wait_paid: 'warning',
    paid: 'regular'
  },
  //供应商流水类型
  SUPPLIER_BILL_REASON: (type)=>{
    let data = [
      { key: 'local_buy', value: '货款' }, //反采采购
      { key: 'distribution', value: '货款' }, //预采采购
      { key: 'item_damage', value: '货损' }, //货损
      { key: 'refund', value: '退货' }, //退货
      { key: 'other', value: '其它' }, //其它（手动充值、扣款）
    ];
    return handleKeyValue(type, data);
  },
  //品控单状态
  Q_C_STATUS: (type)=>{
    let data = [
      { key: 'audit_success', value: '待收货' },
      { key: 'part_in', value: '部分收货' },
      { key: 'all_in', value: '已完成' },
      { key: 'closed', value: '关闭' }
    ];
    return handleKeyValue(type, data);
  },
  //品控单状态颜色
  Q_C_STATUS_TYPE: {
    audit_success: 'primary',
    part_in: 'warning',
    all_in: 'regular',
    closed: 'info'
  },
  //入库单状态
  INVENTORY_STATUS: (type)=>{
    let data = [
      { key: 'success', value: '待入库' },
      { key: 'all_in', value: '已入库' }
    ];
    return handleKeyValue(type, data);
  },
  //入库单状态(颜色)
  INVENTORY_STATUS_TYPE: {
    success: 'primary',
    all_in: 'regular'
  },
  //入库类型
  INVENTORY_TYPES: (type)=>{
    let data = [
      { key: 'global_pur', value: '预采入库' },
      { key: 'local_pur', value: '反采入库' },
      { key: 'distribute', value: '调拨入库' },
      { key: 'allocate', value: '场地入库' },
      { key: 'refund', value: '场地入库' }
    ];
    return handleKeyValue(type, data);
  },
  //入库类型(颜色)
  INVENTORY_TYPES_TYPE: {
    global_pur: 'info',
    local_pur: 'info',
    distribute: 'info',
    allocate: 'info',
    refund: 'info'
  },
  SUP_STOCK_RECORD_TYPE: (type) => {
    let data = [
      { key: 'accept', value: '收货' },
      { key: 'dt_ac_edit', value: '打货' },
      { key: 'in_stock', value: '入库' },
      { key: 'allocate', value: '分配' },
      { key: 'distribute', value: '调拨' },
      { key: 'out_stock', value: '出库' },
    ];
    return handleKeyValue(type, data);
  },
  //变动类型
  SUP_OPT_TYPES: (type)=>{
    let data = [
      { key: 'damage', value: '报损' },
      { key: 'damage_sale', value: '报损销售' },
      { key: 'sale_offline', value: '线下销售' },
      { key: 'refund', value: '退货入库' },
      { key: 'stocked_qa', value: '库内品控' },
      { key: 'refund_to_supplier', value: '退货给供应商' }
    ];
    return handleKeyValue(type, data);
  },
  //变动类型(颜色)
  SUP_OPT_TYPES_TYPE: {
    damage: 'info',
    damage_sale: 'info',
    sale_offline: 'info',
    refund: 'info',
    stocked_qa: 'info',
    refund_to_supplier: 'info'
  },
  //发车状态
  DEPART_STATUS: (type)=>{
    let data = [
      { key: 'wait_confirm', value: '待确认' },
      // { key: 'wait_delivery', value: '待发车' },
      { key: 'delivering', value: '配送中' },
      { key: 'done', value: '已完成' }
    ];
    return handleKeyValue(type, data);
  },
  //发车状态(颜色)
  DEPART_STATUS_TYPE: {
    wait_confirm: 'primary',
    // wait_delivery: 'primary',
    delivering: 'warning',
    done: 'refund'
  },
  //分配方式
  DISTRIBUTE_OPT_TYPES: (type)=>{
    let data = [
      { key: 'by_line', value: '按线路分配' },
      { key: 'by_od_time', value: '按下单时间分配' },
    ];
    return handleKeyValue(type, data);
  },
  //分配方式状态(颜色)
  DISTRIBUTE_OPT_TYPES_TYPE: {
    by_line: 'info',
    by_od_time: 'info'
  },
  //装车tab切换
  TRUCK_LOADING_TAB: (type)=>{
    let data = [
      { key: 'sort', value: '分配'},
      { key: 'truck', value: '装车'},
      { key: 'truck_delay', value: '装车延时'}
    ];
    return handleKeyValue(type, data);
  },
  //出库状态
  OUT_STORAGE_STATUS: (type)=>{
    let data = [
      { key: 'init', value: '待出库'},
      { key: 'part', value: '部分出库'},
      { key: 'all', value: '已出库'}
    ];
    return handleKeyValue(type, data);
  },
  //出库状态(颜色)
  OUT_STORAGE_STATUS_TYPE: {
    init: 'primary',
    part: 'warning',
    all: 'regular'
  },
  //权限级别
  ROLE_AUTH_LEVEL: (type)=>{
    let data = [
      { key: 'global', value: '总部' },
      { key: 'local', value: '区域' }
    ];
    return handleKeyValue(type, data);
  },
  //权限级别(颜色)
  ROLE_AUTH_LEVEL_TYPE: {
    global: 'info',
    local: 'info'
  },
  //库存销售状态
  INVENTORY_SALE_STATUS: (type)=>{
    let data = [
      { key: 'wait_sale', value: '待销售' },
      { key: 'saled', value: '已销售' }
    ];
    return handleKeyValue(type, data);
  },
  //库存销售状态(颜色)
  INVENTORY_SALE_STATUS_TYPE: {
    wait_sale: 'primary',
    saled: 'regular'
  }
};

//处理key value
const handleKeyValue = (type, data) => {
  //list
  if(type === 'list'){
    return data;
  }
  let d = {};
  //value_key
  if(type === 'value_key'){
    data.map(item => {
      d[item.value] = item.key;
    });
    return d;
  }
  //key_value
  data.map(item => {
    d[item.key] = item.value;
  });
  return d;
}

export default Constant;
