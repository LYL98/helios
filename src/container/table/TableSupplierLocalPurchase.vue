<template>
  <div class="container-table">
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
              <div v-if="item.key === 'supplier'" class="td-item add-dot2">{{scope.row.supplier.title}}</div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item.code}}/{{scope.row.item.title}}</div>
              <!--采购单价-->
              <div v-else-if="item.key === 'price_buy'" class="td-item add-dot2">&yen;{{returnPrice(scope.row.price_buy)}}</div>
              <!--采购总金额-->
              <div v-else-if="item.key === 'num_price'" class="td-item add-dot2">&yen;{{returnPrice(scope.row.num * scope.row.price_buy + scope.row.num * scope.row.frame_price)}}</div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <el-tag size="small" type="info" disable-transitions>全部入库</el-tag>
                <!--
                <el-tag size="small" :type="localPurchaseStatusType[scope.row.status]" disable-transitions>
                  {{localPurchaseStatus[scope.row.status]}}
                </el-tag>
                -->
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.SupplierLocalPurchaseDetail,
                  command: () => handleShowAddEdit('AddEditSupplierLocalPurchase', scope.row, 'detail')
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
          { label: '供货商', key: 'supplier', width: '3', isShow: true },
          { label: '采购价', key: 'price_buy', width: '2', isShow: true },
          { label: '采购数量', key: 'num', width: '2', isShow: true },
          { label: '采购总金额', key: 'num_price', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '采购日期', key: 'order_date', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false },
        ],
        localPurchaseStatus: Constant.LOCAL_PURCHASE_STATUS(),
        localPurchaseStatusType: Constant.LOCAL_PURCHASE_STATUS_TYPE,
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
