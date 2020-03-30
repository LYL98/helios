<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.ItemSupplierAdd || auth.ItemSupplierExport">
      <div class="left">
        <query-tabs v-model="supplier_type" @change="changeTab" :tab-panes="supplierTypeOptions"/>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.ItemSupplierExport" @click.native="handleExport('supplierExport', {...query, supplier_type})" size="mini" type="primary" plain>导出供应商</el-button>
        <el-button v-if="auth.isAdmin || auth.ItemSupplierAdd" @click="handleShowAddEdit('AddEditItemSupplier')" size="mini" type="primary">新增</el-button>
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
                  <div class="link-item link-item add-dot2" @click="handleShowDetail('DetailItemSupplier', scope.row)" v-if="auth.isAdmin || auth.ItemSupplierDetail">
                    {{scope.row.title}}
                  </div>
                  <div class="add-dot2" v-else>{{scope.row.title}}</div>
                </div>
              </template>
              <!--联系人-->
              <template v-else-if="item.key === 'linkman_contact_phone'">
                <div class="td-item add-dot2">
                  {{scope.row.linkman}}<br/>
                  {{scope.row.contact_phone}}
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
              <!--审核状态-->
              <div class="td-item" v-else-if="item.key === 'is_audited'">
                <el-tag v-if="!scope.row.is_audited" size="small" type="primary" disable-transitions>待审核</el-tag>
                <el-tag v-else size="small" type="regular" disable-transitions>已审核</el-tag>
              </div>
              <!--冻结状态-->
              <div class="td-item" v-else-if="item.key === 'is_freeze'">
                <el-switch
                  @change="(v)=>supplierFreeze(v, scope.row)"
                  :value="scope.row.is_freeze"
                  :active-value="true"
                  :inactive-value="false"
                  :disabled="auth.isAdmin || auth.ItemSupplierFreeze ? false : true"
                />
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
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.ItemSupplierAudit) && !scope.row.is_audited,
                  command: () => supplierAudit(scope.row)
                },
                {
                  title: '供应商品',
                  isDisplay: (auth.isAdmin || auth.ItemSupplierItem) && scope.row.is_audited,
                  command: () => handleShowDetail('DetailItemSupplierItem', scope.row)
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
  import tableMixin from '@/share/mixin/table.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: 'TableItemSupplier',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryItemSupplier');
      this.getData(pc.query);
    },
    data() {
      return {
        supplier_type: '',
        supplierTypeOptions: {'全部': '', ...Constant.SUPPLIER_TYPE('value_key')},
        tableName: 'TableItemSupplier',
        tableColumn: [
          { label: '名称', key: 'title', width: '3', isShow: true },
          { label: '联系人', key: 'linkman_contact_phone', width: '3', isShow: true },
          { label: '账号手机号', key: 'phone', width: '3', isShow: false },
          { label: '类型', key: 'supplier_type', width: '2', isShow: true },
          { label: '账期', key: 'bill_term', width: '2', isShow: true },
          { label: '审核状态', key: 'is_audited', width: '2', isShow: true },
          { label: '冻结状态', key: 'is_freeze', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        supplierType: Constant.SUPPLIER_TYPE(),
        supplierBillTerm: Constant.SUPPLIER_BILL_TERM(),
      }
    },
    methods: {
      changeTab() {
        let pc = this.getPageComponents('QueryItemSupplier');
        this.getData(pc.query);
      },
      //获取数据
      async getData(query, type){
        if (type === 'clear') {
          this.$data.supplier_type = '';
        }
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierQuery, { ...query, supplier_type: this.$data.supplier_type });
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
      async supplierFreeze(value, data){
        let str = value ? '冻结' : '解冻';
        this.$messageBox.confirm(`确认${str}该供应商?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api[value ? 'supplierFreeze' : 'supplierUnFreeze'], {
            id: data.id,
            is_freeze: value
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
  @import '@/share/scss/table.scss';
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
  @import '@/share/scss/table.global.scss';
</style>
