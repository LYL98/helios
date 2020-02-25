<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.OperateSortPrint">
      <div class="left">
        <query-tabs v-model="tabValue" :tab-panes="queryTabsData" type="route" :route-panes="routeTabsData"/>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        row-class-name="stripe-row"
        class="list-table my-table-float"
        :highlight-current-row="true"
        row-key="code"
        :current-row-key="clickedRow['code']"
        default-expand-all
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="out-stock">
              <div v-for="(item, i) in props.row.out_stocks" :key="item.id" class="out-stock-item">
                <div class="select">
                  <el-checkbox>批{{props.row.out_stocks.length - i}}</el-checkbox>
                </div>
                <div>入场：{{returnUnit(item.num, '件', '-')}}</div>
                <div>入场时间：{{returnDateFormat(item.created, 'HH:mm:ss')}}</div>
                <div>分配人：{{item.allocated && item.allocated}}</div>
                <div>分配时间：{{returnDateFormat(item.allocated_time, 'HH:mm:ss')}}</div>
                <div>装车：{{returnUnit(item.sort_num, '件', '-')}}</div>
                <div class="option">
                  <my-table-operate
                    @command-click="handleCommandClick(item)"
                    @command-visible="handleCommandVisible"
                    :list="[
                      {
                        title: '分配',
                        isDisplay: (auth.isAdmin || auth.OperateSortAdd) && !item.allocated_time,
                        command: () => handleShowAddEdit('AddEditOperateSort', item, 'add')
                      },{
                        title: '打印',
                        isDisplay: (auth.isAdmin || auth.OperateSortPrint) && returnStatus(item),
                        command: () => handleShowPrint('PrintOperateSort', [item])
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
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">
                {{scope.row.code}}/{{scope.row.title}}
                <span class="label-hint">还会来货</span>
              </div>
              <!--数量-->
              <div v-else-if="judgeOrs(item.key, ['count_real', 'num', 'allocate_num', 'sort_num'])" class="td-item add-dot2">{{returnUnit(scope.row[item.key], '件', '-')}}</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="96">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[{
                  title: '详情',
                  isDisplay: (auth.isAdmin || auth.OperateSortDetail) && !scope.row.allocated_time,
                  command: () => handleShowDetail('DetailOperateSort', scope.row)
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
  import tableMixin from '@/container/table/table.mixin';
  import queryTabs from './QueryTabs';

  export default {
    name: 'TableOperateTruckLoad',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryOperateSort');
      this.getData(pc.query);
    },
    data() {
      return {
        tabValue: 'truck',
        tableName: 'TableOperateTruckLoad',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '应出', key: 'count_real', width: '1', isShow: true },
          { label: '入场', key: 'num', width: '1', isShow: true },
          { label: '分配', key: 'allocate_num', width: '1', isShow: true },
          { label: '装车', key: 'sort_num', width: '1', isShow: true },
        ],
        queryTabsData: Constant.TRUCK_LOADING_TAB('value_key'),
        routeTabsData: Constant.TRUCK_LOADING_TAB_ROUTE(),
      }
    },
    methods: {
      //返回是否可选中
      returnStatus(d){
        return d.allocated_time && d.allocate_num ? true : false;
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supOutAllocateQuery, query);
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
  .label-hint{
    border: 1px solid #ff5252;
    color: #ff5252;
    border-radius: 3px;
    padding: 0 2px;
  }
  .out-stock{
    margin-bottom: 20px;
  }
  .out-stock-item{
    display: flex;
    align-items: center;
    padding: 4px;
    &:hover{
      background: #FBFBFD;
    }
    >div{
      flex: 1;
    }
    >.select{
      flex: initial !important;
      padding-right: 20px;
    }
    >.option{
      flex: initial !important;
    }
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
