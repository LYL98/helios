<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="{'采购': 'pur', '调拨': 'distribute'}"/>
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
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--采购、调拨数量-->
              <div v-else-if="item.key === 'order_num'" class="td-item add-dot2">{{scope.row.relate_order.num}}件</div>
              <!--已入库数量-->
              <div v-else-if="judgeOrs(item.key, ['num', 'num_in'])" class="td-item add-dot2">{{returnUnit(scope.row[item.key], '件', '-')}}</div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_storehouse', 'tar_storehouse'])" class="td-item add-dot2">{{scope.row.relate_order[item.key].title}}</div>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '确认入库',
                  isDisplay: (auth.isAdmin || auth.WarehouseStockPendingAdd) && scope.row.status !== 'all_in',
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
                  command: () => handleShowPrint('PrintWarehouseStockPending', {...scope.row, order_type: scope.row.in_type, id: scope.row.relate_order_id})
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
      //初始化在query组件
    },
    data() {
      return {
        tabValue: 'pur', //'采购': 'pur', '调拨': 'distribute'
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
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supInStockShMonitorQuery, {
          ...query,
          type_forsh: this.tabValue
        });
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
        let pc = this.getPageComponents('QueryWarehouseStockPending');
        this.getData(pc.query);
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
        if(tabValue === 'pur'){
          tableColumn = tableColumn.concat([
            { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
            { label: '采购数量', key: 'order_num', width: '2', isShow: true }
          ]);
        }else{
        //调拨
          tableColumn = tableColumn.concat([
            { label: '调出仓', key: 'src_storehouse', width: '2', isShow: true },
            { label: '调拨数量', key: 'order_num', width: '2', isShow: true },
            { label: '调入仓', key: 'tar_storehouse', width: '2', isShow: true }
          ]);
        }
        tableColumn = tableColumn.concat([
          { label: '待入库数量', key: 'num', width: '2', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '已入库数量', key: 'num_in', width: '2', isShow: true },
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
