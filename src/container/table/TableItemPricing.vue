<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="tabValue" @change="changeTab" :tab-panes="queryTabsData"/>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%; margin-top: 16px;"
        class="list-table my-table-float"
        @sort-change="onSort"
        :highlight-current-row="true"
        :row-key="returnTableKey"
        @selection-change="handleSelectionChange"
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" :selectable="returnIsPricing" width="42" v-if="(auth.isAdmin || auth.ItemPriceAudit)"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow" :prop="item.key" :sortable="item.key === 'sale_num_last' || item.key === 'available_num' ? 'custom' : false">
            <div slot-scope="scope" class="my-td-item">
              <!--编号名称-->
              <template v-if="item.key === 'code_title'">
                <div style="height: 42px;" class="add-dot2">
                  <span style="font-weight:bold;">{{scope.row.code}}</span>
                  <span>{{scope.row.title}}</span>
                </div>
              </template>
              <!--数量-->
              <div v-else-if="judgeOrs(item.key, ['sale_num_last', 'available_num'])">{{scope.row[item.key] ? scope.row[item.key] + '件': '-'}}</div>
              <!--价格-->
              <div v-else-if="judgeOrs(item.key, ['price_sale_last', 'price_buy'])">{{scope.row[item.key] ? '￥' + returnPrice(scope.row[item.key]) : '-'}}</div>
              <!--今日销售价-->
              <div v-else-if="item.key === 'price_sale'" :style="returnStyle(scope.row)">
                {{scope.row.price_sale ? '￥' + returnPrice(scope.row.price_sale) : '-'}}
              </div>
              <!--今日加价率-->
              <div v-else-if="item.key === 'today_rise_rate'">{{returnRate(scope.row.price_buy, scope.row.price_sale)}}</div>
              <!--建议价-->
              <div v-else-if="item.key === 'suggest_price'">{{returnSuggestPrice(scope.row)}}</div>
              <!--正常情况-->
              <div v-else>{{scope.row[item.key] || '-'}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <!--如何日期不是今日-->
            <template v-if="query.opt_date > today">-</template>
            <template v-else>
              <!--
                2019-12-26
                1、只能报今日的价格
                3、有可销售数量就可以报价
              -->
              <my-table-operate
                :width="120"
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '报价',
                    isDisplay: (auth.isAdmin || auth.ItemPriceFix) && scope.row.available_num > 0 && query.opt_date === today && !scope.row.is_quoted,
                    command: () => handleShowAddEdit('AddEditItemPricing', { ...scope.row, opt_date: query.opt_date }, 'add')
                  },
                  {
                    title: '审核',
                    isDisplay: returnIsPricing(scope.row) && (auth.isAdmin || auth.ItemPriceAudit) && query.opt_date === today,
                    command: () => audit([scope.row.item_id])
                  },
                  {
                    title: '详情',
                    isDisplay: (auth.isAdmin || auth.ItemPriceDetail) && scope.row.is_quoted,
                    command: () => handleShowAddEdit('AddEditItemPricing', { ...scope.row, opt_date: query.opt_date }, 'detail')
                  }
                ]"
              />
            </template>
          </template>
        </el-table-column>
        <!--table-column end-->
      </el-table>
    </div>
    <div class="pricing-bottom-wrapper">
      <div class="pricing-bottom">
        <div class="total"></div>
        <div class="tips">
          <span style="margin-right: 20px;">整体计划加价率：{{dataItem.markup_rate_all ? returnMarkup(dataItem.markup_rate_all) + '%' : '-'}}</span>
          <span v-if="dataItem.num === 0"></span>
          <el-button type="primary" @click.native="audit('multi')" v-else-if="(auth.isAdmin || auth.ItemPriceAudit)" :disabled="multipleSelection.length === 0">批量审核</el-button>
        </div>
      </div>
    </div>

    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent="this" />
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';
  import queryTabs from './QueryTabs';

  export default {
    name: 'TableItemPricing',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryItemPricing');
      this.getData(pc.query);
    },
    data() {
      return {
        tabValue: 'init',
        queryTabsData: {
          '未报价': 'init',
          '待审核': 'wait',
          '已审核': 'done'
        },
        total1: 0,
        total2: 0,
        tableName: 'TableItemPricing',
        tableColumn: [
          { label: '商品', key: 'code_title', width: '140', isShow: true },
          { label: '昨日销售价', key: 'price_sale_last', width: '90', isShow: true },
          { label: '昨日销量', key: 'sale_num_last', width: '100', isShow: true },
          { label: '今日供货价', key: 'price_buy', width: '90', isShow: true },
          { label: '今日建议价', key: 'suggest_price', width: '120', isShow: true },
          { label: '今日加价率', key: 'today_rise_rate', width: '100', isShow: false },
          { label: '今日销售价', key: 'price_sale', width: '90', isShow: true },
          { label: '可售数量', key: 'available_num', width: '80', isShow: true },
        ],
      }
    },
    methods: {
      //切换记录tab
      changeTab(){
        let { tabValue } = this;
        let pc = this.getPageComponents('QueryItemPricing');
        pc.$data.query.page = 1;
        this.getData(pc.query);
      },
      //获取数据
      async getData(query){
        this.$data.query = query;
        let { tabValue } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemPriceList, {
          ...query,
          status: tabValue
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //返回tabile key
      returnTableKey(d){
        return d.item_id;
      },
      //返回是否禁用选择框
      returnIsPricing(d){
        let { auth } = this;
        if(!d.is_audited && d.is_quoted){
          return true;
        }
        return false;
      },
      //返回建议价(今日询价，今日加价率)
      returnSuggestPrice(item){
        let min = DataHandle.returnSuggestPrice(item.price_buy, item.rise_min);
        let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
        
        if(min === 0 && max === 0) return '-';
        return `￥${this.returnPrice(min)} - ￥${this.returnPrice(max)}`;
      },
      //样式
      returnStyle(item){
        if(!item.price_sale){
          return '';
        }
        let min = DataHandle.returnSuggestPrice(item.price_buy, item.rise_min);
        let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
        if(item.price_sale < min || item.price_sale > max){
          return 'color: #ff5252; font-weight: bold;';
        }
        return '';
      },
      //今日建议价2
      returnSuggestPriceMax(item){
        let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
        return max;
      },
      //返回加价率(询价，销售价)
      returnRate(p1, p2){
        if(!p1 || !p2) return '-';
        //传的数值：如10.3 传 103
        return this.returnMarkup((p2 / p1 - 1) * 1000) + '%';
      },
      //排序
      onSort({ column, prop, order }) {
        switch (prop) {
          case 'available_num':
            if (order === 'ascending') {
              this.query.sort = 'available_num'
            } else if (order === 'descending') {
              this.query.sort = '-available_num'
            } else {
              this.query.sort = ''
            }
            break;
          case 'sale_num_last':
            if (order === 'ascending') {
              this.query.sort = 'sale_num_last'
            } else if (order === 'descending') {
              this.query.sort = '-sale_num_last'
            } else {
              this.query.sort = ''
            }
            break;
        }
        this.$data.query.page = 1;
        this.getData(this.query);
      },
      
      //审核
      audit(ids){
        let that = this;
        this.$messageBox.confirm('确认通过审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(ids === 'multi'){
            let { multipleSelection } = that;
            ids = [];
            multipleSelection.map((item)=>{
              ids.push(item.item_id);
            });
          }
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.itemPriceAudit, {
              ids: ids
            });
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已审核', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        })
        .catch(() => {
          //console.log('取消');
        });
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
  .pricing-bottom-wrapper {
    background-color: #fff;
    height: 48px;
    padding-top: 5px;
    .pricing-bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      padding: 0 10px 10px;
      .total{
        font-size: 18px;
      }
      .tips{
        .hint-span{
          font-size: 12px;
          display: inline-block;
          position: relative;
          top: 10px;
          text-align: left;
          .font{
            display: inline-block;
            width: 12px;
            height: 12px;
            position: relative;
            top: 1px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>