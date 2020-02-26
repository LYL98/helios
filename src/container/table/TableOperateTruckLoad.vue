<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" :tab-panes="queryTabsData" type="route" :route-panes="routeTabsData" :query="{delivery_date: query.delivery_date}"/>
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
              <div v-else-if="item.key === 'subtotal'" :class="`td-item add-dot2 ${returnTotalClass(scope.row)}`">
                <span class="sort-num">{{scope.row.sort_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="allocate-num">{{scope.row.allocate_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="count-real">{{scope.row.count_real || '-'}}</span>
              </div>
              <!--各县-->
              <div v-else-if="typeof item.key === 'number'" :class="`td-item add-dot2 ${returnClass(scope.row)}`">
                <span class="sort-num">{{scope.row.citys[item.key].sort_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="allocate-num">{{scope.row.citys[item.key].allocate_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="count-real">{{scope.row.citys[item.key].count_real || '-'}}</span>
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
                  isDisplay: (auth.isAdmin || auth.OperateTruckLoadDetail) && !scope.row.allocated_time,
                  command: () => handleShowDetail('DetailOperateTruckLoad', {
                    ...scope.row,
                    delivery_date: query.delivery_date,
                    line_code: query.line_code
                  })
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom" v-if="dataItem.items.length > 0">
      <div :class="`left ${returnTotalClass(dataItem)}`">
        <span>装车/分配/应出，共计：</span>
        <span class="sort-num">{{dataItem.sort_num || '-'}}</span>
        <span>&nbsp;/&nbsp;</span>
        <span class="allocate-num">{{dataItem.allocate_num || '-'}}</span>
        <span>&nbsp;/&nbsp;</span>
        <span class="count-real">{{dataItem.count_real || '-'}}</span>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.OperateTruckLoadAffirm"
          @click.native="handleShowForm('FormOperateTruckLoadAffirm', {
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
        routeTabsData: Constant.TRUCK_LOADING_TAB_ROUTE(),
      }
    },
    computed: {
      //tab
      queryTabsData(){
        let { auth } = this;
        let d = Constant.TRUCK_LOADING_TAB('value_key');
        if(auth.isAdmin) return d;
        if(!auth.OperateTruckLoad) delete d['装车'];
        if(!auth.OperateTruckLoadDelay) delete d['装车延时'];
        return d;
      },
    },
    methods: {
      //返回提醒样式
      returnTotalClass(data){
        let cr = Number(data.count_real); //应出
        let an = Number(data.allocate_num); //分配
        let sn = Number(data.sort_num); //装车
        if(cr > an && an === sn){
          return 'allocate-num-warn';
        }
        if(cr > an && an > sn){
          return 'allocate-num-warn sort-num-warn';
        }
        if(cr === an && an > sn){
          return 'sort-num-warn';
        }
        return '';
      },
      //返回提醒样式
      returnClass(data){
        let cr = Number(data.count_real); //应出
        let an = Number(data.allocate_num); //分配
        let sn = Number(data.sort_num); //装车
        if(cr > an && an === sn){
          return 'allocate-num-warn stockout-warn';
        }
        if(cr > an && an > sn){
          return 'allocate-num-warn sort-num-warn stockout-warn';
        }
        if(cr === an && an > sn){
          return 'sort-num-warn';
        }
        return '';
      },
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
  //缺货
  .stockout-warn{
    &::after{
      content: '缺货';
      background: #ff5252;
      color: #fff;
      font-size: 12px;
      padding: 0 2px;
      border-radius: 3px;
      margin-left: 10px;
    }
  }
  //装车数量变动
  .sort-num-warn{
    >.sort-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
  //分配数量变动
  .allocate-num-warn{
    >.allocate-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
  
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
