<template>
  <div>
    <query-group-buy v-model="query" @change="changeQuery" :reset="resetQuery"></query-group-buy>
    <div class="operate" v-if="auth.isAdmin || auth.GroupBuyAdd">
      <el-button
        v-if="auth.isAdmin || auth.GroupBuyLogQuery"
        plain
        type="primary"
        size="mini"
        @click="handleShowLogList"
      >
        操作记录
      </el-button>
      <el-button
        v-if="auth.isAdmin || auth.GroupBuyAdd"
        type="primary"
        size="mini"
        @click="handleAdd"
      >
        新增
      </el-button>
    </div>
    <table-group-buy
      :data="groupBuyList.items"
      :page="query.page"
      :pageSize="query.page_size"
      :offsetHeight="offsetHeight"
      :showItem="handleShowItem"
      :copyItem="handleCopyItem"
      :active="handleActive"
      :delete="handleDelete"
      :cancel="handleCancel"
      :edit="handleEdit"
    >
    </table-group-buy>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="groupBuyList.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>

    <el-dialog
      :visible.sync="dialog.isShowAddEdit"
      :title="dialog.type === 'add' ? '新增团购活动' : '编辑团购活动'"
      :width="dialog.addWidth"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-group-buy
        v-if="dialog.isShowAddEdit"
        v-model="groupBuyItem"
        :dialogType="dialog.type"
        :submit="dialog.type === 'edit' ? handleEditSubmit : handleSubmit"
        :close="handleClose"
        :sending="formSending"
      ></form-group-buy>
    </el-dialog>

    <!--团购详情-->
    <el-dialog
      :visible.sync="dialog.isShowDetail"
      :title="`团购信息/${detailData.code}`"
      width="1100px"
      append-to-body
    >
      <div v-if="dialog.isShowDetail">
        <div class="item-detail">
          <el-form class="custom-form-detail" label-position="right" label-width="100px" style="width: 1000px;">
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">团购商品:</dt>
                  <dd class="content">{{detailData.item_title}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">总计售出:</dt>
                  <dd class="content">{{ detailData.sale_num }}件</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">总计收入:</dt>
                  <dd class="content">{{ detailData.item_total_price ? '￥' : '' }}{{returnPrice(detailData.item_total_price)}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">团购状态:</dt>
                  <dd class="content">{{ groupBuyStatus(detailData.status) }}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">团长价:</dt>
                  <dd class="content">{{ detailData.item.price_sale ? '￥' : '' }}{{returnPrice(detailData.item.price_sale)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">团购价:</dt>
                  <dd class="content">{{ detailData.price ? '￥' : '' }}{{returnPrice(detailData.price)}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">开始时间:</dt>
                  <dd class="content">{{detailData.start_time}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">结束时间:</dt>
                  <dd class="content">{{detailData.end_time}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="detailData.rules && detailData.rules.length > 0">
              <el-col :span="12">
                <dl class="detail-item">
                  <dt class="label">阶梯优惠:</dt>
                  <dd class="content">
                    <ul>
                      <li v-for="rule in detailData.rules">
                        <span>满{{rule.full}}件, </span><span>售{{returnPrice(rule.price)}}元/件</span>
                      </li>
                    </ul>
                  </dd>
                </dl>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <table-group-buy-detail
            :data="detailStoreList.items"
            :page="detailQuery.page"
            :pageSize="detailQuery.page_size"
            :showItem="handleShowDetailItem"
          >
          </table-group-buy-detail>
          <div class="footer" style="margin-top: 10px;">
            <div class="table-pagination">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 30, 40, 50]"
                @size-change="changeDetailPageSize"
                @current-change="changeDetailPage"
                :total="detailStoreList.num"
                :page-size="detailQuery.page_size"
                :current-page="detailQuery.page"
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!--门店详情-->
    <el-dialog
      :visible.sync="dialog.isShowMerchantDetail"
      title="开团门店信息"
      width="1100px"
      append-to-body
    >
      <div v-if="dialog.isShowMerchantDetail">
        <div class="item-detail">
          <el-form class="custom-form-detail" label-position="right" label-width="110px" style="width: 1000px;">
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">门店名称:</dt>
                  <dd class="content">{{detailMerchantData.store.title}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">团购价:</dt>
                  <dd class="content">{{detailMerchantData.price ? '￥' : '' }}{{returnPrice(detailMerchantData.price)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">当前价格:</dt>
                  <dd class="content">{{detailMerchantData.item_price ? '￥' : '' }}{{returnPrice(detailMerchantData.item_price)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">总销售价:</dt>
                  <dd class="content">{{detailMerchantData.pay_amount_at_created ? '￥' : '' }}{{returnPrice(detailMerchantData.pay_amount_at_created)}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">用户退款:</dt>
                  <dd class="content">{{detailMerchantData.refund ? '￥' : '' }}{{returnPrice(detailMerchantData.refund)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">总件数:</dt>
                  <dd class="content">{{detailMerchantData.num}}件</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">参团人数:</dt>
                  <dd class="content">{{detailMerchantData.member_num}}人</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="detailMerchantData.rules && detailMerchantData.rules.length > 0">
              <el-col :span="12">
                <dl class="detail-item">
                  <dt class="label">阶梯优惠:</dt>
                  <dd class="content">
                    <ul>
                      <li v-for="rule in detailMerchantData.rules">
                        <span>满{{rule.full}}件, </span><span>售{{returnPrice(rule.price)}}元/件</span>
                      </li>
                    </ul>
                  </dd>
                </dl>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <table-group-buy-merchant-detail
            :data="merchantMemberList.items"
            :page="detailMerchantQuery.page"
            :pageSize="detailMerchantQuery.page_size"
          >
          </table-group-buy-merchant-detail>
          <div class="footer" style="margin-top: 10px;">
            <div class="table-pagination">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 30, 40, 50]"
                @size-change="changeDetailMerchantPageSize"
                @current-change="changeDetailMerchantPage"
                :total="merchantMemberList.num"
                :page-size="detailMerchantQuery.page_size"
                :current-page="detailMerchantQuery.page"
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {Button, Pagination, Dialog, Form, FormItem, Message, MessageBox, Col, Row} from 'element-ui';
  import {Constant, DataHandle} from '@/util';
  import {QueryGroupBuy, TableGroupBuy, FormGroupBuy, TableGroupBuyDetail, TableGroupBuyMerchantDetail} from '@/container';

  export default {
    name: "BuyList",
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-col': Col,
      'el-row': Row,
      'query-group-buy': QueryGroupBuy,
      'table-group-buy': TableGroupBuy,
      'form-group-buy': FormGroupBuy,
      'table-group-buy-detail': TableGroupBuyDetail,
      'table-group-buy-merchant-detail': TableGroupBuyMerchantDetail,
    },
    props: {
      showLogList: { type: Function, required: true }
    },
    created() {
      documentTitle('团购 - 商品列表');
      this.initQuery();
      this.loadListDataFirstPage();

      if (!this.auth.isAdmin && !this.auth.GroupBuyAdd && !this.auth.GroupBuyLogQuery) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    computed: {
      ...mapGetters({
        groupBuyList: 'groupBuyListData',
        detailStoreList: 'groupBuyStoreListData',
        merchantMemberList: 'groupBuyMemberListData'
      })
    },
    data() {
      return {
        province: this.$province,
        auth: this.$auth,
        query: {},
        detailQuery: {},
        detailMerchantQuery: {},
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
        groupBuyItem: {},
        detailData: {},
        detailMerchantData: {},
        formSending: false,
        dialog: {
          addWidth: '1100px',
          type: 'add',
          isShowAddEdit: false,
          isShowDetail: false,
          isShowMerchantDetail: false,
          isShowLogList: false
        }
      }
    },
    methods: {
      ...mapActions([
        'groupBuyQuery',
        'groupBuyItemList',
        'groupBuyActive',
        'groupBuyCancel',
        'groupBuyDelete',
        'groupBuyAdd',
        'groupBuyEdit',
        'groupBuyDetail',
        'groupBuyStoreDetail',
        'groupBuyStoreList',
        'groupBuyStoreMemberList'
      ]),

      returnPrice(price) {
        return DataHandle.returnPrice(price)
      },

      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          status: '',  //活动状态
          progress_status: '',  //活动进行状态
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },

      initDetailQuery() {
        this.$data.detailQuery = Object.assign({}, this.$data.detailQuery, {
          province_code: this.province.code,
          gb_activity_id: '',  //活动状态
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },

      initDetailMerchantQuery() {
        this.$data.detailMerchantQuery = Object.assign({}, this.$data.detailMerchantQuery, {
          province_code: this.province.code,
          store_gb_activity_id: '',  //活动状态
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },

      changeQuery() {
        this.loadListDataFirstPage()
      },
      resetQuery() {
        this.initQuery();
        this.loadListDataFirstPage()
      },
      changePage(page) {
        this.$data.query.page = page;
        this.groupBuyQuery({query: this.$data.query});
      },
      changePageSize(size) {
        this.$data.query.page_size = size;
        this.loadListDataFirstPage()
      },

      //改变详情页门店列表页数
      changeDetailPage(page) {
        this.$data.detailQuery.page = page;
        this.groupBuyStoreList({query: this.$data.detailQuery});
      },
      changeDetailPageSize(size) {
        // console.log('size: ', size);
        this.$data.detailQuery.page_size = size;
        this.$data.detailQuery.page = 1;
        this.groupBuyStoreList({query: this.$data.detailQuery});
      },

      //改变详情页门店成员列表页数
      changeDetailMerchantPage(page) {
        this.$data.detailMerchantQuery.page = page;
        this.groupBuyStoreMemberList({query: this.$data.detailMerchantQuery});
      },
      changeDetailMerchantPageSize(size) {
        // console.log('size: ', size);
        this.$data.detailMerchantQuery.page_size = size;
        this.$data.detailMerchantQuery.page = 1;
        this.groupBuyStoreMemberList({query: this.$data.detailMerchantQuery});
      },

      loadListDataFirstPage() {
        let { query } = this;
        query.page = 1;
        this.groupBuyQuery({query: query})
      },

      groupBuyStatus(status) {
        if (status === 'activated') {
          return '已生效'
        } else if (status === 'deactivated') {
          return '未生效'
        } else {
          return ''
        }
      },

      handleShowLogList() {
        this.$props.showLogList();
      },

      handleAdd() {
        // 为需要编辑的活动对象进行初始化设置
        this.$data.groupBuyItem = {};
        this.$data.groupBuyItem = Object.assign({}, this.$data.groupBuyItem, {
          province_code: this.province.code,
          start_time: '',
          end_time: '',
          item_spec_unit: '',
          max_num_pp: 99,
          pickerValue: null, // 需要通过start_time和end_time
          rules: [ /*{ full: null, price: null }*/ ],
        });

        this.$data.dialog.type = 'add';
        this.$data.dialog.isShowAddEdit = true;
      },

      handleEditSubmit() {
        this.$data.formSending = true;
        let item = this.$data.groupBuyItem;

        // console.log('edit item: ', item);

        let submitItem = {
          province_code: this.province.code,
          id: item.id,
          cover_image: item.cover_images[0],
          item_images: item.item_images,
          item_title: item.item_title,
          price_sale: DataHandle.handlePrice(item.price_sale),   //价格
          rank: Number(item.rank),
          content: item.content,
          start_time: item.pickerValue[0],
          end_time: item.pickerValue[1],
          delivery_date: item.delivery_date,
          price: DataHandle.handlePrice(item.price),
          price_origin: DataHandle.handlePrice(item.price_origin),
          max_num_pp: Number(item.max_num_pp),
          gb_num: Number(item.gb_num),
          stock_num: Number(item.stock_num),
          rules: this.handleSubmitRules(item.rules),
          status: this.handleSubmitStatus(item.status),
          share_content: item.share_content ? item.share_content : '',
          share_image: item.share_images && item.share_images.length > 0 ? item.share_images[0] : ''
        };

        let success = () => {
          this.groupBuyQuery({ query: this.$data.query });
          this.$data.formSending = false;
          this.$data.dialog.isShowAddEdit = false;
        };

        let error = () => {
          this.$data.formSending = false;
        };

        this.groupBuyEdit({
          item: submitItem,
          success: success,
          error: error
        });
      },

      //新增团购商品
      handleSubmit() {
        this.$data.formSending = true;
        let item = this.$data.groupBuyItem;

        let submitItem = {
          province_code: this.province.code,
          cover_image: item.cover_images[0],
          item_images: item.item_images,
          item_title: item.item_title,
          price_sale: DataHandle.handlePrice(item.price_sale),   //价格
          rank: Number(item.rank),
          content: item.content,
          start_time: item.start_time,
          end_time: item.end_time,
          delivery_date: item.delivery_date,
          price: DataHandle.handlePrice(item.price),
          price_origin: DataHandle.handlePrice(item.price_origin),
          max_num_pp: Number(item.max_num_pp),
          gb_num: Number(item.gb_num),
          stock_num: Number(item.stock_num),
          rules: this.handleSubmitRules(item.rules),
          status: this.handleSubmitStatus(item.status),
          share_content: item.share_content ? item.share_content : '',
          share_image: item.share_images && item.share_images.length > 0 ? item.share_images[0] : ''
        };

        let success = () => {
          this.groupBuyQuery({ query: this.$data.query });
          this.$data.formSending = false;
          this.$data.dialog.isShowAddEdit = false;
        };

        let error = () => {
          this.$data.formSending = false;
        };

        this.groupBuyAdd({
          item: submitItem,
          success: success,
          error: error
        });
      },

      handleSubmitStatus(status) {
        if (status) {
          return 'activated'
        } else {
          return 'deactivated'
        }
      },

      handleSubmitRules(rules) {
        let newRules = Array();
        rules.map(rule => {
          let newRule = {};
          newRule.full = Number(rule.full);
          newRule.price = DataHandle.handlePrice(rule.price);
          newRules.push(newRule)
        });

        newRules.sort((a, b) => Number(a.full) - Number(b.full));
        return newRules;
      },

      handleClose() {
        this.$data.dialog.isShowAddEdit = false;
      },

      handleShowItem(row) {
        let that = this;
        let success = (data) => {
          this.$data.detailData = data;
          this.$data.dialog.isShowDetail = true;
          // console.log('detailData: ', this.$data.detailData)
        };

        let error = () => {

        };

        this.groupBuyDetail({
          query: {id: row.id},
          success: success,
          error: error
        });

        //获取团购活动门店列表
        this.initDetailQuery();
        this.$data.detailQuery.gb_activity_id = row.id;
        this.groupBuyStoreList({
          query: this.$data.detailQuery
        });
      },

      handleCopyItem(row) {
        let success = (item) => {
          // console.log('item: ', item)
          // item.item.item_spec = '3645ml'
          let editItem = {
            id: row.id,
            cover_images: [item.cover_image],
            item_images: item.item.images,
            item_title: item.item.title,
            price_sale: DataHandle.returnPrice(item.item.price_sale),   //价格
            rank: item.rank,
            content: item.item.content,
            pickerValue: null,
            delivery_date: '',
            price: DataHandle.returnPrice(item.price),
            price_origin: DataHandle.returnPrice(item.price_origin),
            max_num_pp: item.max_num_pp,
            gb_num: item.gb_num,
            stock_num: item.stock_num,
            rules: this.handleEditRules(item.rules),
            status: this.handleEditStatus(item.status),
            progress_status: item.progress_status,
            share_content: item.share_content,
            share_images: item.share_image === '' ? [] : [item.share_image]
          };

          this.$data.groupBuyItem = editItem;

          this.$data.dialog.type = 'copy';
          this.$data.dialog.isShowAddEdit = true;
        };

        let error = () => {};

        this.groupBuyDetail({
          query: {id: row.id},
          success: success,
          error: error
        });
      },

      //显示团购门店详情
      handleShowDetailItem(row) {
        let that = this;
        let success = (data) => {
          this.$data.detailMerchantData = data;
          this.$data.dialog.isShowMerchantDetail = true;
        };

        let error = () => {

        };

        this.groupBuyStoreDetail({
          query: {id: row.id},
          success: success,
          error: error
        });

        //获取团购门店成员列表
        this.initDetailMerchantQuery();
        this.$data.detailMerchantQuery.store_gb_activity_id = row.id;
        this.groupBuyStoreMemberList({
          query: this.$data.detailMerchantQuery
        });
      },

      //生效
      handleActive(row) {
        let that = this;
        let { query } = that;
        MessageBox.confirm('确定上架团购活动？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.groupBuyActive({
            data: {
              id: row.id
            },
            callback: function (data) {
              that.groupBuyQuery({query: query})
            }
          });
        }).catch(() => {

        });
      },

      //取消
      handleCancel(row) {
        let that = this;
        let { query } = that;
        MessageBox.confirm('确定下架团购活动？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.groupBuyCancel({
            data: {
              id: row.id
            },
            callback: function (data) {
              that.groupBuyQuery({query: query})
            }
          });
        }).catch((e) => {
          console.error(e);
        });
      },

      //删除
      handleDelete(row) {
        let that = this;
        let { query } = that;
        MessageBox.confirm('确定删除团购活动？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.groupBuyDelete({
            data: {
              id: row.id
            },
            callback: function (data) {
              that.groupBuyQuery({query: query})
            }
          });
        }).catch((e) => {
          console.error(e);
        });
      },

      //编辑
      handleEdit(row) {

        let success = (item) => {
          let editItem = {
            id: row.id,
            cover_images: [item.cover_image],
            item_images: item.item.images,
            item_title: item.item.title,
            price_sale: DataHandle.returnPrice(item.item.price_sale),   //价格
            rank: item.rank,
            content: item.item.content,
            pickerValue: [item.start_time, item.end_time],
            delivery_date: item.delivery_date,
            price: DataHandle.returnPrice(item.price),
            price_origin: DataHandle.returnPrice(item.price_origin),
            max_num_pp: item.max_num_pp,
            gb_num: item.gb_num,
            stock_num: item.stock_num,
            rules: this.handleEditRules(item.rules),
            status: this.handleEditStatus(item.status),
            progress_status: item.progress_status,
            share_content: item.share_content,
            share_images: item.share_image === '' ? [] : [item.share_image]
          };

          this.$data.groupBuyItem = editItem;

          this.$data.dialog.type = 'edit';
          this.$data.dialog.isShowAddEdit = true;
        };

        let error = () => {};

        this.groupBuyDetail({
          query: {id: row.id},
          success: success,
          error: error
        });


      },

      handleEditRules(rules) {
        let newRules = Array();
        rules.map(rule => {
          let newRule = {};
          newRule.full = rule.full;
          newRule.price = DataHandle.returnPrice(rule.price);
          newRules.push(newRule)
        });
        return newRules;
      },

      handleEditStatus(status) {
        return status === 'activated';
      },

      // handleEditSpec(itemSpec) {
      //   let unit = this.handleEditSpecUnit(itemSpec);
      //   switch (unit) {
      //     case '':
      //       return itemSpec;
      //     case '斤':
      //       return itemSpec.substring(0, itemSpec.length - 1);
      //     case '份':
      //       return itemSpec.substring(0, itemSpec.length - 1);
      //     case '克':
      //       return itemSpec.substring(0, itemSpec.length - 1);
      //     case 'ml':
      //       return itemSpec.substring(0, itemSpec.length - 2);
      //     case 'L':
      //       return itemSpec.substring(0, itemSpec.length - 1);
      //     default:
      //       return ''
      //   }
      // },
      //
      // handleEditSpecUnit(itemSpec) {
      //   //\u65a4 斤
      //   //\u4efd 份
      //   //\u514b 克
      //   let isCatty = /^.+[\u65a4]$/.test(itemSpec);
      //   let isPortion = /^.+[\u4efd]$/.test(itemSpec);
      //   let isGramme = /^.+[\u514b]$/.test(itemSpec);
      //   let isML = /^.+[ml]$/.test(itemSpec);
      //   let isL = /^.+[L]$/.test(itemSpec);
      //   if (isCatty) {
      //     return '斤'
      //   } else if (isPortion) {
      //     return '份'
      //   } else if (isGramme) {
      //     return '克'
      //   } else if (isML) {
      //     return 'ml'
      //   } else if (isL) {
      //     return 'L'
      //   } else {
      //     return ''
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .item-detail {

    padding-left: 10px;

    .detail-item {

      display: flex;

      .label {
        color: #606266;
        width: 80px;
        line-height: 20px;
      }

      .content {
        padding-right: 20px;
        flex: 1;
        word-break: break-all;
        line-height: 20px;
      }
    }

    .img-div{
      overflow: hidden;
      background: #fff;
      >img{
        width: 64px;
        height: 64px;
        margin-right: 10px;
      }
    }
    .label{
      height: 50px
    }
    .my-quill-editor-detail img {
      width: 480px;
      height: auto;
    }
  }
</style>
