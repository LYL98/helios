<template>
  <div class="container-table">
    <div class="table-top">
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
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">
                {{scope.row.item_code}}/{{scope.row.item_title}}
              </div>
              <!--小计-->
              <div v-else-if="item.key === 'subtotal'" class="td-item add-dot2">
                {{scope.row.sort_num || '-'}} / {{scope.row.allocate_num || '-'}} / {{scope.row.count_real || '-'}}
              </div>
              <!--各县-->
              <div v-else-if="typeof item.key === 'number'" class="td-item add-dot2">
                {{scope.row.citys[item.key].sort_num || '-'}} / {{scope.row.citys[item.key].allocate_num || '-'}} / {{scope.row.citys[item.key].count_real || '-'}}
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="60">
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
    <div class="table-bottom" v-if="dataItem.items.length > 0">
      <div class="left">
        <span>装车/分配/应出，共计：</span>
        <span>{{dataItem.sort_num || '-'}}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{dataItem.allocate_num || '-'}}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{dataItem.count_real || '-'}}</span>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.OperateTruckLoadAffirm"
          @click.native="handleShowForm('FormOperateTruckLoadAffirm',{
            delivery_date: query.delivery_date,
            line_code: query.line_code,
            ...dataItem
          })" size="mini" type="primary">发车前确认</el-button>
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
      //在QueryOperateTruckLoad组件里初始化
    },
    data() {
      return {
        tabValue: 'truck',
        tableName: 'TableOperateTruckLoad',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '小计 装车/分配/应出', key: 'subtotal', width: '2', isShow: true },
        ],
        queryTabsData: Constant.TRUCK_LOADING_TAB('value_key'),
        routeTabsData: Constant.TRUCK_LOADING_TAB_ROUTE(),
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryLineDetail, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
          this.handleTableColumn();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //处理表头(query组件也使用)
      handleTableColumn(){
        let { tableColumn, dataItem } = this;
        tableColumn = [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '小计 装车/分配/应出', key: 'subtotal', width: '2', isShow: true },
        ];
        if(dataItem.items.length > 0){
          dataItem.items[0].citys.forEach((item, index) => {
            tableColumn.push({
              label: `${item.city_title} 装车/分配/应出`,
              key: index,
              width: '2',
              isShow: true
            });
          });
        }
        this.$data.tableColumn = tableColumn;
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
