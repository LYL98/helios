<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="handleTableColumn" :tab-panes="{'采购': 'purchase', '调拨': 'allot'}"/>
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
                <div v-if="auth.isAdmin || auth.WarehouseStockPendingDetail"
                  class="td-item link-item add-dot2" @click="handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail_' + tabValue)">
                  {{scope.row.code}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}
                </div>
              </div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}<br/>{{scope.row.item_title}}</div>
              <!--采购、调拨数量、入库数量-->
              <div v-else-if="judgeOrs(item.key, ['num', 'num_in'])" class="td-item add-dot2">{{scope.row[item.key]}}件</div>
              <!--日期-->
              <div v-else-if="item.key === 'date'" class="td-item add-dot2">
                {{scope.row.purchase_date || scope.row.order_date || scope.row.available_date}}
              </div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_store_house', 'tar_store_house'])" class="td-item add-dot2">{{scope.row[item.key].title}}</div>
              <!--状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="inventoryStatusType[scope.row.status]" disable-transitions>
                  {{inventoryStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '入库',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingAdd,
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'add_' + tabValue)
                },
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingDetail,
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail_' + tabValue)
                },
                {
                  title: '打印',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingPrint,
                  command: () => handleShowPrint('PrintWarehouseStockPending', scope.row)
                },
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
    name: 'TableWarehouseStockPending',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      this.handleTableColumn();
    },
    data() {
      return {
        tabValue: 'purchase', //'采购': 'purchase', '调拨': 'allot'
        inventoryStatus: Constant.INVENTORY_STATUS(),
        inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
        tableName: 'TableWarehouseStockPending',
        tableColumn: [],
      }
    },
    methods: {
      //key
      getRowIdentifier(row){
        return row.id + (row.order_type || '');
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        let apis = {
          purchase: Config.api.supPurchaseQuery,
          allot: Config.api.supDistributeQuery
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
      //处理表头
      handleTableColumn(){
        let { tableColumn, tabValue } = this;
        this.$data.dataItem = {
          items: [],
          num: 0
        };
        tableColumn = [
          { label: '采购单号', key: 'code', width: '3', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true }
        ];
        //采购
        if(tabValue === 'purchase'){
          tableColumn = tableColumn.concat([
            { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
            { label: '采购数量', key: 'num', width: '2', isShow: true },
            { label: '采购日期', key: 'date', width: '3', isShow: true }
          ]);
        }else{
        //调拨
          tableColumn = tableColumn.concat([
            { label: '调出仓', key: 'src_store_house', width: '3', isShow: true },
            { label: '调拨数量', key: 'num', width: '2', isShow: true },
            { label: '调入仓', key: 'tar_store_house', width: '3', isShow: true },
            { label: '可售日期', key: 'date', width: '3', isShow: true }
          ]);
        }
        tableColumn = tableColumn.concat([
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '入库数量', key: 'num_in', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ]);
        this.$data.tableColumn = tableColumn;
        let pc = this.getPageComponents('QueryWarehouseStockPending');
        pc.$data.query.page = 1;
        this.getData(pc.query);
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
