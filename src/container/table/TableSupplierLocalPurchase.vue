<template>
  <div class="container-table">
    <!--头部-->
    <div class="table-top" v-if="auth.isAdmin || auth.SupplierLocalPurchaseAdd || auth.SupplierLocalPurchaseAudit || auth.SupplierLocalPurchaseExport">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.SupplierLocalPurchaseAudit" @click="handleShowForm('FormAudit', { ids: returnListKeyList('id', multipleSelection) })" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.SupplierLocalPurchaseExport" @click.native="handleExport('fromSupplierOrderExport', query)" size="mini" type="primary" plain>导出地采单</el-button>
        <el-button v-if="auth.isAdmin || auth.SupplierLocalPurchaseAdd" @click="handleShowAddEdit('AddEditSupplierLocalPurchase', null, 'add')" size="mini" type="primary">新增</el-button>
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
        @selection-change="handleSelectionChange"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="selection" :selectable="returnAuditStatus" width="42" v-if="(auth.isAdmin || auth.SupplierLocalPurchaseAudit)"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--编号-->
              <template v-if="item.key === 'code'">
                <div class="td-item">
                  <div class="link-item link-item add-dot2" @click="handleShowAddEdit('AddEditSupplierLocalPurchase', scope.row, 'detail')" v-if="auth.isAdmin || auth.SupplierLocalPurchaseDetail">
                    {{scope.row.code}}
                  </div>
                  <div class="add-dot2" v-else>{{scope.row.code}}</div>
                </div>
              </template>
              <!--供应商-->
              <div v-else-if="item.key === 'supplier'" class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item.code}}/{{scope.row.item.title}}</div>
              <!--采购单价-->
              <div v-else-if="item.key === 'price_buy'" class="td-item add-dot2">&yen;{{returnPrice(scope.row.price_buy)}}</div>
              <!--采购总金额-->
              <div v-else-if="item.key === 'num_price'" class="td-item add-dot2">&yen;{{returnPrice(scope.row.num * scope.row.price_buy + scope.row.num * scope.row.frame_price)}}</div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="purchaseStatusType[scope.row.status]" disable-transitions>
                  {{purchaseStatus[scope.row.status]}}
                </el-tag>
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
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.SupplierLocalPurchaseDetail,
                  command: () => handleShowAddEdit('AddEditSupplierLocalPurchase', scope.row, 'detail')
                },
                {
                  title: '修改',
                  isDisplay: (auth.isAdmin || auth.SupplierLocalPurchaseEdit) && scope.row.status === 'init',
                  command: () => handleShowAddEdit('AddEditSupplierLocalPurchase', scope.row, 'edit')
                },
                {
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.SupplierLocalPurchaseAudit) && scope.row.status === 'init',
                  command: () => handleShowForm('FormAudit', { ids: [scope.row.id] })
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.SupplierLocalPurchaseAudit" @click="handleShowForm('FormAudit', { ids: returnListKeyList('id', multipleSelection) })" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
      </div>
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

  export default {
    name: 'TableSupplierLocalPurchase',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QuerySupplierLocalPurchase');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableSupplierLocalPurchase',
        tableColumn: [
          { label: '地采单号', key: 'code', width: '2', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '3', isShow: true },
          { label: '供应商', key: 'supplier', width: '3', isShow: true },
          { label: '采购价', key: 'price_buy', width: '2', isShow: true },
          { label: '采购数量', key: 'num', width: '2', isShow: true },
          { label: '采购总金额', key: 'num_price', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '采购日期', key: 'order_date', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        purchaseStatus: Constant.PURCHASE_STATUS(),
        purchaseStatusType: Constant.PURCHASE_STATUS_TYPE,
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierLocalPurchaseQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //返回是否可选择
      returnAuditStatus(d){
        return d.status === 'init' ? true : false;
      }
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
