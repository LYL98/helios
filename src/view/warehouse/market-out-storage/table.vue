<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="queryOutStorageStatus"/>
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
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--仓库-->
              <div v-if="item.key === 'warehouse_titles'" class="td-item add-dot2">
                {{scope.row.warehouse_titles && scope.row.warehouse_titles.join('，')}}
              </div>
              <!--采购、调拨数量、入库数量-->
              <div v-else-if="judgeOrs(item.key, ['num', 'num_out'])" class="td-item add-dot2">{{scope.row[item.key] ? scope.row[item.key] + '件' : '-'}}</div>
              <!--出库计划状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'out_storage_status'">
                <el-tag size="small" :type="outStorageStatusType[returnStatus(scope.row)]" disable-transitions>
                  {{outStorageStatus[returnStatus(scope.row)]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '出库',
                  isDisplay: (auth.isAdmin || auth.WarehouseOutStorageAdd) && scope.row.num_out < scope.row.num,
                  command: () => handleShowForm('OutStorage', scope.row)
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
    name: 'Table',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      //初始化在Query组件
      //let pc = this.getPageComponents('Query');
      //this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'Table',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '仓库', key: 'warehouse_titles', width: '4', isShow: true },
          { label: '应出库', key: 'num', width: '3', isShow: true },
          { label: '状态', key: 'out_storage_status', width: '2', isShow: true },
          { label: '已出库', key: 'num_out', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ],
        tabValue: 'opt_all',
        outStorageStatus: Constant.OUT_STORAGE_STATUS(),
        outStorageStatusType: Constant.OUT_STORAGE_STATUS_TYPE
      }
    },
    computed: {
      //tab
      queryOutStorageStatus(){
        let d = Constant.OUT_STORAGE_STATUS('value_key');
        return { '全部': 'opt_all', ...d};
      }
    },
    methods: {
      //切换记录tab
      changeTab(){
        let pc = this.getPageComponents('Query');
        this.getData(pc.query);
      },
      //返回状态
      returnStatus(data){
        if(data.num_out === 0) return 'init';
        if(data.num_out >= data.num) return 'all';
        return 'part';
      },
      //获取数据
      async getData(query, type){
        //如果点重置
        if(type === 'clear') this.$data.tabValue = 'opt_all';
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supOutPlanQuery, {
          ...query,
          status: this.tabValue === 'opt_all' ? '' : this.tabValue
        });
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
