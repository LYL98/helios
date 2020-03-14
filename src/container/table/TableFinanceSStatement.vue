<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.FinanceSStatementPay || auth.FinanceSStatementExport">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.FinanceSStatementPay" :disabled="multipleSelection.length === 0 ? true : false" @click="supplierStatementPay('batch')" size="mini" type="primary">批量结款</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.FinanceSStatementExport" @click.native="handleExport('supBillExport', query)" size="mini" type="primary" plain>导出对账单</el-button>
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
        <el-table-column type="selection" :selectable="returnPaidStatus" width="42" v-if="(auth.isAdmin || auth.FinanceSStatementPay)"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--名称-->
              <div v-if="item.key === 'supplier'" class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              <!--账单日期-->
              <div v-else-if="item.key === 'term'" class="td-item">{{scope.row.begin_term}}&nbsp;至&nbsp;{{scope.row.end_term}}</div>
              <!--账单总金额-->
              <div v-else-if="item.key === 'bill_amount'" class="td-item">
                &yen;{{returnPrice(scope.row.bill_amount)}}
              </div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="statusType[scope.row.status]" disable-transitions>{{status[scope.row.status]}}</el-tag>
              </div>
              <!--生成日期-->
              <div class="td-item" v-else-if="item.key === 'created_date'">{{returnDateFormat(scope.row.created, 'yyyy-MM-dd')}}</div>
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
                  title: '结款',
                  isDisplay: (auth.isAdmin || auth.FinanceSStatementPay) && scope.row.status === 'confirmed',
                  command: () => supplierStatementPay(scope.row)
                },
                {
                  title: '查看',
                  isDisplay: auth.isAdmin || auth.FinanceSStatementDetail,
                  command: () => handleShowDetail('DetailFinanceSStatement', scope.row)
                },
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.FinanceSStatementPay" :disabled="multipleSelection.length === 0 ? true : false" @click="supplierStatementPay('batch')" size="mini" type="primary">批量结款</el-button>
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
    name: 'TableFinanceSStatement',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryFinanceSStatement');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableFinanceSStatement',
        tableColumn: [
          { label: '供应商名称', key: 'supplier', width: '3', isShow: true },
          { label: '账单时间', key: 'term', width: '4', isShow: true },
          { label: '账单金额', key: 'bill_amount', width: '2', isShow: true },
          { label: '结款日期', key: 'bill_date', width: '2', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '账期生成日期', key: 'created_date', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        status: Constant.S_STATEMENT_STATUS(),
        statusType: Constant.S_STATEMENT_STATUS_TYPE,
      }
    },
    methods: {
      //返回是否禁用多选
      returnPaidStatus(d){
        return d.status === 'paid' ? false : true
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.financeSupBillQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //结款
      async supplierStatementPay(data){
        let ids = [];
        if(data === 'batch'){
          ids = this.returnListKeyList('id', this.multipleSelection);
        }else{
          ids = [data.id];
        }
        this.$messageBox.confirm('确认结款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.financeSupBillPay, { ids });
          if(res.code === 0){
            this.$message({
              title: '提示',
              message: '已结款',
              type: 'success'
            });
            this.getData(this.query);
          }else{
            this.$message({
              title: '提示',
              message: res.message,
              type: 'error'
            });
          }
        }).catch(() => {
          // console.log('取消');
        });
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
