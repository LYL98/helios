/***
 * 导入配置
 */
import { RequestHttp, TencentUpPath, TencentPath, IsPrintRequestLog} from './../../configBase';

const Config = (() => {
  let apiM = RequestHttp + '/m';
  let apiCommon = RequestHttp + '/common';
  return {
    // ajax_http请求url
    api: {
      /*-- 基础信息 --*/
      tencentPresignedUrl: apiCommon + '/tencent/presigned_url',//腾讯Buckettoken
      signLogin: apiM + '/sign/login',//用户登录
      signLogout: apiM + '/sign/logout',//用户退出
      signIsLogin: apiM + '/sign/is_login',//判断是否登录
      loginByToken: apiM + '/sign/login_by_token',//通过token登录
      getBrand: apiM + '/common/constant/brand', //全局获取品牌

      orderDeliveryItems: apiM + '/delivery/city/items',//拉取收货单
      orderDeliveryItemsSubmit: apiM + '/delivery/city/items/set_num',//提交收货单(post)
      operatorOrderDistributeStores: apiM + '/delivery/city/item/detail', //获取要分配商品的门店列表
      operatorOrderDistribute: apiM + '/delivery/store/items/set_num', //分配商品到门店
      deliveryPreCheck: apiM + '/delivery/pre_check', //称重收货，预审，查看缺货的，称重偏差在20%的
      orderDeliveryCheck: apiM + '/delivery/check',//审核通过(post)

      orderDeliveryItemQuery: apiM + '/order/delivery/item/query', // 获取商品信息列表
      orderCityExport: apiM + '/order/city/export', //县域订货单导出，从每日县域汇总表导出
      orderExport: apiM + '/order/export', //订单导出
      orderListExport: apiM + '/order/list/export', //订单列表导出
      orderItemExport: apiM + '/order/item/export', //订单商品导出
      orderShortListExport: apiM + '/item/short/list/export', //商品缺货列表
      orderAftersaleExport: apiM + '/aftersale/export', //售后单导出
      orderLabelPrint: apiM + '/order/label/print', //打印商品标签(打印)
      orderBalanceExport: apiM + '/balance/export', //商户余额导出
      orderBalanceLogExport: apiM + '/balance/log/export', //商户余额流水
      orderRouteExport: apiM + '/order/line/export', //线路导出
      orderStoreExport: apiM + '/order/store/export', //门店分货表

      orderQuery: apiM + '/order/query', //订单列表
      orderPriceUpdate: apiM + '/order/price/update', //修改订单价格
      orderDetail: apiM + '/order/detail', //订单详情
      orderConfirm: apiM + '/order/manual_confirm', // 手动确认订单
      orderCancel: apiM + '/order/cancel', //取消订单
      orderManualChange: apiM + '/order/item/manual_chg', //手动修改订单
      orderShip: apiM + '/order/ship', //手动发货

      afterSaleQuery: apiM + '/aftersale/query', //获取负责处理的售后单
      afterSaleListExport: apiM + '/aftersale/list/export', // 售后单列表导出
      afterSaleDetail: apiM + '/aftersale/detail', //获取售后单详情
      afterSaleUpdate: apiM + '/aftersale/update', //售后处理
      aftersaleAppend: apiM + '/aftersale/append', //售后单回复

      //供应商
      supplierDetail: apiM + '/supplier/detail', //供应商详情
      supplierAdd: apiM + '/supplier/add', //供应商新增
      supplierEdit: apiM + '/supplier/edit', //供应商修改
      supplierAudit: apiM + '/supplier/audit', //供应商审核
      supplierFreeze: apiM + '/supplier/freeze', //供应商冻结
      supplierUnFreeze: apiM + '/supplier/unfreeze', //供应商解冻
      supplierQuery: apiM + '/supplier/query', //供应商列表
      supplierBindItems: apiM + '/supplier/bind_items', //供应商品

      //统采
      supplierGPurchaseQuery: apiM + '/supplier/g_purchase/query', //统采订单
      supplierGPurchaseAdd: apiM + '/supplier/g_purchase/add', //新增统采订单， 同时会附带生成入库单
      supplierGPurchaseEdit: apiM + '/supplier/g_purchase/edit', //新增统采订单， 同时会附带生成入库单
      supplierGPurchaseAudit: apiM + '/supplier/g_purchase/audit', //统采采购单审核
      supplierGPurchaseDetail: apiM + '/supplier/g_purchase/detail', //统采采购单详情

      //统采调拨单
      supplierInStockList: apiM + '/supplier/in_stock/list', //入库单列表(暂时，供统采调拨单用)
      supplierInStockDetail: apiM + '/supplier/in_stock/detail', //入库单详情(暂时，供统采调拨单用)
      supplierGPurchaseDistributeQuery: apiM + '/supplier/distribute/query', //调拨单查询
      supplierGPurchaseDistributeAdd: apiM + '/supplier/distribute/add', //调拨单新增
      supplierGPurchaseDistributeEdit: apiM + '/supplier/distribute/edit', //调拨单修改
      supplierGPurchaseDistributeAudit: apiM + '/supplier/distribute/audit', //调拨单审核
      supplierGPurchaseDistributeDetail: apiM + '/supplier/distribute/detail', //调拨单详情
      
      //地采
      supplierLocalPurchaseQuery: apiM + '/from_supplier/order/query', //地采订单
      supplierLocalPurchaseDetail: apiM + '/from_supplier/order/detail', //统采采购单详情

      //商品池
      pItemAdd: apiM + '/p_item/add', //新商品资料添加
      pItemEdit: apiM + '/p_item/edit', //商品信息资料修改
      pItemQuery: apiM + '/p_item/query', //商品资料查询
      pItemDetail: apiM + '/p_item/detail', //商品资料详情
      pItemDelete: apiM + '/p_item/delete', //商品删除
      pItemRecover: apiM + '/p_item/recover', //已删除商品恢复
      pItemModifyDetail: apiM + '/p_item/modify_detail', //商品资料修改日志
      pItemExportCheck: apiM + '/p_item/export_check', //商品导出之前进行校验
      pItemExport: apiM + '/p_item/export', //商品导出
      pItemChgSupAttr: apiM + '/p_item/chg_sup_attr', //修改商品的供应属性:统采/地采, 如果是统采商品则支持修改商品的供应商

      // 商品管理
      itemEdit: apiM + '/item/edit', //商品编辑
      itemInnerTagEdit: apiM + '/item/inner_tag/edit', //商品加价标签修改
      itemInnerTagAudit: apiM + '/item/inner_tag/audit', //内标签审核审核
      itemInnerTagLogQuery: apiM + '/item/inner_tag/log_query', //商品加价标签修改申请查询
      itemQuery: apiM + '/item/query',//商品列表
      itemUnderGround: apiM + '/item/under_ground',//商品下架
      itemOnGround: apiM + '/item/on_ground', //商品上架（包括编辑）
      itemDetail: apiM + '/item/detail',//商品详情
      itemModifyDetail: apiM + '/item/modify_detail', //商品修改日志
      itemExport: apiM + '/item/export', //商品列表导出
      itemPriceList: apiM + '/item/price/query',//每日定价页面查询
      itemPriceFix: apiM + '/item/price/fix',//商品定价
      itemPriceAudit: apiM + '/item/price/audit', //商品定价审核
      itemChgSupplier: apiM + '/item/chg_supplier', //修改地采商品的供应商
      itemPriceDetail: apiM + '/item/price/detail', //商品供应商报价列表

      // 促销活动
      itemScopePromotionQuery: apiM + '/scope_promotion/query', // 促销活动查询
      itemScopePromotionAdd: apiM + '/scope_promotion/add', // 创建促销活动
      itemScopePromotionRepeat: apiM + '/scope_promotion/repeat_list', // 查询当前时间段存在的全场营销活动
      itemPromotionItemCheck: apiM + '/promotion/item/check', // 促销活动商品检查
      itemPromotionDetail: apiM + '/promotion/detail', // 促销活动详情
      itemPromotionStart: apiM + '/promotion/start', // 上架促销活动
      itemPromotionHalt: apiM + '/promotion/end', // 下架促销活动

      // 优惠券
      itemCouponQuery: apiM + '/coupon/query', // 优惠券查询
      itemCouponAdd: apiM + '/coupon/add', // 创建优惠券
      itemCouponDetail: apiM + '/coupon/detail', // 获取优惠券详情
      itemCouponDistribute: apiM + '/coupon/distribute', // 发放优惠券
      itemCouponAutoDis: apiM + '/coupon/auto/dis', // 自动发放优惠券状态切换
      itemCouponDistributeLog: apiM + '/coupon/distribute/log/query', // 优惠券发放记录
      itemCouponDistributeStatistic: apiM + '/coupon/distribute/merchants/query', // 优惠券发放记录
      itemCouponListExport: apiM + '/coupon/distribute/log/export', //优惠券导出

      //团购商品分类
      groupItemClassList: apiM + '/gb_item/category/list', //团购商品分类列表(组件共用)
      groupItemClassQuery: apiM + '/gb_item/category/query',  //团购商品分类
      groupItemClassDelete: apiM + '/gb_item/category/delete', //删除团购商品分类
      groupItemClassAdd: apiM + '/gb_item/category/add', //新增团购商品分类
      groupItemClassEdit: apiM + '/gb_item/category/edit', //编辑团购商品分类

      // 团购商品
      groupItemList: apiM + '/gb_item/list', //团购商品列表(组件共用)
      groupItemQuery: apiM + '/gb_item/query',  //团购商品列表
      groupItemDetail: apiM + '/gb_item/detail', //团购商品详情
      groupItemModifyLogQuery: apiM + '/gb_item/modify_log/query', //团购商品修改记录
      groupItemRecover: apiM + '/gb_item/recover', //恢复团购商品
      groupItemDelete: apiM + '/gb_item/delete', //删除团购商品
      groupItemAdd: apiM + '/gb_item/add', //新增团购商品
      groupItemEdit: apiM + '/gb_item/edit', //编辑团购商品

      // 团购活动
      groupActivityActive: apiM + '/gb_activity/active', //上架
      groupActivityDeactive: apiM + '/gb_activity/deactive', //下架
      groupActivityNullify: apiM + '/gb_activity/delete', //作废
      groupActivityQuery: apiM + '/gb_activity/query', //查询
      groupActivityDetail: apiM + '/gb_activity/detail', //详情
      groupActivityActItemSale: apiM + '/gb_activity/act_item/sale', //团购详情的商品详情
      groupActivityModifyLogQuery: apiM + '/gb_activity/modify_log/query', //操作记录
      groupActivityAdd: apiM + '/gb_activity/add', //添加
      groupActivityEdit: apiM + '/gb_activity/edit', //修改
      groupActivityActItemAdd: apiM + '/gb_activity/act_item/add', //新增商品
      groupActivityActItemEdit: apiM + '/gb_activity/act_item/edit', //编辑商品
      groupActivityActItemDelete: apiM + '/gb_activity/act_item/delete', //团购活动具体商品删除
      groupActivityActCheckDup: apiM + '/gb_activity/check_dup', //活动时间判断

      groupBuyLogQuery: apiM + '/gb_activity/log/query',  //团购列表
      groupBuyDetail: apiM + '/gb_activity/detail',  //团购详情
      groupBuyDelete: apiM + '/gb_activity/delete',  //删除团购活动
      groupBuyCancel: apiM + '/gb_activity/deactive',  //结束团购活动
      groupBuyAdd: apiM + '/gb_activity/add',  //新增团购活动
      groupBuyEdit: apiM + '/gb_activity/edit',  //编辑团购活动
      groupBuyActive: apiM + '/gb_activity/active',  //生效团购活动
      groupBuyStoreList: apiM + '/gb_act/store/query',  //团购详情门店列表
      groupBuyStoreDetail: apiM + '/gb_store/activity/detail',  //团购门店详情
      groupBuyStoreMemberList: apiM + '/gb_store_activity/member/query',  //门店用户列表

      // 团长
      groupHeadQuery: apiM + '/gb_activity/header/query', // 团长列表
      groupHeadStoreBindDetail: apiM + '/gb_activity/store/bind/detail', // 门店绑定的情况查询
      groupHeadAdd: apiM + '/gb_activity/header/add', // 新增团长
      groupHeadFreeze: apiM + '/gb_activity/header/freeze', // 冻结 解冻团长
      groupStoreFreeze: apiM + '/gb_activity/store/freeze', // 团购门店 冻结/解冻
      groupStoreBalanceLog: apiM + '/gb_activity/balance_log/query', //余额明细

      // 团员
      groupMemberQuery: apiM + '/gb_activity/gb_member/query', // 团员列表
      groupMemberFreeze: apiM + '/gb_activity/gb_member/freeze', // 冻结 解冻团长
      groupMemberExport: apiM + '/gb_activity/gb_member/export', // 冻结 解冻团长

      //门店订单
      groupStoreOrderQuery: apiM + '/gb_store_order/query', //门店订单查询
      groupStoreOrderDelivery: apiM + '/gb_store_order/delivery', //门店订单发货
      groupStoreOrderDeliveryAll: apiM + '/gb_store_order/delivery_all', //门店订单一键发货
      groupStoreOrderDetail: apiM + '/gb_store_order/detail', //门店订单详情
      groupStoreOrderExportCheck: apiM + '/gb_store_order/export_check', //门店订单导出确认
      groupStoreOrderExport: apiM + '/gb_store_order/export', //门店订单导出

      // 订单列表
      groupOrderQuery: apiM + '/gb_activity/gb_order/query', // 团员列表
      groupOrderExport: apiM + '/gb_activity/gb_order/export', // 导出
      groupOrderDetailExport: apiM + '/gb_activity/gb_order/items_export', // 导出明细
      groupOrderDetail: apiM + '/gb_activity/order/detail', // 详情
      groupOrderCancel: apiM + '/gb_activity/order/cancel', // 取消

      //banner管理
      groupBannerAdd: apiM + '/gb_basicdata/banner/add', //banner新增
      groupBannerEdit: apiM + '/gb_basicdata/banner/edit', //banner修改
      groupBannerDelete: apiM + '/gb_basicdata/banner/delete', //banner删除
      groupBannerDetail: apiM + '/gb_basicdata/banner/detail', //banner详情
      groupBannerList: apiM + '/gb_basicdata/banner/list', //banner列表

      baseProvinceListMy: apiM + '/common/my_province', //省列表(我的省列表)（全局省份）
      baseProvinceList: apiM + '/common/province/list', //省列表 (组件共用）
      baseStoreList: apiM + '/common/store/list', // 门店列表(组件共用)
      baseZoneList: apiM + '/common/zone/list', //片区列表（组件共用）
      baseCityList: apiM + '/common/city/list', //县区列表（组件共用）
      baseLineList: apiM + '/common/my_line', //线路列表（组件共用）（运营时用）
      baseLineListOperator: apiM + '/common/line/list', //线路列表（组件共用）(新增运营人员时用)
      baseFrameList: apiM + '/common/frame/list', //筐列表（组件共用）
      baseSystemClassListTree: apiM + '/common/system_class/tree', //科学分类树形（组件共用）
      baseSystemClassList: apiM + '/common/system_class/list', //科学分类列表（组件共用）
      baseDisplayClassList: apiM + '/common/display_class/list', //展示分类列表（组件共用）
      baseItemTagsList: apiM + '/common/item_tags/list', //商品标签接口（组件共用）
      baseItemInnerTagsList: apiM + '/common/item_inner_tags/list', //商品加价标签接口（组件共用）
      baseMerchantGradeList: apiM + '/common/grade/list', //商户级别列表（组件共用）
      baseMerchantInnerTagsList: apiM + '/common/merchant_inner_tags/list', //商户内标签列表（组件共用）
      baseMerchantOuterTagsList: apiM + '/common/merchant_outer_tags/list', //商户外标签列表（组件共用）
      baseCommonBuyerList: apiM + '/common/buyer/list', //采购员列表（组件共用）
      baseDistributorList: apiM + '/common/distributor/list', //配送人员列表（组件共用）
      baseItemList: apiM + '/common/item/list', //商品列表（组件共用）
      baseGItemList: apiM + '/common/p_item/list', //商品池列表（组件共用）
      baseMerchantList: apiM + '/common/merchant/list', //商品列表（组件共用）
      baseSupplierList: apiM + '/common/supplier/list', // 供应商列表(组件共用)
      baseItemDetail: apiM + '/common/item/detail', //商品列表（组件共用）
      baseOrderShipList: apiM + '/common/shipper/list', //快递公司列表 （订单手动发货时用）
      baseStorehouseList: apiM + '/common/storehouse/list', //获取仓列表（组件共用）
      baseWarehouseList: apiM + '/common/warehouse/list', //获取库列表（组件共用）

      basicdataProvinceAdd: apiM + '/basicdata/province/add', //省新增
      basicdataProvinceEdit: apiM + '/basicdata/province/edit', //省修改
      basicdataProvinceList: apiM + '/basicdata/province/list', //省列表
      basicdataProvinceDelete: apiM + '/basicdata/province/delete', //省删除

      basicdataZoneAdd: apiM + '/basicdata/zone/add', //片区新增
      basicdataZoneEdit: apiM + '/basicdata/zone/edit', //片区修改
      basicdataZoneList: apiM + '/basicdata/zone/list', //片区列表
      basicdataZoneDelete: apiM + '/basicdata/zone/delete', //片区删除

      basicdataCityAdd: apiM + '/basicdata/city/add', //县区新增
      basicdataCityEdit: apiM + '/basicdata/city/edit', //县区修改
      basicdataCityList: apiM + '/basicdata/city/list', //县区列表
      basicdataCityDelete: apiM + '/basicdata/city/delete', //县区删除

      basicdataFrameList: apiM + '/basicdata/frame/list', //筐列表
      basicdataFrameAdd: apiM + '/basicdata/frame/add', //商品筐信息添加
      basicdataFrameEdit: apiM + '/basicdata/frame/edit', //商品筐信息修改
      basicdataFrameDelete: apiM + '/basicdata/frame/delete', //商品筐信息删除

      basicdataDisplayClassList: apiM + '/basicdata/display_class/list',//商品展示分类列表
      basicdataDisplayClassAdd: apiM + '/basicdata/display_class/add',//商品展示分类新增
      basicdataDisplayClassEdit: apiM + '/basicdata/display_class/edit',//商品展示分类修改
      basicdataDisplayClassDelete: apiM + '/basicdata/display_class/delete',//商品展示分类删除

      basicdataSystemClassListTree: apiM + '/basicdata/system_class/list/tree',//商品科学分类列表(树型))
      basicdataSystemClassAdd: apiM + '/basicdata/system_class/add',//商品科学分类新增
      basicdataSystemClassEdit: apiM + '/basicdata/system_class/edit',//商品科学分类修改
      basicdataSystemClassDelete: apiM + '/basicdata/system_class/delete',//商品科学分类删除

      basicdataItemTagsAdd: apiM + '/basicdata/item_tags/add',//商品标签新增
      basicdataItemTagsEdit: apiM + '/basicdata/item_tags/edit',//商品标签修改
      basicdataItemTagsList: apiM + '/basicdata/item_tags/list',//商品标签列表
      basicdataItemTagsDelete: apiM + '/basicdata/item_tags/delete',//商品标签删除
      basicdataItemTagsIcons: apiM + '/common/tag_images/list', //商品icon默认标签
      basicdataItemTagsDetail: apiM + '/basicdata/item_tags/detail', //icon标签详情

      basicdataItemInnerTagsAdd: apiM + '/basicdata/item_inner_tags/add',//商品加价标签新增
      basicdataItemInnerTagsEdit: apiM + '/basicdata/item_inner_tags/edit',//商品加价标签修改
      basicdataItemInnerTagsList: apiM + '/basicdata/item_inner_tags/list',//商品加价标签列表
      basicdataItemInnerTagsDelete: apiM + '/basicdata/item_inner_tags/delete',//商品加价标签删除

      basicdataMerchantInnerTagsList: apiM + '/basicdata/merchant_inner_tags/list', //商户内标签
      basicdataMerchantInnerTagsAdd: apiM + '/basicdata/merchant_inner_tags/add', //商户内标签添加
      basicdataMerchantInnerTagsEdit: apiM + '/basicdata/merchant_inner_tags/edit', //商户内标签修改
      basicdataMerchantInnerTagsDelete: apiM + '/basicdata/merchant_inner_tags/delete', //商户内标签删除

      basicdataMerchantOuterTagsList: apiM + '/basicdata/merchant_outer_tags/list', //商户外标签
      basicdataMerchantOuterTagsAdd: apiM + '/basicdata/merchant_outer_tags/add', //商户外标签新增
      basicdataMerchantOuterTagsEdit: apiM + '/basicdata/merchant_outer_tags/edit', //商户外标签修改
      basicdataMerchantOuterTagsDelete: apiM + '/basicdata/merchant_outer_tags/delete', //商户外标签删除

      basicdataGradeList: apiM + '/basicdata/grade/list', //商户等级列表
      basicdataGradeAdd: apiM + '/basicdata/grade/add', //商户级别添加
      basicdataGradeEdit: apiM + '/basicdata/grade/edit', //商户级别修改
      basicdataGradeDelete: apiM + '/basicdata/grade/delete', //商户等级删除

      basicdataStorehouseList: apiM + '/sup_storehouse/query', //仓列表
      basicdataStorehouseAdd: apiM + '/sup_storehouse/add', //仓新增
      basicdataStorehouseEdit: apiM + '/sup_storehouse/edit', //仓修改
      basicdataStorehouseDelete: apiM + '/sup_storehouse/delete', //仓删除

      basicdataWarehouseList: apiM + '/sup_warehouse/query', //库列表
      basicdataWarehouseAdd: apiM + '/sup_warehouse/add', //库新增
      basicdataWarehouseEdit: apiM + '/sup_warehouse/edit', //库修改
      basicdataWarehouseDelete: apiM + '/sup_warehouse/delete', //库删除
      basicdataWarehouseDetail: apiM + '/sup_warehouse/detail', //库详情

      basicdataWarehouseTrayAdd: apiM + '/sup_ware_tray/add', //托盘新增
      basicdataWarehouseTrayEdit: apiM + '/sup_ware_tray/edit', //托盘新增
      basicdataWarehouseTrayDelete: apiM + '/sup_ware_tray/delete', //删除

      // 商品统一描述
      basicdataGetCommonDescription: apiM + '/basicdata/constant/unified_description', // 获取商品统一描述
      basicdataSetCommonDescription: apiM + '/basicdata/constant/unified_description', // 设置商品统一描述

      // 商户管理
      merchantList: apiM + '/merchant/list', //商户列表
      merchantAdd: apiM + '/merchant/add', //新增商户
      merchantEdit: apiM + '/merchant/edit', //修改商户
      merchantDetail: apiM + '/merchant/detail', //商户详情
      merchantApprove: apiM + '/merchant/approve', //商户审核
      merchantFreeze: apiM + '/merchant/freeze', //商户冻结
      merchantUnFreeze: apiM + '/merchant/unfreeze', //商户解冻
      merchantGradeTagsEdit: apiM + '/merchant/grade_tags/edit', //商户内标签修改
      merchantBalanceEdit: apiM + '/merchant/balance/edit',  // 商户充值 / 扣款
      merchantRefundEdit: apiM + '/store/frame/edit', //修改门店的退筐信息
      merchantRefundLogQuery: apiM + '/store/frame/log/query', // 退筐日志查询
      merchantExport: apiM + '/store/export', // 商户导出
      merchantBatchGroupBuy: apiM + '/store/batch/gb_include', // 批量设置团购商户

      storeQuery: apiM + '/store/query', // 所有门店的查询结果
      storeList: apiM + '/store/list', //单商户下的门店列表
      storeDetail: apiM + '/store/detail', //门店详情
      storeAdd: apiM + '/store/add', //添加门店
      storeEdit: apiM + '/store/edit', //修改门店
      storeEditCity: apiM + '/store/city_edit', //修改所在仓
      storeFreeze: apiM + '/store/freeze', //门店冻结
      storeUnFreeze: apiM + '/store/unfreeze', //门店解冻
      storeDelete: apiM + '/store/delete', //删除门店
      storeApprove: apiM + '/store/approve',//门店审核

      memberAdd: apiM + '/member/add', //新用户资料添加
      memberList: apiM + '/member/list', //用户列表
      memberPasswordReset: apiM + '/member/password_reset', //重置密码
      memberFreeze: apiM + '/member/freeze', //冻结用户账号
      memberUnFreeze: apiM + '/member/unfreeze', //解冻用户账号
      memberUnBindWechat: apiM + '/member/unbind_wechat', //解除微信绑定

      //角色、权限
      permissionTree: apiM + '/system/permission/list/tree',//权限树
      roleAdd: apiM + '/system/role/add',//修改权限角色
      roleEdit: apiM + '/system/role/edit',//修改权限角色
      roleDetail: apiM + '/system/role/detail',//角色详情
      roleList: apiM + '/system/role/list',//查询权限角色
      roleDelete: apiM + '/system/role/delete',//删除权限角色

      //banner管理
      systemBannerList: apiM + '/system/banner/list',  // banner列表
      systemBannerEdit: apiM + '/system/banner/update', // banner修改
      systemBannerAdd: apiM + '/system/banner/add', //banner新增
      systemBannerDelete: apiM + '/system/banner/delete', //banner删除

      //运营人员
      operatorAdd: apiM + '/operator/add', //运营人员新增
      operatorList: apiM + '/operator/query', //运营人员列表
      operatorEdit: apiM + '/operator/edit', //运营人员修改
      operatorDetail: apiM + '/operator/detail', //运营人员详情
      operatorPwdReset: apiM + '/operator/password_reset', //运营人员重置密码
      operatorPwdModify: apiM + '/operator/password_modify', //运营人员修改密码（自己密码）
      operatorFreeze: apiM + '/operator/freeze', //运营人员冻结
      operatorUnFreeze: apiM + '/operator/unfreeze', //运营人员解冻

      operateLineAdd: apiM + '/basicdata/line/add', //线路新增
      operateLineEdit: apiM + '/basicdata/line/edit', //线路修改
      operateLineList: apiM + '/basicdata/line/list', //线路列表
      operateLineDelete: apiM + '/basicdata/line/delete', //线路删除

      // 线路退筐
      operateRefundQuery: apiM + '/frame/return/query', // 线路的退筐查询
      operateRefundStoreList: apiM + '/frame/return/store/list', // 可以退筐的门店列表
      operateRefundStoreReturn: apiM + '/frame/return/add', // 退还多个门店的退筐数据
      operateRefundFrameApprove: apiM + '/frame/return/check', //退筐记录审核
      operateRefundFrameReject: apiM + '/frame/return/reject', //退筐记录驳回
      operateRefundFrameExport: apiM + '/frame/return/export', //退筐记录导出

      //常量
      basicdataConfirmTime: apiM + '/basicdata/constant/confirm/time', //截单时间 GET获取，POST设置
      basicdataOrderTime: apiM + '/basicdata/constant/order/time', //下单时间 GET获取，POST设置
      basicdataDeliveryInfo: apiM + '/basicdata/constant/delivery', //运费信息 GET获取，POST设置
      basicdataShipType: apiM + '/basicdata/constant/ship_type', //发货方式 GET获取，POST设置
      basicdataAd: apiM + '/basicdata/constant/ad', //设置广告语 GET获取，POST设置


      //品牌信息配置
      BrandInfo: apiM + '/basicdata/constant/brand', //品牌信息
      CustomerService: apiM + '/basicdata/constant/customer_service', //投诉信息

      // 财务管理
      financeBalanceQuery: apiM + '/balance/query', // 商户余额列表
      financeBalanceEdit: apiM + '/balance/check/add', // 充值/扣款
      financeBalanceLogQuery: apiM + '/merchant/balance/log/query', // 商户流水变更记录
      financeBalanceExport: apiM + '/balance/export', // 商户余额列表导出
      financeBalanceMerchantLogExport: apiM + '/balance/log/export', // 商户流水列表导出

      financeApproveQuery: apiM + '/balance/check/query', // 审核记录(充值/扣款记录)
      financeApproveEdit: apiM + '/balance/check/edit', // 审核
      financeApproveDetail: apiM + '/balance/check/detail', // 审核详情

      financeSupBillQuery: apiM + '/sup_bill/query', //对账单查询
      financeSupBillDetail: apiM + '/sup_bill/detail', //对账单详情
      financeSupBillPay: apiM + '/sup_bill/pay', //批量结款

      financeSupBDetailQuery: apiM + '/sup_bdetail/query', //账单明细详情查询
      financeSupBDetailDetail: apiM + '/sup_bdetail/detail', //账单明细详情
      financeSupBDetailAdd: apiM + '/sup_bdetail/add', //财务人员手动添加账单变更明细
      financeSupBDetailAudit: apiM + '/sup_bdetail/audit', //供应流水审核

      //统计
      statisticalOrderClassSum: apiM + '/statistical/order/class_sum', //统计分析 - 商品销售统计 - 分类别统计
      statisticalOrderItemSum: apiM + '/statistical/order/item_sum', //统计分析 - 商品销售统计 - 商品别统计
      statisticalOrderGradeSum: apiM + '/statistical/order/zone_sum', //统计分析 - 客户订单统计 - 片区级别汇总
      statisticalOrderCitySum: apiM + '/statistical/order/city_sum', //统计分析 - 客户订单统计 - 县域级别汇总
      statisticalOrderMerchantSum: apiM + '/statistical/order/store_sum', //统计分析 - 客户订单统计 - 商户别汇总
      statisticalOrderTotalPriceSum: apiM + '/statistical/order/total_price_sum', //统计分析 - 营收趋势 - 订单金额
      statisticalOrderPayPriceSum: apiM + '/statistical/order/pay_price_sum', //统计分析 - 营收趋势 - 收款金额
      statisticalOrderCount: apiM + '/statistical/order/count', //统计分析 - 营收趋势 - 订单量
      statisticalOrderCustomerPrice: apiM + '/statistical/order/customer_price', //统计分析 - 营收趋势 - 客户单价
      statisticalOrderItemSaleStores: apiM + '/statistical/order/item_sale_stores/query', //统计分析 - 商品 - 商品门店销售统计
      statisticalOrderStoreSaleItems: apiM + '/statistical/order/store_sale_items/query', //统计分析 - 订单 - 客户销售商品明细
      statisticalOrderFourRateCity: apiM + '/statistical/order/four_rate_city', //统计分析 - 业务报表 - 四率表（县域）
      statisticalOrderFourRateZone: apiM + '/statistical/order/four_rate_zone', //统计分析 - 业务报表 - 四率表（片区）
      statisticalOrderTrendCity: apiM + '/statistical/order/trend_city', //统计分析 - 业务报表 - 业务波动表（县域）
      statisticalOrderTrendZone: apiM + '/statistical/order/trend_zone', //统计分析 - 业务报表 - 业务波动表（片区）
      statisticalOrderStoreAnalysis: apiM + '/statistical/order/store_analysis', //统计分析 - 业务报表 - 客户分析表
      statisticalItemDailyAnalysis: apiM + '/statistical/item/day_analysis', //统计分析 - 商品报表 - 商品每日分析 - 商品
      statisticalItemDailyAnalysisClass: apiM + '/statistical/item/day_analysis/class', //统计分析 - 商品报表 - 商品每日分析 - 展示分类
      statisticalItemTrendAnalysis: apiM + '/statistical/item/trend_analysis', //统计分析 - 商品报表 - 商品波动分析 - 商品
      statisticalItemTrendAnalysisBuyer: apiM + '/statistical/item/trend_analysis/buyer', //统计分析 - 商品报表 - 商品波动分析 - 采购员
      statisticalItemTrendAnalysisClass: apiM + '/statistical/item/trend_analysis/class', //统计分析 - 商品报表 - 商品波动分析 - 展示分类
      statisticalItemSingleAnalysis: apiM + '/statistical/item/single_analysis', //统计分析 - 商品报表 - 商品单品分析
      statisticalItemSaleGreatest: apiM + '/statistical/item/sale_greatest', //统计分析 - 商品报表 - 商品单品分析 - 默认商品
      statisticalSumBusinessDelivery: apiM + '/statistical/sum/business_delivery', //统计分析 - 运营统计
      statisticalSumGroupBuyItem: apiM + '/statistical/groupbuy/item/sum', //统计分析 - 团购统计 - 商品统计
      statisticalSumGroupBuyCaptain: apiM + '/statistical/groupbuy/head/sum', //统计分析 - 团购统计 - 团长统计
      statisticalSumGroupBuyCaptainNoGroup: apiM + '/statistical/groupbuy/head/not_offered_sum', //统计分析 - 团购统计 - 团长统计
      statisticalSumGroupBuyMember: apiM + '/statistical/groupbuy/member/sum', //统计分析 - 团购统计 - 团员统计

      statisticalSumGroupBuyHeadExport: apiM + '/statistical/groupbuy/head/export', //统计分析 - 团购统计 - 团长统计 导出
      statisticalSumGroupBuyHeadExportNoGroup: apiM + '/statistical/groupbuy/head/not_offered/export', //统计分析 - 团购统计 - 团长统计(未参团) 导出
      statisticalSumGroupBuyItemExport: apiM + '/statistical/groupbuy/item/export', //统计分析 - 团购统计 - 商品统计 导出
      statisticalSumGroupBuyMemberExport: apiM + '/statistical/groupbuy/member/export', //统计分析 - 团购统计 - 团员统计 导出

    },
    //腾讯Bucket地址
    tencentUpPath: TencentUpPath, //腾讯Bucket上传地址
    tencentPath: TencentPath,//腾讯Bucket下载地址
    isPrintRequestLog: IsPrintRequestLog,// 打印请求日志
    //授板登录(重新登录)
    accreditLogin() {
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
    }
  }
})();

export default Config;
