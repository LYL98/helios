<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="query.status" @change="getData(query)" :tab-panes="{'采购': 'a', '调拨': 'b'}"/>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
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
                <div v-if="auth.isAdmin || auth.WarehouseStockPendingDetail"
                  class="td-item link-item add-dot2" @click="handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail')">
                  {{scope.row.item.code}}<br/>{{scope.row.item.title}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.item.code}}<br/>{{scope.row.item.title}}
                </div>
              </div>
              <!--供应商-->
              <div v-else-if="item.key === 'supplier'" class="td-item add-dot2">
                <!--{{scope.row.supplier.title}}-->123
              </div>
              <!--科学分类-->
              <div class="td-item add-dot2" v-else-if="item.key === 'system_class'">苹果</div>
              <!--库存-->
              <div class="td-item" v-else-if="item.key === 'inventory'">10000件</div>
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
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'add')
                },
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingDetail,
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail')
                },
                {
                  title: '打印',
                  isDisplay: auth.isAdmin || auth.WarehouseStockPendingPrint,
                  command: () => handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail')
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
  import { Http, Config } from '@/util';
  import tableMixin from '@/container/table/table.mixin';
  import queryTabs from './QueryTabs';

  export default {
    name: 'TableWarehouseStockPending',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryWarehouseStockPending');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableWarehouseStockPending',
        tableColumn: [
          { label: '采购单号', key: 'code', width: '3', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '供应商', key: 'supplier', width: '3', isShow: true },
          { label: '采购数量', key: 'inventory', width: '2', isShow: true },
          { label: '采购日期', key: 'inventory', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '入库数量', key: 'num', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierGPurchaseQuery, query);
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
