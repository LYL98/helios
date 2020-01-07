<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupStoreOrderDelivery || auth.GroupStoreOrderDeliveryAll || auth.GroupStoreOrderExport">
      <div class="left">
        <el-button size="mini" :disabled="multipleSelection.length === 0" @click.native="handleDelivery('multi')" plain v-if="auth.isAdmin || auth.GroupStoreOrderDelivery">批量发货</el-button>
        <el-button size="mini" @click.native="handleDeliveryAll" type="primary" v-if="auth.isAdmin || auth.GroupStoreOrderDeliveryAll">一键发货</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.GroupStoreOrderExport" @click.native="handleExport('groupStoreOrderExport', query)" size="mini" type="primary" plain>导出订单</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="42" :selectable="selectable" v-if="auth.isAdmin || auth.GroupStoreOrderDelivery"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--门店名称-->
            <div class="td-item add-dot2" v-if="item.key === 'store_title'">{{scope.row.store.title}}</div>
            <!--门店地址-->
            <div class="td-item add-dot2" v-else-if="item.key === 'store_address'">{{scope.row.store.address}}</div>
            <!--联系方式-->
            <div class="td-item add-dot2" v-else-if="item.key === 'linkman'">
              <div>{{scope.row.store.linkman}}</div>
              <div>{{scope.row.store.phone}}</div>
            </div>
            <!--所在仓-->
            <div class="td-item add-dot2" v-else-if="item.key === 'city_title'">{{scope.row.city.title}}</div>
            <!--原价、建议团长价、建议团购价-->
            <div class="td-item add-dot2" v-else-if="item.key === 'amount'">&yen;{{returnPrice(scope.row.amount)}}</div>
            <template v-else-if="item.key === 'status'">
              <el-tag size="small" :type="groupStoreOrderStatusType[scope.row.status]" disable-transitions>
                {{ groupStoreOrderStatus[scope.row.status] }}
              </el-tag>
            </template>
            <!--发货日期-->
            <div class="td-item add-dot2" v-else-if="item.key === 'delivery_date'">{{scope.row.activity.delivery_date}}</div>
            <!--正常情况-->
            <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <!--table-column end 操作占位-->
        <el-table-column label min-width="1"/>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '查看',
                  isDisplay: auth.isAdmin || auth.GroupStoreOrderDetail,
                  command: () => handleShowDetail('DetailGroupStoreOrder', scope.row)
                },
                {
                  title: '发货',
                  isDisplay: (auth.isAdmin || auth.GroupStoreOrderDelivery) && scope.row.status === 'init',
                  command: () => handleDelivery({ids: [scope.row.id]})
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button size="mini" :disabled="multipleSelection.length === 0" @click.native="handleDelivery('multi')" plain v-if="auth.isAdmin || auth.GroupStoreOrderDelivery">批量发货</el-button>
        <el-button size="mini" @click.native="handleDeliveryAll" type="primary" v-if="auth.isAdmin || auth.GroupStoreOrderDeliveryAll">一键发货</el-button>
      </div>
      <div class="right">
        <pagination :pageComponent='this'/>
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableGroupStoreOrder',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryGroupStoreOrder');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableGroupStoreOrder',
        tableColumn: [
          { label: '门店名称', key: 'store_title', width: '160', isShow: true },
          { label: '门店地址', key: 'store_address', width: '160', isShow: true },
          { label: '联系方式', key: 'linkman', width: '160', isShow: true },
          { label: '所在仓', key: 'city_title', width: '100', isShow: true },
          { label: '实付金额', key: 'amount', width: '100', isShow: true },
          { label: '状态', key: 'status', width: '80', isShow: true },
          { label: '发货日期', key: 'delivery_date', width: '160', isShow: true },
          { label: '创建时间', key: 'created', width: '160', isShow: false },
          { label: '更新时间', key: 'updated', width: '160', isShow: false },
        ],
        groupStoreOrderStatus: Constant.GROUP_STORE_ORDER_STATUS,
        groupStoreOrderStatusType: Constant.GROUP_STORE_ORDER_STATUS_TYPE,
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.groupStoreOrderQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      // 判断当前行是否可以被选中
      selectable(row) {
        return row.status === 'init';
      },
      //发货
      handleDelivery(data){
        //批量
        if(data === 'multi'){
          let { multipleSelection } = this;
          data = { ids: [] };
          multipleSelection.map((item)=>{
            data.ids.push(item.id);
          });
        }
        this.$messageBox.confirm(`您确认要发货？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupStoreOrderDelivery, data);
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已发货', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },
      //一键发货
      handleDeliveryAll(){
        this.$messageBox.confirm(`您确认将待发货订单全部发货？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupStoreOrderDeliveryAll, {});
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已发货', type: 'success'});
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
  @import './table.scss';
</style>
