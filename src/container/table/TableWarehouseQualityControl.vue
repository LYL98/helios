<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="qCStatusTab"/>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="getRowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--采购编号、调拨单号-->
              <div v-if="item.key === 'code'" class="td-item add-dot2">
                <div v-if="auth.isAdmin || auth.WarehouseQualityControlDetail"
                  class="td-item link-item add-dot2" @click="tableShowDetail(scope.row)">
                  {{scope.row.code}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}
                </div>
                <span v-if="scope.row.creator_id === 0" class="local-pur-label">反采</span>
              </div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--采购、调拨数量-->
              <div v-else-if="item.key === 'num'" class="td-item add-dot2">{{scope.row.num}}件</div>
              <!--已收货-->
              <div v-else-if="item.key === 'num_in'" class="td-item add-dot2">{{returnUnit(scope.row.num_in, '件', '-')}}</div>
              <!--缺货-->
              <div v-else-if="item.key === 'stockout'" class="td-item add-dot2">{{returnStockout(scope.row)}}</div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_storehouse', 'tar_storehouse'])" class="td-item add-dot2">{{scope.row[item.key].title}}</div>
              <!--状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="qCStatusType[scope.row.status]" disable-transitions>
                  {{qCStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '品控',
                  isDisplay: (auth.isAdmin || auth.WarehouseQualityControlAdd) && judgeOrs(scope.row.status, ['success', 'part_in']),
                  command: () => handleShowAddEdit('AddEditWarehouseQualityControl', scope.row, 'add_' + query.type)
                },
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseQualityControlDetail,
                  command: () => tableShowDetail(scope.row)
                },
                {
                  title: '关闭',
                  isDisplay: (auth.isAdmin || auth.WarehouseQualityControlClose) && query.type === 'purchase' && judgeOrs(scope.row.status, ['success', 'part_in']),
                  command: () => handleShowForm('FormWarehouseQualityControClose', scope.row)
                },
                {
                  title: '打印',
                  isDisplay: (auth.isAdmin || auth.WarehouseQualityControlPrint) && scope.row.status !== 'closed',
                  command: () => handleShowPrint('PrintWarehouseStockPending', {
                    ...scope.row,
                    batch_code: scope.row.batch_code || scope.row.code
                  })
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
  import tableMixin from '@/container/table/table.mixin';
  import queryTabs from './QueryTabs';

  export default {
    name: 'TableWarehouseQualityControl',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      this.handleTableColumn();
      //初始化在query组件
    },
    data() {
      return {
        tabValue: 'success',
        qCStatus: Constant.Q_C_STATUS(),
        qCStatusType: Constant.Q_C_STATUS_TYPE,
        tableName: 'TableWarehouseQualityControl',
        tableColumn: [],
      }
    },
    computed: {
      //tab状态
      qCStatusTab(){
        let d = Constant.Q_C_STATUS('value_key');
        if(this.query.type === 'distribute') delete d['关闭'];
        return d;
      }
    },
    methods: {
      //key
      getRowIdentifier(row){
        return row.id + (row.order_type || '');
      },
      //返回缺货
      returnStockout(data){
        if(this.judgeOrs(data.status, ['all_in', 'closed']) || data.num_in <= 0 || data.num_in >= data.num){
          return '-';
        }
        return (data.num - data.num_in) + '件';
      },
      //获取数据
      async getData(query, type){
        if(query.type !== this.query.type || type === 'clear'){
          this.$data.query = this.copyJson(query); //赋值，minxin用
          this.handleTableColumn();
        }else{
          this.$data.query = this.copyJson(query); //赋值，minxin用
        }
        let apis = {
          purchase: Config.api.supPurchaseQuery,
          distribute: Config.api.supDistributeQuery
        }
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(apis[query.type], {
          ...query,
          status: this.tabValue
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //切换记录tab
      changeTab(){
        let pc = this.getPageComponents('QueryWarehouseQualityControl');
        this.getData(pc.query);
      },
      //处理表头(query组件也使用)
      handleTableColumn(){
        let { tableColumn, query } = this;
        this.$data.dataItem = {
          items: [],
          num: 0
        };
        tableColumn = [];
        //调拨
        if(query.type === 'distribute'){
          tableColumn = tableColumn.concat([
            { label: '调拨单号', key: 'code', width: '3', isShow: true },
            { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
            { label: '调出仓', key: 'src_storehouse', width: '2', isShow: true },
            { label: '调拨数量', key: 'num', width: '2', isShow: true },
            { label: '调入仓', key: 'tar_storehouse', width: '2', isShow: true },
            { label: '可售日期', key: 'available_date', width: '2', isShow: true },
            { label: '预计到货', key: 'estimate_arrive_at', width: '3', isShow: true }
          ]);
        }else{
        //采购
          tableColumn = tableColumn.concat([
            { label: '采购单号', key: 'code', width: '3', isShow: true },
            { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
            { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
            { label: '采购数量', key: 'num', width: '2', isShow: true },
            { label: '预计到货', key: 'estimate_arrive_at', width: '3', isShow: true }
          ]);
        }
        tableColumn = tableColumn.concat([
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '已收货', key: 'num_in', width: '2', isShow: true },
          { label: '缺货', key: 'stockout', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ]);
        this.$data.tableColumn = tableColumn;
        this.$data.tabValue = 'success';
      },
      //查看详情
      tableShowDetail(data){
        let { query } = this;
        let detailPages = {
          purchase: 'DetailWarehouseQualityControlP',
          distribute: 'DetailWarehouseQualityControlD'
        }
        let pc = this.getPageComponents(detailPages[query.type]);
        pc.showDetail(data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
  .local-pur-label{
    background: #ff5252;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    padding: 0 2px;
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
