<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.SupplierGPurchaseDistributeAdd">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.SupplierGPurchaseDistributeAdd" @click="handleShowAddEdit('AddEditSupplierGPurchaseDistribute')" size="mini" type="primary">新增</el-button>
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
              <!--供应商-->
              <template v-if="item.key === 'supplier'">
                <div class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              </template>
              <!--商品名称-->
              <template v-else-if="item.key === 'item'">
                <div class="td-item add-dot2">{{scope.row.item.code}}/{{scope.row.item.title}}</div>
              </template>
              <!--采购人-->
              <template v-else-if="item.key === 'purchaser'">
                <div class="td-item add-dot2">
                  
                </div>
              </template>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'audit_status'">
                <el-tag size="small" :type="auditStatusType[scope.row.audit_status]" disable-transitions>
                  {{auditStatus[scope.row.audit_status]}}
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
                  isDisplay: auth.isAdmin || auth.SupplierGPurchaseDistributeDetail,
                  command: () => handleShowAddEdit('AddEditSupplierGPurchaseDistribute', scope.row, 'detail')
                },
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.SupplierGPurchaseDistributeEdit,
                  command: () => handleShowAddEdit('AddEditSupplierGPurchaseDistribute', scope.row, 'edit')
                },
                {
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.SupplierGPurchaseDistributeAudit) && scope.row.audit_status === 'init',
                  command: () => handleShowForm('FormSupplierGPurchaseDistributeAudit', scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom" v-if="dataItem.num > 0">
      <div class="left">
        <!--<el-button type="danger" size="mini" disabled>批量删除</el-button>-->
      </div>
      <div class="right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableSupplierGPurchaseDistribute',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QuerySupplierGPurchaseDistribute');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableSupplierGPurchaseDistribute',
        tableColumn: [
          { label: '商品', key: 'item', width: '3', isShow: true },
          { label: '供货商', key: 'supplier', width: '3', isShow: true },
          { label: '件数', key: 'num', width: '2', isShow: true },
          { label: '销售日期', key: 'available_date', width: '3', isShow: true },
          { label: '审核状态', key: 'audit_status', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: true },
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
        let res = await Http.get(Config.api.supplierGPurchaseDistributeQuery, query);
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
