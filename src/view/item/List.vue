<template>
  <div>
    <query-item
      v-model="query"
      @change="changQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    />
    <!-- 头部end -->
    <div v-if="auth.isAdmin || auth.ItemAdd" class="operate">
      <el-button
        v-if="auth.isAdmin || auth.ItemExport"
        @click.native="() => {itemListExport();}"
        size="mini"
        type="primary"
        plain
      >导出商品列表</el-button>
      <el-button @click="itemItemShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary">新增</el-button>
    </div>
    <div @mousemove="handleTableMouseMove">
      <el-table
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        @sort-change="onSort"
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :height="windowHeight - offsetHeight"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
        </el-table-column>
        <el-table-column label="商品" header-align="left" min-width="260">
          <template slot-scope="scope" >
            <div style="display: flex; align-items: center;">
              <my-image-preview v-if="scope.row.images.length > 0">
                <img
                  lazy-load
                  :src="scope.row.images.length > 0 ? tencentPath + scope.row.images[0] + '_min200x200' : ''"
                  width="48"
                  height="48"
                />
              </my-image-preview>
              <ul :class="isEllipsis(scope.row)" style="margin-left: 10px;">
                <li :class="isEllipsis(scope.row)">
                  <a
                    href="javascript:void(0);"
                    :class="`title ${isEllipsis(scope.row)}`"
                    @click.prevent="showItemDetail(scope.row)"
                  >{{ scope.row.code }} / {{ scope.row.title }}</a>
                </li>
                <li>
                  <span>&yen;</span>{{returnPrice(scope.row.price_sale_piece)}} / 件
                  <span v-if="(scope.row.frame && scope.row.frame.code) || scope.row.is_weigh">(</span>
                  <span v-if="scope.row.frame && scope.row.frame.code">含框<span v-if="scope.row.is_weigh">、</span></span><span v-if="scope.row.is_weigh">需要称重</span>
                  <span v-if="(scope.row.frame && scope.row.frame.code) || scope.row.is_weigh">)</span>
                  <span v-if="scope.row.is_presale" style="color: #13ce66; margin-left: 10px;">{{isPresaleExpired(scope.row) ? '预售(已结束)' : '预售'}}</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品参数" min-width="140">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{returnPrice(scope.row.price_sale)}}元/{{scope.row.sale_unit}}、{{scope.row.origin_place}}、{{returnWeight(scope.row.gross_weight)}}斤、{{scope.row.item_spec}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否赠品" prop="is_gift" min-width="80">
          <template slot-scope="scope">
            {{scope.row.is_gift ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="展示分类" min-width="90">
          <template slot-scope="scope" :class="isEllipsis(scope.row)">
            {{scope.row.display_class?scope.row.display_class.title:'-'}}
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="item_stock" sortable="custom" header-align="left" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{scope.row.item_stock || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最大订货数" prop="order_num_max" min-width="100">
        </el-table-column>
        <el-table-column label="采购员" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{scope.row.buyer ? scope.row.buyer.realname : '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="left" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改商品编号',
                  isDisplay: auth.isAdmin || auth.ItemCodeEdit,
                  command: () => itemItemShowHideEditCode({ isShow: true, data: scope.row })
                },
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.ItemEdit,
                  command: () => itemItemShowHideAddEdit({ isShow: true, data: scope.row })
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.ItemDelete,
                  command: () => itemDelete(scope.row.id)
                },
                {
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.ItemAudit) && !scope.row.is_audited,
                  command: () => affirmApprove(scope.row.id)
                },
                {
                  title: '上架',
                  isDisplay: (auth.isAdmin || auth.ItemOnGround) && scope.row.is_audited && !scope.row.is_on_sale,
                  command: () => affirmOnGround(scope.row.id)
                },
                {
                  title: '下架',
                  isDisplay: (auth.isAdmin || auth.ItemUnderGround) && scope.row.is_audited && scope.row.is_on_sale,
                  command: () => affirmUnderGround(scope.row.id)
                },
                {
                  title: '修改标签',
                  isDisplay: (auth.isAdmin || auth.ItemTagsEdit) && scope.row.is_audited,
                  command: () => itemItemShowHideEditTags({ isShow: true, data: scope.row })
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" v-if="dataItem.num > 0">
      <div class="table-pagination">
        <el-pagination
          background
          @size-change="changePageSize"
          @current-change="changePage"
          :current-page="query.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="query.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataItem.num">
        </el-pagination>
      </div>
    </div>

    <my-add-edit :callback="myCallBack"/>
    <my-detail :callback="myCallBack"/>
    <my-tags :callback="myCallBack"/>
    <my-code-edit :callback="myCallBack"/>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Button, Input, Table, TableColumn, Tag, Pagination, RadioGroup, RadioButton, MessageBox, Select, Option } from 'element-ui';
import {TableOperate, ImagePreview} from '@/common';
import { Config, Constant, DataHandle, Http } from '@/util';
import { QueryItem } from '@/container';
import tableMixin from '@/container/table/table.mixin';
import { Item } from '@/service';
import AddEdit from './AddEdit';
import Detail from './Detail';
import Tags from './Tags';
import CodeEdit from './CodeEdit';
import viewMixin from '@/view/view.mixin';

export default {
  name: "ItemList",
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-tag': Tag,
    'el-select': Select,
    'el-option': Option,
    'my-add-edit': AddEdit,
    'my-detail': Detail,
    'my-tags': Tags,
    'my-code-edit': CodeEdit,
    'my-image-preview': ImagePreview,
    'query-item': QueryItem,
    'my-table-operate': TableOperate
  },
  mixins: [tableMixin, viewMixin],
  created() {
    let that = this;
    documentTitle('商品 - 商品列表');
    let { query, province } = that;
    if(province.code){
      query.province_code = province.code;
      that.$data.query = query;
      that.loadHandleItemList(query);
    }

    if (!this.auth.isAdmin && !this.auth.ItemAdd) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
    }
  },
  computed: mapGetters({
    dataItem: 'itemItemListDataItem'
  }),
  data(){
    return {
      province: this.$province,
      tencentPath: Config.tencentPath,
      provinceList: [],//省列表
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
      query: {
        page: 1,
        page_size: Constant.PAGE_SIZE,
        condition: '',
        province_code: '',
        item_status: '',
        buyer_id: '',
        is_audited: '',
        is_on_sale: '',
        is_presale: '',
        is_gift: '',
        display_class_code: '',
        item_stock_lt: '',
      },
    }
  },
  methods: {

    returnItemAttrs(row) {
      //{{returnPrice(scope.row.price_sale)}}元/{{scope.row.sale_unit}}、{{scope.row.origin_place}}、{{returnWeight(scope.row.gross_weight)}}斤、{{scope.row.item_spec}}
      return this.returnPrice(row.price_sale) + '元/' + row.sale_unit + '、' + row.origin_place + '、' + row.gross_weight + '斤、' + row.item_spec
    },

    indexMethod(index) {
      return (this.query.page - 1) * this.query.page_size + index + 1;
    },

    isPresaleExpired(item) {
      let expireDay = Date.parse(item.presale_end);
      let now = new Date().getTime();
      return now - expireDay > 0;
    },
    onExpandChange(isExpand) {
      if (isExpand) {
        this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
      } else {
        this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
      }
    },
    onSort({ column, prop, order }) {
      if (prop === 'item_stock') {
        if (order === 'ascending') {
          this.query.sort = 'item_stock'
        } else if (order === 'descending') {
          this.query.sort = '-item_stock'
        } else {
          this.query.sort = ''
        }
      }
      this.loadItemsFromFirstPage(this.query)
    },
    //清除条件
    clearQuery(){
      this.$data.query = {
        condition: '',
        province_code: this.province.code,
        item_status: '',
        page_size: Constant.PAGE_SIZE,
        page: 1,
        buyer_id: '',
        is_audited: '',
        is_on_sale: '',
        is_presale: '',
        is_gift: '',
        display_class_code: '',
        item_stock_lt: '',
      };
      this.loadItemsFromFirstPage(this.query);
    },
    //商品列表导出
    async itemListExport() {
      let api = Config.api.itemExport;
      let {condition, item_status, buyer_id, is_audited, is_on_sale, is_presale, is_gift, display_class_code, item_stock_lt} = this.query;
      let query = {
        condition,
        province_code: this.province.code,
        item_status,
        buyer_id,
        is_audited,
        is_on_sale,
        is_presale,
        is_gift,
        display_class_code,
        item_stock_lt
      };
      
      //判断是否可导出
      this.$loading({ isShow: true,  isWhole: true });
      let res = await Http.get(`${api}_check`, {
        province_code: this.province.code,
        ...query
      });
      if(res.code === 0){
        let queryStr = `${api}?province_code=${this.province.code}`;
        for (let item in query) {
          queryStr += `&${item}=${query[item]}`
        }
        window.open(queryStr);
      }else{
        this.$store.dispatch('message', { title: '提示', message: res.message, type: 'error' });
      }
      this.$loading({ isShow: false });
    },
    changQuery() {
      this.loadItemsFromFirstPage(this.query);
    },
    resetQuery() {
      this.clearQuery();
      this.loadItemsFromFirstPage(this.query);
    },
    loadItemsFromFirstPage(query) {
      query.page = 1;
      this.loadHandleItemList(query)
    },

    loadHandleItemList(query) {
      this.itemItemList({data: query})
    },

    showItemDetail(item) {
      let { auth } = this;
      if (auth.isAdmin || auth.ItemDetail)  {
        this.itemItemShowHideDetail({
          isShow: true,
          data: item
        })
      } else {
        MessageBox.confirm('您没有查看商品详情的权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).catch(() => {});
      }
    },
    //确认商品上架
    affirmOnGround(id){
      let that = this;
      MessageBox.confirm('确认上架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.itemItemOnGround({
          data: { id: id },
          callback: ()=>{
            that.loadHandleItemList(that.query);
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //删除商品
    itemDelete(id){
      let that = this;
      MessageBox.confirm('确认删除商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.itemItemDelete({
          data: { id: id },
          callback: ()=>{
            that.loadHandleItemList(that.query);
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //确认商品下架
    affirmUnderGround(id){
      let that = this;
      MessageBox.confirm('确认下架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //需要审核后才能下架
        that.itemItemUnderGround({
          data: { id: id },
          callback: ()=>{
            that.loadHandleItemList(that.query);
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //确认商品审核
    affirmApprove(id){
      let that = this;
      MessageBox.confirm('确认通过审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.itemItemStatusApprove({
          data: { id: id },
          callback: ()=>{
            that.loadHandleItemList(that.query);
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadItemsFromFirstPage(this.query)
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadHandleItemList(this.query);
    },
    //组件回调
    myCallBack(res){
      this.loadHandleItemList(this.query);
    },
    ...mapActions([
      'itemItemList',
      'itemItemOnGround',
      'itemItemUnderGround',
      'itemItemShowHideAddEdit',
      'itemItemShowHideDetail',
      'itemItemStatusApprove',
      'itemItemShowHideEditTags',
      'itemItemShowHideEditCode',
      'itemItemDelete'
    ])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .form-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-div{
    .input-p{
      overflow: hidden;
      margin-bottom: 10px;
    }
    .select-p{
      margin-bottom: 10px;
    }
  }
  .nums{
    flex: initial;
    p{
      margin-bottom: 6px;
    }
  }
  .status{
    flex: initial;
    text-align: right;
    color: #999;
    margin-right: 10px;
    button{
      padding: 0 6px;
      height: 26px;
      margin-bottom: 10px;
    }
  }

  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
</style>
