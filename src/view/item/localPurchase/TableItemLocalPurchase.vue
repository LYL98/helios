<template>
  <div class="container-table">
    <!--头部-->
    <div class="table-top" v-if="auth.isAdmin || auth.ItemLocalPurchaseExport">
      <div class="left">
        <query-tabs v-model="status" @change="changeTab" :tab-panes="statusOptions"/>
      </div>
      <div class="right">
        <el-button @click.native="handleExport('fromSupplierOrderExport', {...query, status})" size="mini" type="primary" plain>导出反采单</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
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
              <!--编号-->
              <template v-if="item.key === 'code'">
                <div class="td-item">
                  <div class="link-item link-item add-dot2" @click="handleShowAddEdit('AddEditItemLocalPurchase', scope.row, 'detail')" v-if="auth.isAdmin || auth.ItemLocalPurchaseDetail">
                    {{scope.row.code}}
                  </div>
                  <div class="add-dot2" v-else>{{scope.row.code}}</div>
                </div>
              </template>
              <!--供应商-->
              <div v-else-if="item.key === 'supplier'" class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--采购单价-->
              <div v-else-if="item.key === 'price_buy'" class="td-item add-dot2">&yen;{{returnPrice(scope.row.price_buy)}}</div>
              <!--数量-->
              <div v-else-if="item.key === 'num'" class="td-item add-dot2">{{returnUnit(scope.row.num, '件', '-')}}</div>
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
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.ItemLocalPurchaseDetail,
                  command: () => handleShowAddEdit('AddEditItemLocalPurchase', scope.row, 'detail')
                },
                {
                  title: '关闭',
                  isDisplay: (auth.isAdmin || auth.ItemLocalPurchaseClose) && scope.row.status === 'audit_success',
                  command: () => handleShowForm('FormClose', { ids: [scope.row.id] })
                }
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
    name: 'TableItemLocalPurchase',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryItemLocalPurchase');
      this.getData(pc.query);
    },
    computed: {
      statusOptions(){
        let d = Constant.PURCHASE_STATUS('value_key');
        delete d['待审核'];
        delete d['作废'];
        return { '全部': '', ...d};
      }
    },
    data() {
      return {
        status: '',
        tableName: 'TableItemLocalPurchase',
        tableColumn: [
          { label: '反采单号', key: 'code', width: '2', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '3', isShow: true },
          { label: '供应商', key: 'supplier', width: '3', isShow: true },
          { label: '采购价', key: 'price_buy', width: '2', isShow: true },
          { label: '采购数量', key: 'num', width: '2', isShow: true },
          { label: '采购总金额', key: 'num_price', width: '3', isShow: false },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '采购日期', key: 'order_date', width: '3', isShow: false },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        purchaseStatus: Constant.PURCHASE_STATUS(),
        purchaseStatusType: Constant.PURCHASE_STATUS_TYPE,
      }
    },
    methods: {
      changeTab() {
        let pc = this.getPageComponents('QueryItemLocalPurchase');
        this.getData(pc.query);
      },
      //获取数据
      async getData(query, type){
        if (type === 'clear') {
          this.$data.status = '';
        }
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.fromSupplierOrderQuery, {...query, status: this.$data.status});
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
