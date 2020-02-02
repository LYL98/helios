<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="{'采购': 'purchase', '调拨': 'allot', '出库计划': 'out_storage'}"/>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="getRowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--采购编号、调拨单号-->
              <div v-if="item.key === 'code'" class="td-item add-dot2">
                <div v-if="auth.isAdmin || auth.OperateReceivingDetail"
                  class="td-item link-item add-dot2" @click="handleShowAddEdit('AddEditOperateReceiving', scope.row, 'detail_' + tabValue)">
                  {{scope.row.code}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}
                </div>
              </div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--采购、调拨数量、入库数量-->
              <div v-else-if="judgeOrs(item.key, ['num', 'num_out'])" class="td-item add-dot2">{{scope.row[item.key] ? scope.row[item.key] + '件' : '-'}}</div>
              <!--缺货-->
              <div v-else-if="item.key === 'stockout'" class="td-item add-dot2">{{returnStockout(scope.row)}}</div>
              <!--日期-->
              <div v-else-if="item.key === 'date'" class="td-item add-dot2">
                {{scope.row.purchase_date || scope.row.order_date || scope.row.available_date}}
              </div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_storehouse', 'tar_storehouse'])" class="td-item add-dot2">{{scope.row[item.key].title}}</div>
              <!--采购、调拨状态-->
              <div class="td-item add-dot2" v-else-if="judgeOrs(item.key, ['purchase_status', 'allot_status'])">
                <el-tag size="small" :type="inventoryStatusType[scope.row.status]" disable-transitions>
                  {{inventoryStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--出库计划状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'out_storage_status'">
                <el-tag size="small" type="info" disable-transitions v-if="scope.row.num_out > 0">已出库</el-tag>
                <el-tag size="small" type="info" disable-transitions v-else>未出库</el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '收货',
                  isDisplay: (auth.isAdmin || auth.OperateReceivingAdd) && scope.row.status !== 'all_in' && judgeOrs(tabValue, ['purchase', 'allot']),
                  command: () => handleShowAddEdit('AddEditOperateReceiving', scope.row, 'add_' + tabValue)
                },
                {
                  title: '出库',
                  isDisplay: (auth.isAdmin || auth.OperateReceivingOutStorage) && tabValue === 'out_storage',
                  command: () => handleShowDetail('DetailWarehouseInventory', {
                    ...scope.row,
                    p_item: {
                      id: scope.row.item_id
                    }
                  })
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent='this'/>
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/container/table/table.mixin';
  import queryTabs from './QueryTabs';

  export default {
    name: 'TableOperateReceiving',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      this.handleTableColumn();
      let pc = this.getPageComponents('QueryOperateReceiving');
      this.getData(pc.query);
    },
    data() {
      return {
        tabValue: 'purchase', //'采购': 'purchase', '调拨': 'allot', '出库计划': 'out_storage'
        inventoryStatus: Constant.INVENTORY_STATUS(),
        inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
        tableName: 'TableOperateReceiving',
        tableColumn: [],
      }
    },
    methods: {
      //返回缺货
      returnStockout(data){
        if(data.num_in <= 0 || data.num_in === data.num){
          return '-';
        }
        return (data.num_in - data.num) + '件'
      },
      //key
      getRowIdentifier(row){
        return row.id + (row.order_type || '');
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        let apis = {
          purchase: Config.api.supPurchaseQuery,
          allot: Config.api.supDistributeQuery,
          out_storage: Config.api.supOutPlanQuery
        }
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(apis[this.tabValue], query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //切换记录tab
      changeTab(){
        this.handleTableColumn();
        let pc = this.getPageComponents('QueryOperateReceiving');
        pc.$data.tabValue = this.tabValue;
        pc.$data.query.page = 1;
        pc.$data.query.status = '';
        this.getData(pc.query);
      },
      //处理表头
      handleTableColumn(){
        let { tableColumn, tabValue } = this;
        this.$data.dataItem = {
          items: [],
          num: 0
        };
        tableColumn = [];
        //采购
        if(tabValue === 'purchase'){
          tableColumn = tableColumn.concat([
            { label: '采购单号', key: 'code', width: '3', isShow: true },
            { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
            { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
            { label: '应收货', key: 'num', width: '2', isShow: true },
            { label: '未收货', key: 'num', width: '2', isShow: true },
            { label: '缺货', key: 'stockout', width: '3', isShow: true },
            { label: '状态', key: 'purchase_status', width: '2', isShow: true },
          ]);
        }
        //调拨
        else if(tabValue === 'allot'){
          tableColumn = tableColumn.concat([
            { label: '调拨单号', key: 'code', width: '3', isShow: true },
            { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
            { label: '调出仓', key: 'src_storehouse', width: '3', isShow: true },
            { label: '应收货', key: 'num', width: '2', isShow: true },
            { label: '缺货', key: 'stockout', width: '3', isShow: true },
            { label: '状态', key: 'allot_status', width: '2', isShow: true },
          ]);
        }
        //出库计划
        else{
          tableColumn = tableColumn.concat([
            { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
            { label: '应出库', key: 'num', width: '3', isShow: true },
            { label: '状态', key: 'out_storage_status', width: '2', isShow: true },
            { label: '已出库', key: 'num_out', width: '3', isShow: true },
          ]);
        }
        tableColumn = tableColumn.concat([
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ]);
        this.$data.tableColumn = tableColumn;
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
