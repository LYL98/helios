<template>
  <div>
    <!-- 头部start -->
    <div class="query">
      <my-collapse-query @expandChange="onExpandChange" :defaultExpand="defaultExpand" :isShowExpandButton="isShowExpandButton">
        <template slot="header">
          <el-row>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '报价状态'">
                <my-button-group
                  :options="{'全部': '', '未报价': 0, '已报价': 1}"
                  v-model="query.is_quoted"
                  @change="loadPriceListFirstPage"
                  size="small"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '审核状态'">
                <my-button-group
                  :options="{'全部': '', '未审核': 0, '已审核': 1}"
                  v-model="query.is_approve"
                  @change="loadPriceListFirstPage"
                  size="small"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="8" :lg="10" :span="10">
              <my-query-item label="搜索">
                <div style="display: flex">
                  <el-input
                    size="small"
                    placeholder="请输入商品名称或编号"
                    class="query-item-input"
                    clearable
                    @clear="loadPriceListFirstPage"
                    v-model="query.condition"
                    @keyup.enter.native="loadPriceListFirstPage()"
                  />
                  <el-button size="small" type="primary" style="margin-left: 4px" @click="loadPriceListFirstPage()" icon="el-icon-search"></el-button>
                  <el-button v-if="!isExpand && !defaultExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
                </div>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row style="margin-top: 16px;">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '时间'">
                <el-date-picker
                  v-model="query.opt_date"
                  size="small"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :editable="false"
                  class="query-item-date"
                  @change="loadPriceListFirstPage()"
                >
                </el-date-picker>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '采购员'">
                <my-select-buyer
                  :isUseToQuery="true"
                  size="small"
                  :provinceCode="query.province_code"
                  v-model="query.buyer_id"
                  :has-all-selection="true"
                  v-on:change="loadPriceListFirstPage()"/>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '展示分类'">
                <my-select-display-class
                  :isUseToQuery="true"
                  size="small"
                  :has-all-selection="true"
                  v-model="query.display_class_code"
                  v-on:change="loadPriceListFirstPage()"/>
                <el-button size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
    <!-- 头部end -->
    <!-- 表格start -->
    <el-table :data="priceDataItem.items"
              :row-class-name="highlightRowClassName"
              style="width: 100%; margin-top: 16px;"
              class="list-table"
              @sort-change="onSort"
              :height="windowHeight - offsetHeight"
              :highlight-current-row="true"
              :row-key="returnTableKey"
              @selection-change="handleSelectionChange"
              :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column type="selection" :selectable="returnIsPricing" width="30" v-if="(auth.isAdmin || auth.ItemPriceAudit)"></el-table-column>
      <el-table-column label="商品" width="140">
        <template slot-scope="scope">
          <div style="height: 42px;">
            <span style="font-weight:bold;">{{scope.row.code}}</span>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昨日询价" width="76" prop="price_buy_last"/>
      <el-table-column label="今日询价" width="76" prop="price_buy" />
      <el-table-column label="昨日销售价" width="90" prop="price_sale_last"/>
      <el-table-column label="建议价" width="70" prop="suggest_price"/>
      <el-table-column label="今日销售价" width="90">
        <template slot-scope="scope">
          <div class="num-input">
            <span :style="scope.row.price_sale_style">{{scope.row.price_sale}}</span>
            <i v-if="scope.row.price_sale_show_i === ''"></i>
            <i class="iconfont" v-else-if="scope.row.price_sale_show_i === 'up'">&#xe795;</i>
            <i class="iconfont" v-else-if="scope.row.price_sale_show_i === 'down'" style="color: #52cd01;">&#xe796;</i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sale_num_last" label="昨日销量" width="106" sortable="custom">
        <template slot-scope="scope">
          <div>{{scope.row.sale_num_last}}&nbsp;件</div>
        </template>
      </el-table-column>
      <el-table-column prop="markup_rate_advise" label="计划加价率" width="120" sortable="custom">
        <template slot-scope="scope">
          <div>
            {{scope.row.markup_rate}}%
            <p v-if="scope.row.is_show_markup_rate">
              <span :style="scope.row.markup_rate_style">{{scope.row.actual_markup}}%</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="item_stock" label="库存" width="120" sortable="custom">
        <template slot-scope="scope">
          <div>{{scope.row.item_stock}}&nbsp;件</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="76">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.opt_type === 'is_approve'">已审核</span>
            <el-button v-else-if="scope.row.opt_type === 'edit'" size="mini" @click.native="showItemPriceEdit({
              isShow: true,
              data: scope.row,
            }, scope.$index)">修改</el-button>
            <el-button v-else-if="scope.row.opt_type === 'pricing'" type="primary" size="mini" @click.native="showItemPriceEdit({
              isShow: true,
              data: scope.row,
            }, scope.$index)">报价</el-button>
          </div>
          <div>
            <el-button v-if="scope.row.is_pricing" type="primary" size="mini" @click.native="audit([scope.row.item_id])">审核</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="1"/>
    </el-table>
    <!-- 表格end -->

    <div class="pricing-bottom-wrapper">
      <div class="pricing-bottom">
        <div class="total">
          <!--<span style="font-size: 14px;">共 {{dataItem.dataListLength}} 条</span>-->
        </div>
        <div class="tips">
        <span class="hint-span">
          <i class="iconfont" style="color: red;">&#xe795;</i>
          <i class="iconfont" style="color: #52cd01;">&#xe796;</i>
          <font>表示今日销售价与昨日销售价相差±{{salePriceScope * 100}}%</font><br/>
          <font class="font" style="background: red;">&nbsp;</font>
          <font class="font" style="background: #52cd01;">&nbsp;</font>
          <font>表示今日销售价与建议价相差±{{priceScope * 100}}%</font>
        </span>
          <span style="margin-right: 20px;">整体计划加价率：{{priceDataItem.overall_markup}}</span>
          <span v-if="priceDataItem.items.length === 0"></span>
          <el-button type="primary" @click.native="audit('multi')" v-else-if="(auth.isAdmin || auth.ItemPriceAudit)"
                     :disabled="multipleSelection.length === 0">批量审核</el-button>
          <!--<span v-else-if="dataItem.is_all_line_checked" style="font-size: 20px;">已审核</span>-->
        </div>
      </div>
    </div>

    <div class="footer" v-if="priceDataItem.num > 0">
      <div class="table-pagination">
        <el-pagination
          background
          @size-change="changePageSize"
          @current-change="changePage"
          :current-page="query.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="query.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceDataItem.num">
        </el-pagination>
      </div>
    </div>

    <my-pricing-edit :callback="myCallBack"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Row, Col, DatePicker, MessageBox, Button, Input, Table, TableColumn, RadioGroup, RadioButton, Pagination, Select, Option, Checkbox, CheckboxGroup } from 'element-ui';
import { QueryItem, CollapseQuery, ButtonGroup, SelectDisplayClass, SelectBuyer } from '@/common';
import { Config, Constant, DataHandle, Method } from '@/util';
import { Item } from '@/service';
import PricingEdit from './PricingEdit.vue';
import viewMixin from '@/view/view.mixin';

export default {
  name: "ItemPricing",
  mixins: [viewMixin],
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-select': Select,
    'el-checkbox-group': CheckboxGroup,
    'el-checkbox': Checkbox,
    'el-option': Option,
    'el-date-picker': DatePicker,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-button': Button,
    'el-table': Table,
    'el-input': Input,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'my-pricing-edit': PricingEdit,
    'my-button-group': ButtonGroup,
    'my-select-display-class': SelectDisplayClass,
    'my-query-item': QueryItem,
    'my-select-buyer': SelectBuyer,
    'my-collapse-query': CollapseQuery
  },
  computed: {
    ...mapGetters({
      province: 'globalProvince',
      priceLisDataItem: 'itemPricingPriceListDataItem'
    }),
    isPad: {
      get() {
        return navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('iPad') > 0;
      }
    }
  },
  created() {
    let that = this;
    documentTitle('商品 - 每日报价');
    let { query, province } = that;
    if(province.code){
      query.province_code = province.code;
      that.$data.query = query;
      that.loadPriceListFirstPage();//获取数据
    }

    if (this.isPad) {
      this.defaultExpand = true;
      this.isShowExpandButton = false;
    }

  },
  data(){
    let d = DataHandle.returnDateStr();
    let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
    return {
      priceScope: Constant.PRICE_SCOPE,
      salePriceScope: Constant.SALE_PRICE_SCOPE,
      total1: 0,
      total2: 0,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + 55 + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
      isExpand: false,
      query: {
        page: 1,
        page_size: Constant.PAGE_SIZE,
        province_code: '',
        opt_date: nowDate,
        buyer_id: '',
        is_approve: '',
        is_quoted: '',
        display_class_code: '',
        sort: '',
        condition: ''
      },
      priceDataItem: {
        items: []
      },
      dataList: [], //数据列表
      dataItem: {
        buyers: []
      },
      isAllSelect: false, //是否全选
      multipleSelection: [], //多选的行，
      defaultExpand: false,
      isShowExpandButton: true
    }
  },
  methods: {

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },

    //返回tabile key
    returnTableKey(d){
      return d.item_id;
    },
    //返回是否禁用选择框
    returnIsPricing(d){
      return d.is_pricing;
    },
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    //返回建议价(今日询价，加价率)
    returnSuggestPrice(item){
      return DataHandle.returnSuggestPrice(item.price_buy, item.markup_rate);
    },
    //返回实际加价率(今日销售价 / 今日询价 - 1 * 100%)
    returnActualMarkup(item){

      if(!item.price_sale || !item.price_buy) return '';

      let mr = item.markup_rate; //系统加价率
      let p = (item.price_sale / item.price_buy - 1) * 100;
      if(mr === Math.round(p)){
        return '';
      }
      return p.toFixed(1);
    },
    onExpandChange(isExpand) {
      if (isExpand) {
        this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
      } else {
        this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
      }
      this.isExpand = isExpand;
    },
    resetQuery() {
      let d = DataHandle.returnDateStr();
      let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
      this.$data.query = {
        page: 1,
        page_size: Constant.PAGE_SIZE,
        province_code: this.province.code,
        opt_date: nowDate,
        buyer_id: '',
        is_approve: '',
        is_quoted: '',
        display_class_code: '',
        sort: '',
        condition: ''
      };
      this.loadPriceListFirstPage();
    },
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
        case 'markup_rate_advise':
          if (order === 'ascending') {
            this.query.sort = 'markup_rate_advise'
          } else if (order === 'descending') {
            this.query.sort = '-markup_rate_advise'
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
      this.loadPriceListFirstPage()
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
    //对实际加价率排序
    sortActualMarkup(a, b) {
      if (a && b) {
        let aRate = Number(a.is_show_markup_rate ? a.actual_markup : a.markup_rate);
        let bRate = Number(b.is_show_markup_rate ? b.actual_markup : b.markup_rate);
        if (aRate > bRate) {
          return 1
        } else if (aRate < bRate) {
          return -1
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadPriceListFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.itemPricingPriceList(this.query)
    },
    //全选择
    changeAllSelect(){
      let that = this;
      let { isAllSelect, dataItem } = that;
      if(isAllSelect){
        let ids = [];
        dataItem.items.map((item)=>{
          if(!item.is_approve){
            ids.push(item.item_id);
          }
        });
        that.$data.selectIds = ids;
      }else{
        that.$data.selectIds = [];
      }
    },
    //组件回调
    myCallBack(data){
      // 优化
      // let { priceLisDataItem } = this;
      // if (data && data.item) {
      //   priceLisDataItem[data.index] = data.item;
      //   priceLisDataItem.markup_rate_all = data.markup_rate_all;
      //   this.handleData();
      // }
      this.itemPricingPriceList(this.query);
    },
    handleData() {
      let that = this;
      let { priceLisDataItem, priceScope, salePriceScope, auth } = that;
      let data = JSON.parse( JSON.stringify(priceLisDataItem)); //强转data

      // let d1 = 0, d2 = 0;

      data.items.map((item, index)=>{
        //是否显示使用昨日询价按钮
        let isShowShortcutPrice = false;
        //无采购价、未审核
        if(!item.price_buy && !item.is_approve){
          isShowShortcutPrice = true;
        }
        item.is_show_shortcut_price = isShowShortcutPrice;

        // let isAdd = true; //记录是否可添加
        // //判断采购员
        // if(query.buyer_id !== '' && query.buyer_id !== item.buyer_id){
        //   isAdd = false;
        // }
        // //判断是否报价
        // if(query.is_quoted !== '' && query.is_quoted !== item.is_quoted){
        //   isAdd = false;
        // }
        // //判断是否审核
        // if(query.is_approve !== '' && query.is_approve !== item.is_approve){
        //   isAdd = false;
        // }
        // //判断是否展示分类
        // if(query.display_class_code !== '' && query.display_class_code !== item.display_class_code){
        //   isAdd = false;
        // }

        //今日售价i标签
        item.price_sale_show_i = '';
        if( !item.price_sale || (item.price_sale === item.price_sale_last && item.price_sale === item.suggest_price)){
          item.price_sale_show_i = '';
        }else if(item.price_sale > item.price_sale_last && item.price_sale - item.price_sale_last > item.price_sale_last * salePriceScope){
          item.price_sale_show_i = 'up';
        }else if(item.price_sale < item.price_sale_last && item.price_sale_last - item.price_sale > item.price_sale_last * salePriceScope){
          item.price_sale_show_i = 'down';
        }

        //昨日询价
        item.price_buy_last = that.returnPrice(item.price_buy_last);

        //今日询价
        item.price_buy = item.price_buy ? that.returnPrice(item.price_buy) : '';

        //昨日销售价
        item.price_sale_last = that.returnPrice(item.price_sale_last);

        //加价率
        item.markup_rate = that.returnMarkup(item.markup_rate);

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

        // if (item.code === '002299') {
        //   console.log(typeof item.price_sale, typeof item.price_sale_last);
        //   console.log('今日销售价，' , item.price_sale , ', 昨日销售价, ', item.price_sale_last ,', show_tag: ' , item.price_sale_show_i, 'scope: ', item.price_sale < item.price_sale_last)
        // }

        //实际加价率
        item.actual_markup = that.returnActualMarkup(item);
        item.is_show_markup_rate =  item.suggest_price !== item.price_sale && item.actual_markup; //是否显示实际加价率
        item.markup_rate_style =  item.actual_markup > item.markup_rate ? 'color: red;' : 'color: #52cd01;'; //显示样式

        //库存

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

        // //加入数据列表
        // let fun = () => {
        //   //整体加价率
        //   // d1 = d1 + item.price_buy * item.sale_num_last;
        //   // d2 = d2 + item.price_sale * item.sale_num_last;
        //
        //   itemsTemp.push(item);
        // }
        // if(isAdd) fun();
      });
      //整体加价率
      data.overall_markup = data.markup_rate_all | data.markup_rate_all ? that.returnMarkup(data.markup_rate_all) + '%' : '-';
      // console.log(data);
      this.priceDataItem = data;

    },
    //计算数据
    /*refreshData(){
      let that = this;
      let { query, priceLisDataItem, priceScope, salePriceScope, auth } = that;

      let data = JSON.parse( JSON.stringify(priceLisDataItem)); //强转data
      let dataTemp = {
        buyers: data.buyers
      };
      let itemsTemp = []; //保存items

      //1 -（sku1今日采购价*昨日销量 + sku2今日采购价*昨日销量。。。）/ （sku1今日销售价*昨日销量+ sku2今日销售价*昨日销量+。。。）
      let overallMarkup = 0, d1 = 0, d2 = 0;

      data.items.map((item, index)=>{
        //是否显示使用昨日询价按钮
        let isShowShortcutPrice = false;
        if(!item.price_buy && !item.is_approve){
          isShowShortcutPrice = true;
        }
        item.is_show_shortcut_price = isShowShortcutPrice;

        let isAdd = true; //记录是否可添加
        //判断采购员
        if(query.buyer_id !== '' && query.buyer_id !== item.buyer_id){
          isAdd = false;
        }
        //判断是否报价
        if(query.is_quoted !== '' && query.is_quoted !== item.is_quoted){
          isAdd = false;
        }
        //判断是否审核
        if(query.is_approve !== '' && query.is_approve !== item.is_approve){
          isAdd = false;
        }
        //判断是否展示分类
        if(query.display_class_code !== '' && query.display_class_code !== item.display_class_code){
          isAdd = false;
        }

        //加入数据列表
        let fun = () => {
          //整体加价率
          d1 = d1 + item.price_buy * item.sale_num_last;
          d2 = d2 + item.price_sale * item.sale_num_last;

          //昨日询价
          item.price_buy_last = that.returnPrice(item.price_buy_last);

          //今日询价
          item.price_buy = item.price_buy ? that.returnPrice(item.price_buy) : '';

          //昨日销售价
          item.price_sale_last = that.returnPrice(item.price_sale_last);

          //加价率
          item.markup_rate = that.returnMarkup(item.markup_rate);

          //建议价
          item.suggest_price = that.returnSuggestPrice(item);

          //今日售价 及 样式
          item.price_sale = item.price_sale ? that.returnPrice(item.price_sale) : '';

          let sp = item.suggest_price;
          if(item.price_sale > sp && item.price_sale - sp > sp * priceScope){
            item.price_sale_style = 'color: red; font-weight: bold;';
          }else if(item.price_sale < sp && sp - item.price_sale > sp * priceScope){
            item.price_sale_style = 'color: #52cd01; font-weight: bold;';
          }
          //今日售价i标签
          item.price_sale_show_i = '';
          if( !item.price_sale || (item.price_sale === item.price_sale_last && item.price_sale === item.suggest_price)){
            item.price_sale_show_i = '';
          }else if(item.price_sale > item.price_sale_last && item.price_sale - item.price_sale_last > item.price_sale_last * salePriceScope){
            item.price_sale_show_i = 'up';
          }else if(item.price_sale < item.price_sale_last && item.price_sale_last - item.price_sale > item.price_sale_last * salePriceScope){
            item.price_sale_show_i = 'down';
          }

          //实际加价率
          item.actual_markup = that.returnActualMarkup(item);
          item.is_show_markup_rate =  item.suggest_price !== item.price_sale && item.actual_markup; //是否显示实际加价率
          item.markup_rate_style =  item.actual_markup > item.markup_rate ? 'color: red;' : 'color: #52cd01;'; //显示样式

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

          itemsTemp.push(item);
        }
        if(isAdd) fun();
      });

      //整体加价率
      if(!d1 || !d2){
        overallMarkup = '-';
      }else{
        let m = (1 - d1 / d2) * 100;
        overallMarkup = m.toFixed(1) + '%';
      }
      dataTemp.overall_markup = overallMarkup;
      dataTemp.dataListLength = itemsTemp.length;
      that.$data.dataItem = Object.freeze(dataTemp); //保存一般数据 //加 Object.freeze 不对list里的object做getter、setter绑定

      //分段式渲染（20条）
      let page = 1, pageSize = 20, num = itemsTemp.length, dataList = [];
      let funTemp = (data) => {
        dataList = data;
        that.$data.dataList = Object.freeze(data);
        that.$nextTick(()=>{
          setTimeout(()=>{
            if(num / pageSize > page){
              dataList = dataList.concat(itemsTemp.slice(page * pageSize, page * pageSize + pageSize)); //拼接数据
              funTemp(dataList);
              page++;
            }
          }, 0);
        });
      }

      funTemp(itemsTemp.slice(0, pageSize));
    },*/
    //审核
    audit(ids){
      let that = this;
      MessageBox.confirm('确认通过审核？', '提示', {
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
    loadPriceListFirstPage() {
      let {query} = this;
      query.page = 1;
      this.itemPricingPriceList(query);
    },
    ...mapActions(['itemPricingPriceList', 'itemPricingPriceFix', 'itemPricingPriceAudit', 'itemPricingShowHideEdit'])
  },
  watch:{
    priceLisDataItem: {
      deep: true,
      handler: function (a, b) {
        // this.refreshData(); //计算数据
        this.handleData();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .form-search{
    height: 30px;
    padding: 5px 0;
    margin-bottom: 5px;
    border-bottom: 0;
    &.form-search-hide{
      height: 0px;
      padding: 0;
      margin: 0;
      border: 0;
    }
  }

  .num-input{
    overflow: hidden;
    i{
      color: red;
      margin-left: 2px;
    }
  }

  .pricing-bottom-wrapper {
    background-color: #fff;
    height: 48px;
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
