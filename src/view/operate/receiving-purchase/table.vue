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
                <div v-if="pageAuth.detail" class="td-item link-item add-dot2" @click="handleShowDetail('Detail', scope.row)">
                  {{scope.row.code}}
                  <span v-if="scope.row.creator_id === 0" class="local-pur-label no-pre">反采</span>
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}
                  <span v-if="scope.row.creator_id === 0" class="local-pur-label no-pre">反采</span>
                </div>
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
                  isDisplay: pageAuth.add && judgeOrs(scope.row.status, ['audit_success', 'part_in']),
                  command: () => handleShowAddEdit('AddEdit', scope.row, 'add_purchase')
                },
                {
                  title: '打印',
                  isDisplay: pageAuth.print && scope.row.status !== 'closed',
                  command: () => handlePrint({...scope.row, batch_code: scope.row.batch_code || scope.row.code, order_type: 'pur'})
                },
                {
                  title: '打印预览',
                  isDisplay: pageAuth.print && scope.row.status !== 'closed',
                  command: () => handlePrintPreview({...scope.row, batch_code: scope.row.batch_code || scope.row.code, order_type: 'pur'})
                },
                {
                  title: '详情',
                  isDisplay: pageAuth.detail,
                  command: () => handleShowDetail('Detail', scope.row)
                },
                {
                  title: '关闭',
                  isDisplay: pageAuth.close && judgeOrs(scope.row.status, ['audit_success', 'part_in']),
                  command: () => handleShowForm('FormClose', {
                    id: scope.row.id,
                    close_hint: '是否确认关闭采购单，如是，请填写关闭采购单的原因'
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
  import { Message } from 'element-ui';
  import { Http, Config, Constant, Lodop } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: 'Table',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    props: {
      storehouseId: { type: String | Number, default: '' }
    },
    data() {
      return {
        tabValue: 'audit_success',
        qCStatusTab: Constant.Q_C_STATUS('value_key'),
        qCStatus: Constant.Q_C_STATUS(),
        qCStatusType: Constant.Q_C_STATUS_TYPE,
        tableName: 'Table',
        tableColumn: [
          { label: '采购单号', key: 'code', width: '3', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '供应商', key: 'supplier_title', width: '3', isShow: true },
          { label: '采购数量', key: 'num', width: '2', isShow: true },
          { label: '预计到货', key: 'estimate_arrive_at', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '已收货', key: 'num_in', width: '2', isShow: true },
          { label: '缺货', key: 'stockout', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ],
        pageAuth: {}
      }
    },
    created() {
      //处理权限
      let { auth, pageAuth } = this;
      this.$data.pageAuth  = {
        add: auth.isAdmin || auth.OperateReceivingPurchaseAdd,
        detail: auth.isAdmin || auth.OperateReceivingPurchaseDetail,
        close: auth.isAdmin || auth.OperateReceivingPurchaseClose,
        print: auth.isAdmin || auth.OperateReceivingPurchasePrint
      }
      let pc = this.getPageComponents('Query');
      this.getData(pc.query);
    },
    methods: {
      //key
      getRowIdentifier(row){
        return row.id + (row.order_type || '');
      },
      //返回缺货
      returnStockout(data){
        if(this.judgeOrs(data.status, ['closed']) || data.num_in <= 0 || data.num_in >= data.num){
          return '-';
        }
        return (data.num - data.num_in) + '件';
      },
      //获取数据
      async getData(query){
        this.$data.query = this.copyJson(query); //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supPurchaseQueryForAccept, {
          ...query,
          storehouse_id: this.storehouseId,
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
        let pc = this.getPageComponents('Query');
        this.getData(pc.query);
      },
      handlePrint(item) {
        let temp = Lodop.tempGoodsCode(item);
        temp && temp.PRINT();
      },
      handlePrintPreview(item) {
        let temp = Lodop.tempGoodsCode(item);
        temp && temp.PREVIEW();
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .local-pur-label{
    background: #ff5252;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    padding: 0 2px;
    text-decoration: none !important;
    margin-left: 5px;
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
