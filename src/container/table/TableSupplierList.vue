<template>
  <div class="container-table">
    <div class="table-top" v-if="(page === 'supplierList' && (auth.isAdmin || auth.SupplierListAdd))">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.SupplierListAdd" @click="handleShowAddEdit('AddEditSupplierList')" size="mini" type="primary">新增</el-button>
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
              <!--名称-->
              <template v-if="item.key === 'title'">
                <div class="td-item">
                  <div class="link-item link-item add-dot2" @click="handleShowAddEdit('AddEditSupplierList', scope.row, 'detail')" v-if="auth.isAdmin || auth.SupplierListDetail">
                    {{scope.row.title}}
                  </div>
                  <div class="add-dot2" v-else>{{scope.row.title}}</div>
                </div>
              </template>
              <!--类型-->
              <div class="td-item" v-else-if="item.key === 'supplier_type'">
                {{supplierType[scope.row.supplier_type]}}
              </div>
              <!--账期-->
              <div class="td-item" v-else-if="item.key === 'bill_term'">
                {{supplierBillTerm[scope.row.bill_term]}}
              </div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <el-tag v-if="!scope.row.is_audited" size="small" type="warning" disable-transitions>待审核</el-tag>
                <el-tag v-else-if="scope.row.is_freeze" size="small" type="danger" disable-transitions>已冻结</el-tag>
                <el-tag v-else size="small" type="info" disable-transitions>正常</el-tag>
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
                  title: '修改',
                  isDisplay: (auth.isAdmin || auth.SupplierListEdit) && page === 'supplierList',
                  command: () => handleShowAddEdit('AddEditSupplierList', scope.row, 'edit')
                },
                {
                  title: '通过审核',
                  isDisplay: (auth.isAdmin || auth.SupplierListAudit) && !scope.row.is_audited && page === 'supplierList',
                  command: () => supplierAudit(scope.row)
                },
                {
                  title: '冻结',
                  isDisplay: (auth.isAdmin || auth.SupplierListFreeze) && !scope.row.is_freeze && page === 'supplierList',
                  command: () => supplierFreeze(scope.row)
                },
                {
                  title: '解冻',
                  isDisplay: (auth.isAdmin || auth.SupplierListUnFreeze) && scope.row.is_freeze && page === 'supplierList',
                  command: () => supplierFreeze(scope.row)
                },
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
    name: 'TableSupplierList',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: '' }, //来自页面
    },
    created() {
      let pc = this.getPageComponents('QuerySupplierList');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableSupplierList',
        tableColumn: [
          { label: '名称', key: 'title', width: '3', isShow: true },
          { label: '手机号', key: 'phone', width: '3', isShow: true },
          { label: '类型', key: 'supplier_type', width: '2', isShow: true },
          { label: '账期', key: 'bill_term', width: '2', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: true },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        supplierType: Constant.SUPPLIER_TYPE(),
        supplierBillTerm: Constant.SUPPLIER_BILL_TERM(),
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //审核
      async supplierAudit(data){
        this.$messageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.supplierAudit, {
            id: data.id
          });
          if(res.code === 0){
            this.$message({
              title: '提示',
              message: '已通过审核',
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
      //冻结解冻
      async supplierFreeze(data){
        let str = data.is_freeze ? '解冻' : '冻结';
        this.$messageBox.confirm(`确认${str}该供应商?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api[data.is_freeze ? 'supplierUnFreeze' : 'supplierFreeze'], {
            id: data.id,
            is_freeze: !data.is_freeze
          });
          if(res.code === 0){
            this.$message({
              title: '提示',
              message: `已${str}`,
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
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
  .is-presale{
    color: #fff;
    background: #FFA349;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    height: 18px;
    line-height: 18px;
    width: 18px;
    border-radius: 18px 0 18px 18px;
    position: relative;
    top: -2px;
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
