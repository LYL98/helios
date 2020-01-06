<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.WarehouseInventoryAdd || auth.WarehouseInventoryAudit || auth.WarehouseInventoryExport">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.WarehouseInventoryExport" @click.native="handleExport('inventoryExport', query)" size="mini" type="primary" plain>导出库存</el-button>
      </div>
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
                <div v-if="auth.isAdmin || auth.WarehouseInventoryDetail"
                  class="td-item link-item add-dot2" @click="handleShowDetail('DetailWarehouseInventory', scope.row, 'detail')">
                  {{scope.row.item.code}}<br/>{{scope.row.item.title}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.item.code}}<br/>{{scope.row.item.title}}
                </div>
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
        <el-table-column label="操作" width="74">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '管理',
                  isDisplay: auth.isAdmin || auth.WarehouseInventoryDetail,
                  command: () => handleShowDetail('DetailWarehouseInventory', scope.row, 'detail')
                },
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <!--<el-button type="danger" size="mini" disabled>批量删除</el-button>-->
      </div>
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

  export default {
    name: 'TableWarehouseInventory',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryWarehouseInventory');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableWarehouseInventory',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '科学分类', key: 'system_class', width: '3', isShow: true },
          { label: '库存', key: 'inventory', width: '3', isShow: true },
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
