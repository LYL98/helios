#  helios

#### 更新记录

### 版本 （最新 - 旧）

### 3.6.2
```
更新注意事项
修改sys_permission表
修改：
   1、code == AdvicedItemQuery  修改项:【从dev数据库拷贝】
新增:
   1、code == CityStoreInx  修改项:【从dev数据库拷贝】
   2、code == OperateLineOrderedStoreInx  修改项:【从dev数据库拷贝】
   3、code == ProvinceStoreGeo  修改项:【从dev数据库拷贝】
   
   

   
   

```

### 3.6.0
```
更新注意事项
修改sys_permission表
修改：
   code == ItemTags 修改项：title 【商品运营专区】
   code == ItemGPurchaseAdd 修改项：urls 【商品 - 采购 - 预采】
   code == OperateLineList 修改项：rank 【5】
   code == Deliver 修改项：rank 【6】
   code == OperateRefundFrame 修改项：rank 【7】
   code == OperateTruckLoadMain 修改项：title 【配送专区】
   code == WarehouseOutStorageAdd 修改项：title, url、upper_code
   code == WarehouseInventoryVariation 修改项：url
   code == FinanceSStatementDetail 修改项：url
   code == MerchantAdd       修改项：url
   code == MerchantStoreAdd  修改项：url
   code == MerchantStoreEdit 修改项：url
   code == MerchantRefundQuery 修改项：rank

   code == OperateReceiving => OperateReceivingMain

新增：

   IntentionMerchantQuery
   IntentionMerchantAdd
   IntentionMerchantEdit
   IntentionMerchantAudit
   IntentionMerchantDetail
   IntentionMerchantDelete

   ItemQueryByItemTag
   ItemTagAdd
   ItemTagRankEdit
   ItemTagDelete
   ItemSupDistributePlan
   ItemSupDistributePlanAdd
   ItemSupDistributePlanModify
   ItemSupDistributePlanAudit
   ItemSupDistributePlanClose
   ItemSupDistributeWaybillAdd
   ItemSupDistributeWaybill
   ItemSupDistributeWaybillModify
   ItemSupDistributeWaybillClose

   OperateItem
   OperateItemSupAccept
   OperateItemSupAcceptConfirm
   OperateItemSupStock
   OperateItemSupStockDistribute
   OperateItemSupStockWarehousing
   OperateItemSupStockAllocate
   OperateItemSupStockRecord

   OperateDisTruckLoadMain
   OperateDisTruckLoad
   OperateDisTruckLoadProgress
   OperateDisTruckLoadDelay
   OperateDisTruckLoadEditNum
   OperateDisTruckLoadDetail
   OperateDisTruckLoadAffirm

   OutStoragePlanMain
   DistributeOutStorage
   DistributeOutStorageAdd

   InventoryMarket
   InventoryMarketExport
   InventoryMarketAdd
   InventoryMarketDetail

   OperateReceivingPurchase
   OperateReceivingDistribute

   SystemRoleExport

删除：
   WarehouseInventoryDetailBuyDetail
   WarehouseQualityControl
   WarehouseQualityControlDetail
   WarehouseQualityControlEditNum
   WarehouseQualityControlAdd
   WarehouseQualityControlClose
   WarehouseQualityControlPrint
```

### 3.6.0
```
更新注意事项
修改sys_permission表
修改：
   1、code == OperateTruckLoadMain  修改项: title【从dev数据库拷贝】

```

### 3.5.0
```
更新注意事项
修改sys_permission表
修改：
   1、code == OperateReceivingEditNum  修改项: urls【从dev数据库拷贝】
   2、code == StatisticClient  修改项: urls 【从dev数据库拷贝】
   3、code == WarehouseQualityControlEditNum 修改项: urls【从dev数据库拷贝】
   4、code == WarehouseInventoryMoveExport 修改项: urls【从dev数据库拷贝】

新增：
   StatisticClientProvince
   MarketingStrategy
   MarketingStrategyCity、MarketingStrategyCityAdd、MarketingStrategyCityModify、MarketingStrategyCityDelete
   MarketingStrategyStep、MarketingStrategyStepAdd、MarketingStrategyStepModify、MarketingStrategyStepDelete
   SystemOperatorWechatUnbound
```

### 3.4.0
```
更新注意事项
修改sys_permission表
修改：Province
删除：MerchantStoreEditCity、ProvinceDelete
```

### 3.3.6
```
更新注意事项：
修改sys_permission表
修改：code WarehouseQualityControl 的 title 改成 品控收货
删除：code ItemPriceEditNum
```

### 3.0.0 (重排版本)
```
更新注意事项：
更新服务器run目录下的configBase.js

```


### v1.1.2
```
1、运营管理 - 收货
    收货、修改分别加入权限
2、商品管理 - 商品列表
    未审核的商品可删除
```
```
更新注意事项：
修改sys_permission表
修改：id 174
新增：id 235
```

### v1.2.0
```
更新内容：

1: 【门店管理】增加协议客户筛选，调整列表显示信息，门店名称增加链接跳转，增加门店县域修改

2： 【商品管理】可按展示分类筛选，商品名称可点击跳转，商品图片可放大预览、手动调序。
          商品编号可编辑，增强富文本编辑功能，可支持流媒体，修复部分bug

3:    【订单管理】订单列表可按协议订单筛选，编号可链接至详情，详情显示县域信息，增加手动取消订单的功能
        售后列表增加商品编号/名称的筛选条件，优化列表显示信息，售后单号可链接至详情页修复部分bug。
        优化订单、售后单列表和详情页信息标签显示不完整的问题
        统一订单和售后单的权限，可双向查看，增加客服的可回复字数至1000字节


4: 【统计】商品销售统计部分增加采购员、展示分类的筛选条件
          优化商品销售统计的信息筛选效率
         打印商品标签加入全部县，单个商品、单个客户可打印
  导出表格增加商品按门店、线路两个维度的sheet，以及客户余额列表、客户流水明细、商户充值、扣款类型的sheet，调整导出表格的归类

6:     【系统设置】运营人员列表可按职位、权限等级筛选，可编辑具体的人员名称、电话号码。新增头像修改信息，增加业务员、配送员、采购员的权限关联
        调整角色列表的选择功能，增加角色和权限修改、运营人员的修改的日志记录。

7:   【其他】优化公用组件编辑默认值的问题
        优化商城页面渲染问题，提高流畅度
        单个门店的订单在截单时合并重新计算运费，多收运费可退还到客户账户余额。
        调整运营中心部分字段。

```
```
更新注意事项：

修改sys_permission表

```

### v2.0.0
```
更新内容：

1:【门店管理】
   新增：
      门店筐信息查询、门店退筐修改、门店退筐变更记录。
   修改：
      门店详情布局调整。

2:【商品管理】

3:【订单管理】
   修改：
      订单详情布局调整及部分展示逻辑；
      售后详情布局调整及部分展示逻辑。

4:【配送管理】
   新增：
      退筐功能。

5:【统计】

6:【基础信息】

7:【系统设置】

8:【其他】
   新增：
      ButtonGroup组件 @/common/ButtonGroup
      SelectLine组件 @/common/SelectLine
   修改：
      图片预览时，可对图片进行缩放;
      查询列表头部样式调整；
      查询列表固定高度，分页样式统一。

```
```
更新注意事项：

修改sys_permission表
   新增ID：247、248、249、250、251、252

```
### v2.1.0
```
更新内容：

1:【门店管理】

2:【采购管理】
   新增：
      供应商管理
      采购商品管理

3:【商品管理】
   新增：
      促销活动
      优惠券

4:【订单管理】
   修改：
      订单详情中，单品打折以及优惠券使用记录
      售后详情中，商品使用单品打折的记录
      售后列表查询中添加根据下单时间查询的字段，删除售后单创建时间的查询

5:【配送管理】

6:【统计】

7:【基础信息】

8:【系统设置】

9:【其他】
   修改：
      将列表页面进行组件划分：查询组件、表格组件、表单组件
      列表页面中查询区域的UI统一
      主题颜色的重新调整
```
```
更新注意事项：
1、在根目录添加configBase.js文件，内容为configSample.js的内容，修改链接

2、修改sys_permission表
    新增ID：151、 [254 ~ 285]
```


### v2.2.0

```
更新注意事项：
修改sys_permission表
  修改ID：1、4、29、93、138、145、146、147、148、149、151、165、166、247、252、[254 ~ 285]
  新增ID：287、288、289、290、291、292、293、294、295
```

### v2.3.0
```
更新注意事项：
修改sys_permission表
  修改ID: 147、148、149、150、[276 ~ 285]
  新增ID: 297、298、299、300、301、302
```

### v2.4.0
```
更新注意事项：
修改sys_permission表
  修改ID: 149、150、180、3、4、7、8、9、12、13、16、17、18、19、21、22、24、25、27、28、31、35、94、96、137、140、205、229、238、255、256、257、258、259、267、262、292、293
  新增ID: 305、306、307、308、309、310、311、312、313、314、315、316、318
  删除ID：19、20
```

### 2.5.0
```
更新注意事项：
修改sys_permission表
  修改ID: 276、277、278、279、285
  新增ID: 319、320、321、322、323、324、325、326、327、328、329、335、336

部署注意事项：
    需要删除生产环境中 前端项目中的node_modules文件夹，再执行打包脚本。
```

### 2.6.0
```
更新注意事项：
修改sys_permission表
  修改ID: 145、146、147、148、149、150、151、180、265、272、273、279、285、290、291、305、320、322、323、324、325、326、327
  新增ID: 337、338、339、340、341、345、346、347、348、349、350、351、352、353
  删除ID：328、329、335、336、324

部署注意事项：
```

### 2.7.0
```
更新注意事项：
修改sys_permission表
  修改ID: 
  新增ID: 354、355、356、357、358、360、361
  删除ID：

部署注意事项：
```

### 2.9.0
```
更新configBase文件
```

### 3.0.0
```
更新注意事项：
修改sys_permission表
  修改ID: 
  新增ID: 368
  删除ID：
```

### 3.0.1
```
更新注意事项：
修改sys_permission表
  修改ID: 338、339
  新增ID: 370、371
  删除ID：341、
```

### 3.0.2
```
更新注意事项：
修改sys_permission表
  修改ID: 
  新增ID: 375
  删除ID：
```

### 3.2.0
```
更新注意事项：
修改sys_permission表
  修改ID: 275、381、244
  新增ID: 377
  删除ID：
```