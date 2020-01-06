<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.SupplierGPurchaseAdd || auth.SupplierGPurchaseAudit || auth.SupplierGPurchaseExport">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.SupplierGPurchaseAudit" @click="handleShowForm('FormAudit', { ids: returnListKeyList('id', multipleSelection) })" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.SupplierGPurchaseExport" @click.native="handleExport('supplierGPurchaseExport', query)" size="mini" type="primary" plain>导出统采单</el-button>
        <el-button v-if="auth.isAdmin || auth.SupplierGPurchaseAdd" @click="handleShowAddEdit('AddEditSupplierGPurchase')" size="mini" type="primary">新增</el-button>
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
        <el-table-column type="selection" :selectable="returnAuditStatus" width="42" v-if="(auth.isAdmin || auth.SupplierGPurchaseAudit)"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--供应商-->
              <div class="td-item add-dot2" v-if="item.key === 'supplier'">{{scope.row.supplier.title}}</div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item.code}}/{{scope.row.item.title}}</div>
              <!--价格-->
              <div class="td-item add-dot2" v-else-if="item.key === 'price'">&yen;{{returnPrice(scope.row.price)}}</div>
              <!--采购总金额-->
              <div class="td-item add-dot2" v-else-if="item.key === 'num_price'">&yen;{{returnPrice(scope.row.num * scope.row.price + scope.row.num * scope.row.frame_price)}}</div>
              <!--采购人-->
              <div class="td-item add-dot2" v-else-if="item.key === 'purchaser'">
                {{scope.row.creator.realname}}<br/>
                {{scope.row.creator.phone}}
              </div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="auditStatusType[scope.row.status]" disable-transitions>
                  {{auditStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.SupplierGPurchaseDetail,
                  command: () => handleShowAddEdit('AddEditSupplierGPurchase', scope.row, 'detail')
                },
                {
                  title: '修改',
                  isDisplay: (auth.isAdmin || auth.SupplierGPurchaseEdit) && scope.row.status === 'init',
                  command: () => handleShowAddEdit('AddEditSupplierGPurchase', scope.row, 'edit')
                },
                {
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.SupplierGPurchaseAudit) && scope.row.status === 'init',
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
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableSupplierGPurchase',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QuerySupplierGPurchase');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableSupplierGPurchase',
        tableColumn: [
          { label: '统采单号', key: 'code', width: '2', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '3', isShow: true },
          { label: '供货商', key: 'supplier', width: '3', isShow: true },
          { label: '采购价', key: 'price', width: '2', isShow: true },
          { label: '采购数量', key: 'num', width: '2', isShow: true },
          { label: '采购总金额', key: 'num_price', width: '3', isShow: true },
          { label: '采购人', key: 'purchaser', width: '2', isShow: false },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '采购日期', key: 'purchase_date', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        auditStatus: Constant.AUDIT_STATUS(),
        auditStatusType: Constant.AUDIT_STATUS_TYPE,
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
