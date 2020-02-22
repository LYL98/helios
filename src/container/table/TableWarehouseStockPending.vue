<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.WarehouseStockPendingExport">
      <div class="left"></div>
      <div class="right">
        <el-button @click.native="handleExport('supInStockExport', query)" size="mini" type="primary" plain>导出入库单</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
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
              <!--采购编号、调拨单号-->
              <div v-if="item.key === 'code'" class="td-item add-dot2">
                <div v-if="auth.isAdmin || auth.WarehouseStockPendingDetail"
                  class="td-item link-item add-dot2" @click="handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail_' + scope.row.in_type)">
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
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'add_' + scope.row.in_type)
                },
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingDetail,
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail_' + scope.row.in_type)
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
      //初始化在query组件
    },
    data() {
      return {
        inventoryStatus: Constant.INVENTORY_STATUS(),
        inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
        tableName: 'TableWarehouseStockPending',
        tableColumn: [
          { label: '入库单号', key: 'code', width: '3', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '批次', key: 'batch_code', width: '3', isShow: true },
          { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
          { label: '入库数量', key: 'num', width: '2', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ],
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supInStockShMonitorQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
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
