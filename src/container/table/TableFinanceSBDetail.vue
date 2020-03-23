<template>
  <div class="container-table">
    <div class="table-top" v-if="(page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailAdd)) || (page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailExport)) || returnSelectionAuth">
      <div class="left">
        <el-button v-if="page === 'sBDetailAudit' && (auth.isAdmin || auth.FinanceSBDetailAuditAudit)"
          @click="handleShowForm('FormAudit', {ids: returnListKeyList('id', multipleSelection)})" size="mini" type="primary"
          :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
        <el-button v-if="page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailPay)"
          @click="handlePay(returnListKeyList('id', multipleSelection))" size="mini" type="primary"
          :disabled="multipleSelection.length === 0 ? true : false">批量结款</el-button>
      </div>
      <div class="right">
        <el-button v-if="page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailExport)" @click.native="handleExport('supBdetailExport', query)" size="mini" type="primary" plain>导出流水</el-button>
        <el-button v-if="page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailAdd)" @click="handleShowAddEdit('AddEditFinanceSBDetail')" size="mini" type="primary">手动新增</el-button>
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
        <el-table-column type="selection" :selectable="returnAuditStatus" width="42" v-if="returnSelectionAuth"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--名称-->
              <div v-if="item.key === 'supplier'" class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              <!--结算类型-->
              <div v-else-if="item.key === 'bill_term'" class="td-item">{{supplierBillTerm[scope.row.bill_term]}}</div>
              <!--流水类型-->
              <div v-else-if="item.key === 'bill_reason'" class="td-item">{{billReason[scope.row.bill_reason]}}</div>
              <!--金额-->
              <div v-else-if="item.key === 'bill_amount'" class="td-item">
                <div class="amount">
                  <div v-if="scope.row.bill_amount === 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
                  <div class="up" v-else-if="scope.row.bill_amount > 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
                  <div class="down" v-else>&yen;{{returnPrice(Math.abs(scope.row.bill_amount))}}</div>
                </div>
              </div>
              <!--状态-->
              <div v-else-if="item.key === 'paid_status'" class="td-item">
                <el-tag size="small" :type="paidStatusType[scope.row.paid_status]" disable-transitions>{{paidStatus[scope.row.paid_status]}}</el-tag>
              </div>
              <!--创建人-->
              <div v-else-if="item.key === 'creator'" class="td-item">{{scope.row.creator.realname || '系统'}}</div>
              <!--审核状态-->
              <div v-else-if="item.key === 'audit_status'" class="td-item">
                <el-tag size="small" :type="auditStatusType[scope.row.audit_status]" disable-transitions>{{auditStatus[scope.row.audit_status]}}</el-tag>
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
                  isDisplay: auth.isAdmin || auth.FinanceSBDetailAuditDetail,
                  command: () => handleShowAddEdit('AddEditFinanceSBDetail', scope.row, 'detail')
                },
                {
                  title: '结款',
                  isDisplay: page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailAuditPay) && scope.row.bill_term === 0 && scope.row.paid_status === 'init',
                  command: () => handlePay([scope.row.id])
                },
                {
                  title: '审核',
                  isDisplay: page === 'sBDetailAudit' && (auth.isAdmin || auth.FinanceSBDetailAuditAudit) && scope.row.audit_status === 'init',
                  command: () => handleShowForm('FormAudit', {ids: [scope.row.id]})
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button v-if="page === 'sBDetailAudit' && (auth.isAdmin || auth.FinanceSBDetailAuditAudit)"
          @click="handleShowForm('FormAudit', {ids: returnListKeyList('id', multipleSelection)})" size="mini" type="primary"
          :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
        <el-button v-if="page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailPay)"
          @click="handlePay(returnListKeyList('id', multipleSelection))" size="mini" type="primary"
          :disabled="multipleSelection.length === 0 ? true : false">批量结款</el-button>
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
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'TableFinanceSBDetail',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryFinanceSBDetail');
      this.getData(pc.query);
    },
    props: {
      page: { type: String, default: '' }, //审核页面：sBDetailAudit, 流水页面：sBDetail
    },
    data() {
      let tableColumn = [
        { label: '供应商名称', key: 'supplier', width: '3', isShow: true },
        { label: '结算类型', key: 'bill_term', width: '2', isShow: true },
        { label: '流水类型', key: 'bill_reason', width: '2', isShow: true },
        { label: '金额', key: 'bill_amount', width: '2', isShow: true },
        { label: '状态', key: 'paid_status', width: '2', isShow: true },
        { label: '创建人', key: 'creator', width: '2', isShow: true },
      ];

      //审核页面
      if(this.page === 'sBDetailAudit'){
        tableColumn = tableColumn.concat([
          { label: '备注', key: 'remark', width: '3', isShow: true },
          { label: '审核状态', key: 'audit_status', width: '2', isShow: true },
        ]);
      }

      tableColumn = tableColumn.concat([
        { label: '创建时间', key: 'created', width: '3', isShow: true },
        { label: '更新时间', key: 'updated', width: '3', isShow: false },
      ]);

      return {
        tableName: 'TableFinanceSBDetail',
        tableColumn: tableColumn,
        paidStatus: Constant.S_STATEMENT_PAID_STATUS(),
        paidStatusType: Constant.S_STATEMENT_PAID_STATUS_TYPE,
        supplierBillTerm: Constant.SUPPLIER_BILL_TERM2(),
        billReason: Constant.SUPPLIER_BILL_REASON(),
        auditStatus: Constant.AUDIT_STATUS(),
        auditStatusType: Constant.AUDIT_STATUS_TYPE,
      }
    },
    computed: {
      //批量选择权限
      returnSelectionAuth(){
        let { page, auth } = this;
        if(page === 'sBDetailAudit' && (auth.isAdmin || auth.FinanceSBDetailAuditAudit)) return true;
        if(page === 'sBDetail' && (auth.isAdmin || auth.FinanceSBDetailPay)) return true;
        return false;
      },
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.financeSupBDetailQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //返回是否可选择
      returnAuditStatus(d){
        let { page } = this;
        if(page === 'sBDetailAudit' && d.audit_status === 'init'){
          return true;
        }
        if(page === 'sBDetail' && d.bill_term === 0 && d.paid_status === 'init'){
          return true;
        }
        return false;
      },
      //结款
      handlePay(ids){
        this.$messageBox.confirm('确认已给选择的供应商结款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({isShow: true});
            let res = await Http.post(Config.api.financeSupBDetailPay, { ids });
            this.$loading({isShow: false});
            if(res.code === 0){
              this.$message({message: '已结款', type: 'success'});
              this.getData(this.query);
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      }
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
