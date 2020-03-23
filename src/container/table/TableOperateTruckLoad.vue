<template>
  <div class="container-table">
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
        border
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">
            <div class="td-item add-dot2">
              {{scope.row.item_code}}/{{scope.row.item_title}}
            </div>
          </template>
        </el-table-column>
        <!--小计-->
        <el-table-column label="小计" label-class-name="sort-head" header-align="center">
            <el-table-column label="装车 / 分配 / 应出" width="160" label-class-name="sort-head" header-align="center" align="center">
              <template slot-scope="scope">
                <div :class="`td-item add-dot2 ${returnTotalClass(scope.row)}`">
                  <span class="sort-num">{{scope.row.sort_num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="allocate-num">{{scope.row.allocate_num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="count-real">{{scope.row.count_real || '-'}}</span>
                </div>
              </template>
            </el-table-column>
        </el-table-column>

        <!--画横向县-->
        <el-table-column :label="item.city_title" v-for="(item, index) in getCitys" :key="index" label-class-name="sort-head" header-align="center">
          <el-table-column label="装车 / 分配 / 应出" width="160" label-class-name="sort-head" header-align="center" align="center">
            <template slot-scope="scope">
              <div :class="`td-item add-dot2 ${returnClass(scope.row.citys[index])}`">
                <span class="sort-num">{{scope.row.citys[index].sort_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="allocate-num">{{scope.row.citys[index].allocate_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="count-real">{{scope.row.citys[index].count_real || '-'}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>

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
                    line_id: query.line_id,
                    confirmed: dataItem.confirmed
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
            line_id: query.line_id,
            ...dataItem
          })" size="mini" type="primary" :disabled="dataItem.confirmed">发车前确认</el-button>
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
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
        tabValue: 'truck'
      }
    },
    computed: {
      //横向县
      getCitys(){
        let { dataItem } = this;
        if(dataItem.items.length === 0) return [];
        if(dataItem.items[0].citys.length === 0) return [];
        return dataItem.items[0].citys;
      }
    },
    methods: {
      //返回提醒样式
      returnTotalClass(data){
        let sn = Number(data.sort_num); //装车
        let an = Number(data.allocate_num); //分配
        let cr = Number(data.count_real); //应出
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
        let sn = Number(data.sort_num); //装车
        let an = Number(data.allocate_num); //分配
        let cr = Number(data.count_real); //应出
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
        //从MenuQuery组件取数据
        let pc = this.getPageComponents('MenuQuery');
        if(pc) query.delivery_date = pc.query.delivery_date;

        this.$data.query = query; //赋值，minxin用
        //如不满足条件
        if(!query.delivery_date || !query.line_id) return;
        
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryLineDetail, query);
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
  //缺货
  .stockout-warn{
    position: relative;
    &::after{
      position: absolute;
      content: '缺';
      background: #ff5252;
      color: #fff;
      font-size: 12px;
      padding: 0 2px;
      border-radius: 3px;
      margin-left: 10px;
      height: 16px;
      line-height: 16px;
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
  @import '@/share/scss/table.global.scss';
  .el-table th.sort-head{
    padding: 2px 0;
  }
</style>
