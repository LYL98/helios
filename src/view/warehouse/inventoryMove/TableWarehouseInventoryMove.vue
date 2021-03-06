<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="queryTabsData"/>
      </div>
      <div class="right" v-if="auth.isAdmin || auth.WarehouseInventoryMoveExport">
        <el-button @click.native="handleExport('supStockRecordExport', query)" size="mini" type="primary" plain>
          导出全部库存记录
        </el-button>
        <el-button @click.native="handleExport(types[tabValue].export_api, query)" size="mini" type="primary" plain>
          {{types[tabValue].export_srt}}
        </el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">
                <template v-if="scope.row.p_item">{{scope.row.p_item.title}}/{{scope.row.p_item.code}}</template>
                <template v-else>{{scope.row.item_code}}/{{scope.row.item_title}}</template>
              </div>
              <!--数量-->
              <div v-else-if="judgeOrs(item.key, ['num', 'num_in', 'num_before', 'num_after'])" class="td-item add-dot2">{{scope.row[item.key]}}件</div>
              <!--盘点数量-->
              <div v-else-if="item.key === 'num_check'" class="td-item add-dot2">{{scope.row.num_after - scope.row.num_before}}件</div>
              <!--盘点类型-->
              <div v-else-if="item.key === 'check_type'" class="td-item add-dot2">{{returnCheckType(scope.row)}}</div>
              <!--仓-->
              <div v-else-if="judgeOrs(item.key, ['storehouse', 'src_storehouse', 'tar_storehouse'])">{{scope.row[item.key].title}}</div>
              <!--仓/库-->
              <div v-else-if="item.key === 'storehouse_warehouse'">{{scope.row.storehouse.title}}/{{scope.row.warehouse.title}}</div>
              <!--仓/库/托盘-->
              <div v-else-if="item.key === 'storehouse_warehouse_tray'">{{scope.row.storehouse.title}}/{{scope.row.warehouse.title}}/{{scope.row.tray.code}}</div>
              <!--仓/库/托盘-->
              <div v-else-if="item.key === 'src_storehouse_warehouse_tray'">{{scope.row.src_storehouse.title}}/{{scope.row.src_warehouse.title}}/{{scope.row.src_tray.code}}</div>
              <!--仓/库/托盘-->
              <div v-else-if="item.key === 'tar_storehouse_warehouse_tray'">{{scope.row.tar_storehouse.title}}/{{scope.row.tar_warehouse.title}}/{{scope.row.tar_tray.code}}</div>
              <!--日期-->
              <div v-else-if="item.key === 'date'" class="td-item add-dot2">
                {{scope.row.order_date || scope.row.available_date}}
              </div>
              <!--变动数量-->
              <div v-else-if="item.key === 'chg_num'" class="td-item add-dot2">
                {{scope.row.opt_type === 'stocked_qa' ? '-' : scope.row.chg_num + '件'}}
              </div>
              <!--过期时间-->
              <div v-else-if="judgeOrs(item.key, ['due_date', 'stock_due_date'])" class="td-item add-dot2">
                {{scope.row.opt_type === 'stocked_qa' ? scope.row[item.key] : '-'}}
              </div>
              <!--变动类型-->
              <div class="td-item add-dot2" v-else-if="item.key === 'opt_type'">
                <el-tag size="small" :type="supOptTypesType[scope.row.opt_type]" disable-transitions>
                  {{supOptTypes[scope.row.opt_type]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseInventoryMoveDetail,
                  command: () => handleShowDetail(types[tabValue].detail, scope.row)
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
  import tableMixin from '@/share/mixin/table.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: 'TableWarehouseInventoryMove',
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
        tabValue: 'in_storage',
        tableName: 'TableWarehouseInventoryMove',
        tableColumn: [],
        queryTabsData: {
          '入库': 'in_storage',
          '盘点': 'check',
          '上架': 'putaway',
          '变动': 'variation',
          '移库': 'move',
          '出库': 'out_storage',
        },
        types: {
          in_storage: {
            detail: 'DetailWarehouseInventoryMoveInStorage',
            api: Config.api.supInStockQuery,
            export_api: 'supInStockExport',
            export_srt: '导出入库记录'
          },
          check: {
            detail: 'DetailWarehouseInventoryMoveCheck',
            api: Config.api.supCheckQuery,
            export_api: 'supCheckExport',
            export_srt: '导出盘点记录'
          },
          putaway: {
            detail: 'DetailWarehouseInventoryMovePutaway',
            api: Config.api.supOnGroundQuery,
            export_api: 'supOnGroundExport',
            export_srt: '导出上架记录'
          },
          variation: {
            detail: 'DetailWarehouseInventoryMoveVariation',
            api: Config.api.supModifyQuery,
            export_api: 'supModifyExport',
            export_srt: '导出变动记录'
          },
          move: {
            detail: 'DetailWarehouseInventoryMoveMove',
            api: Config.api.supMoveQuery,
            export_api: 'supMoveExport',
            export_srt: '导出移库记录'
          },
          out_storage: {
            detail: 'DetailWarehouseInventoryMoveOutStorage',
            api: Config.api.supOutQuery,
            export_api: 'supOutExport',
            export_srt: '导出出库记录'
          }
        },
        supOptTypes: Constant.SUP_OPT_TYPES(),
        supOptTypesType: Constant.SUP_OPT_TYPES_TYPE,
      }
    },
    methods: {
      //返回盘点类型
      returnCheckType(data){
        if(data.num_after - data.num_before > 0){
          return '盘盈';
        }
        if(data.num_after - data.num_before < 0){
          return '盘亏';
        }
        return '正常';
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        let { types } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(this.types[this.tabValue].api, query);
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
        let pc = this.getPageComponents('QueryWarehouseInventoryMove');
        pc.$data.tabValue = this.tabValue;
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
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '批次', key: 'batch_code', width: '3', isShow: true }
        ];
        //入库
        if(tabValue === 'in_storage'){
          tableColumn = tableColumn.concat([
            { label: '仓库', key: 'storehouse_warehouse', width: '3', isShow: true },
            { label: '入库数量', key: 'num', width: '2', isShow: true },
          ]);
        }
        //盘点
        else if(tabValue === 'check'){
          tableColumn = tableColumn.concat([
            { label: '仓库', key: 'storehouse_warehouse_tray', width: '3', isShow: true },
            { label: '盘点前库存', key: 'num_before', width: '2', isShow: true },
            { label: '盘点类型', key: 'check_type', width: '3', isShow: true },
            { label: '盘点后库存', key: 'num_after', width: '2', isShow: true },
            { label: '盘点数量', key: 'num_check', width: '2', isShow: true },
          ]);
        }
        //上架
        else if(tabValue === 'putaway'){
          tableColumn = tableColumn.concat([
            { label: '上架托盘', key: 'storehouse_warehouse_tray', width: '3', isShow: true },
            { label: '上架数量', key: 'num', width: '3', isShow: true }
          ]);
        }
        //变动
        else if(tabValue === 'variation'){
          tableColumn = tableColumn.concat([
            { label: '仓库', key: 'storehouse_warehouse_tray', width: '3', isShow: true },
            { label: '变动类型', key: 'opt_type', width: '3', isShow: true },
            { label: '变动数量', key: 'chg_num', width: '2', isShow: true },
            { label: '新商品过期时间', key: 'due_date', width: '3', isShow: true },
            { label: '新库存过期时间', key: 'stock_due_date', width: '3', isShow: true }
          ]);
        }
        //移库
        else if(tabValue === 'move'){
          tableColumn = tableColumn.concat([
            { label: '原仓库', key: 'src_storehouse_warehouse_tray', width: '3', isShow: true },
            { label: '移库数量', key: 'num', width: '2', isShow: true },
            { label: '现仓库', key: 'tar_storehouse_warehouse_tray', width: '3', isShow: true }
          ]);
        }
        //出库
        else if(tabValue === 'out_storage'){
          tableColumn = tableColumn.concat([
            { label: '仓库', key: 'storehouse_warehouse_tray', width: '3', isShow: true },
            { label: '出库数量', key: 'num', width: '2', isShow: true },
            { label: '出库时间', key: 'delivery_date', width: '3', isShow: true }
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
