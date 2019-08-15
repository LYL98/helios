<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.Itemxxx">
      <el-button v-if="auth.isAdmin || auth.Itemxxx" @click.native="handleShowDetail('xxxx')" size="mini" type="primary" plain>报价记录</el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="priceDataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%; margin-top: 16px;"
        :height="windowHeight - offsetHeight"
        class="list-table"
        :highlight-current-row="true"
        :row-key="returnTableKey"
        @selection-change="handleSelectionChange"
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" :selectable="returnIsPricing" width="30" v-if="(auth.isAdmin || auth.ItemPriceAudit)"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :width="item.width" v-if="item.isShow" :prop="item.key">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'code_title'">
              <div style="height: 42px;">
                <span style="font-weight:bold;">{{scope.row.code}}</span>
                <span>{{scope.row.title}}</span>
              </div>
            </template>
            <!--今日销售价-->
            <div v-else-if="item.key === 'frame'">
              <div class="num-input">
                <span :style="scope.row.price_sale_style">{{scope.row.price_sale}}</span>
              </div>
            </div>
            <!--昨日销量-->
            <div v-else-if="item.key === 'sale_num_last'">{{scope.row.sale_num_last}}&nbsp;件</div>
            <!--今日昨日加价率-->
            <div v-else-if="item.key === 'today_rise_rate' || item.key === 'yesterday_rise_rate'">
              {{returnMarkup(scope.row[item.key])}}%
            </div>
            <!--库存-->
            <div v-else-if="item.key === 'item_stock'">{{scope.row.item_stock}}&nbsp;件</div>
            <!--正常情况-->
            <div v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="76">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.opt_type === 'is_approve'">已审核</span>
              <el-button v-else-if="scope.row.opt_type === 'edit'" size="mini" @click.native="handleShowAddEdit('AddEditItemPricing', {
                ...scope.row,
                query: query,
                index: scope.$index
              })">修改</el-button>
              <el-button v-else-if="scope.row.opt_type === 'pricing'" type="primary" size="mini" @click.native="handleShowAddEdit('AddEditItemPricing', {
                ...scope.row,
                query: query,
                index: scope.$index
              })">报价</el-button>
            </div>
            <div>
              <el-button v-if="scope.row.is_pricing" type="primary" size="mini" @click.native="audit([scope.row.item_id])">审核</el-button>
            </div>
          </template>
        </el-table-column>
        <!--table-column end 操作占位-->
        <el-table-column label="" min-width="1"/>
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
      <div class="left">
        <!--<el-button type="danger" size="mini" disabled>批量删除</el-button>-->
      </div>
      <div class="right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
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
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableItemPricing',
        tableColumn: [
          { label: '商品', key: 'code_title', width: '140', isShow: true },
          { label: '昨日询价', key: 'price_buy_last', width: '76', isShow: true },
          { label: '今日询价', key: 'price_buy', width: '76', isShow: true },
          { label: '昨日销售价', key: 'price_sale_last', width: '90', isShow: true },
          { label: '建议价', key: 'suggest_price', width: '70', isShow: true },
          { label: '昨日加价率', key: 'yesterday_rise_rate', width: '100', isShow: true },
          { label: '今日加价率', key: 'today_rise_rate', width: '100', isShow: true },
          { label: '今日销售价', key: 'gross_weight', width: '90', isShow: true },
          { label: '昨日销量', key: 'sale_num_last', width: '106', isShow: true },
          { label: '库存', key: 'item_stock', width: '120', isShow: true },
        ],
        priceDataItem: {
          items: [],
          num: 0
        },
      }
    },
    methods: {
      //展开隐藏搜索(重写)
      onExpandChange(isExpand){
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
        }
      },
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
      //下架
      itemUnderGround(data) {
        this.$messageBox.confirm('您确认要下架？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.itemUnderGround, {
              id: data.id
            });
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已下架', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },

      //返回tabile key
      returnTableKey(d){
        return d.item_id;
      },
      //返回是否禁用选择框
      returnIsPricing(d){
        return d.is_pricing;
      },
      //返回加价率
      returnMarkup(markup){
        return DataHandle.returnMarkup(markup);
      },
      //返回建议价(今日询价，今日加价率)
      returnSuggestPrice(item){
        return DataHandle.returnSuggestPrice(item.price_buy, item.today_rise_rate);
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

      showItemPriceEdit(obj, index) {
        let { query } = this;
        obj.data.index = index;
        obj.data.query = query;
        this.itemPricingShowHideEdit(obj);
      },
      //选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //处理数据
      handleData() {
        let that = this;
        let { dataItem, priceScope, salePriceScope, auth } = that;
        let data = JSON.parse( JSON.stringify(dataItem)); //强转data

        // let d1 = 0, d2 = 0;

        data.items.map((item, index)=>{
          //是否显示使用昨日询价按钮
          let isShowShortcutPrice = false;
          //无采购价、未审核
          if(!item.price_buy && !item.is_approve){
            isShowShortcutPrice = true;
          }
          item.is_show_shortcut_price = isShowShortcutPrice;

          //昨日询价
          item.price_buy_last = that.returnPrice(item.price_buy_last);

          //今日询价
          item.price_buy = item.price_buy ? that.returnPrice(item.price_buy) : '';

          //昨日销售价
          item.price_sale_last = that.returnPrice(item.price_sale_last);

          //建议价
          item.suggest_price = that.returnSuggestPrice(item);

          //今日售价 及 样式
          item.price_sale = item.price_sale ? that.returnPrice(item.price_sale) : '';

          //昨日销量

          let sp = item.suggest_price;
          if(item.price_sale > sp && item.price_sale - sp > sp * priceScope){
            item.price_sale_style = 'color: red; font-weight: bold;';
          }else if(item.price_sale < sp && sp - item.price_sale > sp * priceScope){
            item.price_sale_style = 'color: #52cd01; font-weight: bold;';
          }

          //操作类型
          item.opt_type = '';
          if(item.is_approve){
            item.opt_type = 'is_approve'; //已审核
          }else if((auth.isAdmin || auth.ItemPriceFix) && item.is_quoted){
            item.opt_type = 'edit';
          }else if(auth.isAdmin || auth.ItemPriceFix){
            item.opt_type = 'pricing';
          }
          //是否有审核权限
          item.is_pricing = false;
          if((auth.isAdmin || auth.ItemPriceAudit) && !item.is_approve && item.is_quoted){
            item.is_pricing = true;
          }
        });
        //整体加价率
        data.overall_markup = data.markup_rate_all | data.markup_rate_all ? that.returnMarkup(data.markup_rate_all) + '%' : '-';
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
          //提交审核
          that.itemPricingPriceAudit({
            data: {
              ids: ids
            },
            callback: ()=>{
              that.itemPricingPriceList(that.query);
            }
          });
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
