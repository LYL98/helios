<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="distributeWaybillStatusTab"/>
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
        default-expand-all
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="dist-detail">
              <div v-for="(item) in props.row.distribute_details" :key="item.id" class="dist-detail-item">
                <div class="item-title">{{item.item_code}}/{{item.item_title}}</div>
                <div class="batch-code">批次：{{item.batch_code}}</div>
                <div class="num">调拨数量：{{item.num}}件</div>
                <div class="status">状态：{{distributeReceiveStatus[item.status]}}</div>
                <div class="option">
                  <my-table-operate
                    @command-click="handleCommandClick(item)"
                    @command-visible="handleCommandVisible"
                    :list="[
                      {
                        title: '品控',
                        isDisplay: pageAuth.add && item.status === 'init',
                        command: () => handleShowAddEdit('AddEdit', item, 'add')
                      },
                      {
                        title: '详情',
                        isDisplay: pageAuth.detail,
                        command: () => handleShowDetail('Detail', item)
                      }
                    ]"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--调拨编号、调拨单号-->
              <div v-if="item.key === 'code'" class="td-item add-dot2">
                <div class="td-item add-dot2">
                  <span>{{scope.row.code}}</span>
                </div>
              </div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_storehouse', 'tar_storehouse'])" class="td-item add-dot2">{{scope.row[item.key].title}}</div>
              <!--状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="distributeWaybillStatusType[scope.row.status]" disable-transitions>
                  {{distributeWaybillStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100">-</el-table-column>
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
        tabValue: 'deliveried',
        distributeWaybillStatus: Constant.DISTRIBUTE_WAYBILL_STATUS(),
        distributeWaybillStatusType: Constant.DISTRIBUTE_WAYBILL_STATUS_TYPE,
        distributeReceiveStatus: Constant.DISTRIBUTE_RECEIVE_STATUS(),
        tableName: 'Table',
        tableColumn: [
          { label: '调拨单号', key: 'code', width: '2', isShow: true },
          { label: '调出仓', key: 'src_storehouse', width: '2', isShow: true },
          { label: '预计到货', key: 'estimate_arrive_at', width: '2', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true }
        ],
        pageAuth: {}
      }
    },
    created() {
      //处理权限
      let { auth, pageAuth } = this;
      this.$data.pageAuth  = {
        add: auth.isAdmin || auth.OperateReceivingDistributeAdd,
        detail: auth.isAdmin || auth.OperateReceivingDistributeDetail,
        close: auth.isAdmin || auth.OperateReceivingDistributeClose
      }
      let pc = this.getPageComponents('Query');
      this.getData(pc.query);
    },
    computed: {
      //tab状态
      distributeWaybillStatusTab(){
        let d = Constant.DISTRIBUTE_WAYBILL_STATUS('value_key');
        delete d['待装车'];
        delete d['待发车'];
        delete d['关闭'];
        return d;
      }
    },
    methods: {
      //key
      getRowIdentifier(row){
        return row.id + (row.order_type || '');
      },
      //获取数据
      async getData(query, type){
        this.$data.query = this.copyJson(query); //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeQueryForAccept, {
          ...query,
          src_storehouse_id: this.storehouseId,
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .dist-detail{
    margin-bottom: 20px;
  }
  .dist-detail-item{
    display: flex;
    align-items: center;
    padding: 4px;
    &:hover{
      background: #FBFBFD;
    }
    >.item-title{
      width: 40%;
    }
    >.batch-code{
      width: 20%;
    }
    >.num{
      width: 15%;
    }
    >.status{
      width: 15%;
    }
    >.option{
      width: 10%;
      text-align: right;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
