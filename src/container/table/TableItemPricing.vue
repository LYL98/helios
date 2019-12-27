<template>
  <div class="container-table">
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="priceDataItem.items"
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
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow" :prop="item.key" :sortable="item.key === 'sale_num_last' || item.key === 'item_stock' ? 'custom' : false">
            <div slot-scope="scope" class="my-td-item">
              <!--编号名称-->
              <template v-if="item.key === 'code_title'">
                <div style="height: 42px;" class="add-dot2">
                  <span style="font-weight:bold;">{{scope.row.code}}</span>
                  <span>{{scope.row.title}}</span>
                </div>
              </template>
              <!--昨日销量-->
              <div v-else-if="item.key === 'sale_num_last'">{{scope.row.sale_num_last}}&nbsp;件</div>
              <!--库存-->
              <div v-else-if="item.key === 'item_stock'">{{scope.row.item_stock}}&nbsp;件</div>
              <!--正常情况-->
              <div v-else>{{scope.row[item.key] || '-'}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="76">
          <!--
            2019-12-26
            1、只能报今日的价格
            2、地采商品要等到供应商报价后方可报价
            3、统采商品要有可销售数据方可报价
          -->
          <template slot-scope="scope">
            <!--如何日期大于今日-->
            <template v-if="query.opt_date > today">-</template>
            <!--如果地采供应商已报价、或统采有可销售数量-->
            <template v-else-if="(scope.row.sup_type === 'local_pur' && scope.row.main_bidded) || (scope.row.sup_type === 'global_pur' && scope.row.available_num > 0)">
              <div>
                <a href="javascript:void(0);" v-if="scope.row.opt_type === 'is_audited'" @click="handleShowAddEdit('AddEditItemPricing', { ...scope.row, opt_date: query.opt_date }, 'detail')">详情</a>
                <!--如果小于今日-->
                <template v-else-if="query.opt_date < today">-</template>
                <el-button v-else-if="scope.row.opt_type === 'edit'" size="mini" @click.native="handleShowAddEdit('AddEditItemPricing', { ...scope.row, opt_date: query.opt_date }, 'edit')">修改</el-button>
                <el-button v-else-if="scope.row.opt_type === 'pricing'" type="primary" size="mini" @click.native="handleShowAddEdit('AddEditItemPricing', { ...scope.row, opt_date: query.opt_date }, 'add')">报价</el-button>
              </div>
              <div v-if="scope.row.is_pricing && query.opt_date === today">
                <el-button type="primary" size="mini" @click.native="audit([scope.row.item_id])">审核</el-button>
              </div>
            </template>
            <!--如果小于今日-->
            <template v-else-if="query.opt_date < today">-</template>
            <!--否则-->
            <el-button v-else type="primary" size="mini" @click.native="notBiddingHint(scope.row)">报价</el-button>
          </template>
        </el-table-column>
        <!--table-column end-->
      </el-table>
    </div>

    <div class="pricing-bottom-wrapper">
      <div class="pricing-bottom">
        <div class="total">
          <!--<span style="font-size: 14px;">共 {{dataItem.dataListLength}} 条</span>-->
        </div>
        <div class="tips">
          <span style="margin-right: 20px;">整体计划加价率：{{priceDataItem.overall_markup}}</span>
          <span v-if="priceDataItem.items.length === 0"></span>
          <el-button type="primary" @click.native="audit('multi')" v-else-if="(auth.isAdmin || auth.ItemPriceAudit)"
                     :disabled="multipleSelection.length === 0">批量审核</el-button>
          <!--<span v-else-if="dataItem.is_all_line_checked" style="font-size: 20px;">已审核</span>-->
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
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableItemPricing',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryItemPricing');
      this.getData(pc.query);
    },
    data() {
      return {
        priceScope: Constant.PRICE_SCOPE,
        salePriceScope: Constant.SALE_PRICE_SCOPE,
        total1: 0,
        total2: 0,
        tableName: 'TableItemPricing',
        tableColumn: [
          { label: '商品', key: 'code_title', width: '140', isShow: true },
          { label: '昨日供货价', key: 'price_buy_last', width: '90', isShow: true },
          { label: '今日供货价', key: 'price_buy', width: '90', isShow: true },
          { label: '昨日销售价', key: 'price_sale_last', width: '90', isShow: true },
          { label: '建议价', key: 'suggest_price', width: '120', isShow: true },
          { label: '昨日加价率', key: 'yesterday_rise_rate', width: '100', isShow: true },
          { label: '今日加价率', key: 'today_rise_rate', width: '100', isShow: true },
          { label: '今日销售价', key: 'price_sale', width: '90', isShow: true },
          { label: '昨日销量', key: 'sale_num_last', width: '100', isShow: true },
          { label: '库存', key: 'item_stock', width: '80', isShow: true },
        ],
        priceDataItem: {
          items: [],
          num: 0
        },
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemPriceList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
          this.handleData();
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
        return d.is_pricing;
      },
      //返回建议价(今日询价，今日加价率)
      returnSuggestPrice(item){
        let min = DataHandle.returnSuggestPrice(item.price_buy, item.rise_min);
        let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
        if(min === '0' && max === '0') return '-';
        return `${min} - ${max}`;
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
          case 'item_stock':
            if (order === 'ascending') {
              this.query.sort = 'item_stock'
            } else if (order === 'descending') {
              this.query.sort = '-item_stock'
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

      //选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //处理数据
      handleData() {
        let { dataItem, priceScope, salePriceScope, auth } = this;
        let data = JSON.parse( JSON.stringify(dataItem)); //强转data

        // let d1 = 0, d2 = 0;

        data.items.map((item, index)=>{

          //昨日供货价
          item.price_buy_last = this.returnPrice(item.price_buy_last);

          //今日供货价
          item.price_buy = item.price_buy ? this.returnPrice(item.price_buy) : '';

          //昨日销售价
          item.price_sale_last = this.returnPrice(item.price_sale_last);

          //昨日加价率
          item.yesterday_rise_rate = this.returnRate(item.price_buy_last, item.price_sale_last);

          //今日售价
          item.price_sale = item.price_sale ? this.returnPrice(item.price_sale) : '';

          //今日加价率
          item.today_rise_rate = this.returnRate(item.price_buy, item.price_sale);

          //建议价
          item.suggest_price = this.returnSuggestPrice(item);

          //操作类型
          item.opt_type = '';
          if(item.is_audited){
            item.opt_type = 'is_audited'; //已审核
          }else if((auth.isAdmin || auth.ItemPriceFix) && item.is_quoted){
            item.opt_type = 'edit';
          }else if(auth.isAdmin || auth.ItemPriceFix){
            item.opt_type = 'pricing';
          }
          //是否有审核权限
          item.is_pricing = false;
          if((auth.isAdmin || auth.ItemPriceAudit) && !item.is_audited && item.is_quoted){
            item.is_pricing = true;
          }
        });
        //整体加价率
        data.overall_markup = data.markup_rate_all | data.markup_rate_all ? this.returnMarkup(data.markup_rate_all) + '%' : '-';
        // console.log(data);
        this.$data.priceDataItem = data;
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
      //未报价提示
      notBiddingHint(data){
        if(data.sup_type === 'local_pur'){
          this.$message({message: '主供应商尚未报价，请联系主供应商报价', type: 'error'});
        }else{
          this.$message({message: '该商品今日暂无可售数量，暂不可报价', type: 'error'});
        }
      }
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