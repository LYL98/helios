<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <query-marketing-coupon v-model="query" @change="changeQuery" :reset="resetQuery"/>
    <div class="container-table">
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="query.coupon_type" @change="changeQuery" :tab-panes="{'全部': '', '满减': 'type_reduction', '满折': 'type_discount', '满赠': 'type_gift'}"/>
        </div>
        <div class="right" v-if="auth.isAdmin || auth.MarketingCouponDistributeStatistic || auth.MarketingCouponAdd">
          <el-button
            v-if="auth.isAdmin || auth.MarketingCouponDistributeStatistic"
            type="primary"
            size="mini"
            @click="dialog.isShowStatistic = true"
          >
            优惠券发放统计列表
          </el-button>
          <el-button
            v-if="auth.isAdmin || auth.MarketingCouponAdd"
            type="primary"
            size="mini"
            @click="handleAddItem"
          >
            新增
          </el-button>
        </div>
      </div>
      <table-marketing-coupon
        :data="dataItem.items"
        :page="query.page"
        :pageSize="query.page_size"
        :sendItem="handleSendItem"
        :autoDis="handleAutoDis"
        :showItem="handleShowItem"
        :showLog="handleShowLog"
        :windowHeight="viewWindowHeight"
      >
      </table-marketing-coupon>
      <div class="footer">
        <div class="table-pagination">
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
    </div>
    <el-dialog
      :visible.sync="dialog.isShowAdd"
      title="新增优惠券"
      :width="dialog.addWidth"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-marketing-coupon-add
        v-if="dialog.isShowAdd"
        v-model="item"
        :changeType="handleChangeType"
        :submit="handleSubmit"
        :close="handleClose"
        :sending="formSending"
      ></form-marketing-coupon-add>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.isShowSend"
      title="发送优惠券"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-marketing-coupon-send
        v-if="dialog.isShowSend"
        v-model="send"
        :submit="handleSendSubmit"
        :close="handleCloseSend"
        :sending="formSending"
      ></form-marketing-coupon-send>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowLog"
      :title="`${coupon_log.code} / ${coupon_log.title} 发放记录`"
      width="1000px"
      append-to-body
    >
      <table-marketing-coupon-log v-if="dialog.isShowLog" :coupon_log="coupon_log"/>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowStatistic"
      title="优惠券发放统计列表"
      width="1100px"
      append-to-body
    >
      <table-marketing-coupon-statistic
        v-if="dialog.isShowStatistic"
        :showItem="handleShowItem"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.isShowDetail"
      width="600px"
      :title="detail.code + ' / ' + detail.title"
      append-to-body
    >
      <el-form label-position="left" label-width="130px" style="padding: 0 20px; margin-top: -10px;">
        <el-form-item label="优惠券信息：">
          <ul style="margin-top: 40px; position: relative; left: -80px;">
            <li>优惠券类型：{{!detail.item_id ? '订单' : '单品'}}{{ couponType[detail.coupon_type] }}</li>
            <li>
              优惠券规则：{{ detail.coupon_type === 'type_reduction'
                        ? `${!detail.item_id ? '订单' : '单品'}满${returnPrice(detail.amount_full)}元，减${returnPrice(detail.benefit)}元`
                          : detail.coupon_type === 'type_discount' ? `${!detail.item_id ? '订单' : '单品'}满${returnPrice(detail.amount_full)}元，打${returnDiscount(detail.benefit)}折`
                            : detail.coupon_type === 'type_gift' ? `${!detail.item_id ? '订单' : '单品'}满${returnPrice(detail.amount_full)}元，赠送 ${detail.gift_item.title} 商品 ${detail.benefit} 个`
                            : '暂无使用规则'
              }}
            </li>
            <li>创建人：{{ detail.operator && detail.operator.realname }}</li>
            <li>创建时间：{{ detail.created }}</li>
          </ul>
        </el-form-item>
        <el-form-item label="优惠券使用：">
          <ul style="margin-top: 40px; position: relative; left: -80px;">
            <li>使用时间：{{ detail.time_start }} ~ {{ detail.time_end }}</li>
            <li>使用范围：{{ detail.item_id === 0 ? '适用于全部商品' : `适用于 ${detail.item.title} 商品` }}</li>
          </ul>
        </el-form-item>

        <el-form-item label="优惠券自动发放：" v-if="detail.is_auto_dis">
          <ul style="margin-top: 40px; position: relative; left: -80px;">
            <li v-if="detail.dis_time_start && detail.dis_time_end">发放时间：{{ detail.dis_time_start }} ~ {{ detail.dis_time_end }}</li>
            <li>发放条件：{{ `${detail.auto_dis_item == 0 ? '订单' : '单品'}满 ${returnPrice(detail.auto_dis_full)} 元，系统自动发放1张` }}</li>
            <li v-if="detail.auto_dis_item != 0">发放范围：<span v-if="detail.dis_item">{{ detail.dis_item.code }} / {{ detail.dis_item.title }}</span></li>
          </ul>
        </el-form-item>
      </el-form>
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Button, Pagination, Dialog, Form, FormItem, Message, MessageBox} from 'element-ui';
  import QueryMarketingCoupon from './QueryMarketingCoupon';
  import TableMarketingCoupon from './TableMarketingCoupon';
  import TableMarketingCouponLog from './TableMarketingCouponLog';
  import TableMarketingCouponStatistic from './TableMarketingCouponStatistic';
  import FormMarketingCouponAdd from './FormMarketingCouponAdd';
  import FormMarketingCouponSend from './FormMarketingCouponSend';
  import {Constant, DataHandle, Config, Http} from '@/util';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: "CouponList",
    mixins: [mainMixin],
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'query-marketing-coupon': QueryMarketingCoupon,
      'table-marketing-coupon': TableMarketingCoupon,
      'table-marketing-coupon-log': TableMarketingCouponLog,
      'table-marketing-coupon-statistic': TableMarketingCouponStatistic,
      'form-marketing-coupon-add': FormMarketingCouponAdd,
      'form-marketing-coupon-send': FormMarketingCouponSend,
      'global-province': GlobalProvince,
      'query-tabs': queryTabs
    },
    data() {
      return {
        province: {},
        auth: this.$auth,
        query: {
          province_code: '',
          status: '', //活动状态 '' 全部； 'st_activated'：进行中； 'st_deactivated'：'未开展'
          coupon_type: '',  // '' 全部； 'type_reduction' 全场满减； 'type_discount' 单品满折
          is_auto_dis: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        }, // 查询条件
        item: {},   // 需要新增的项
        send: {}, // 需要发送的项
        formSending: false,
        detail: {
          item: {},
          gift_item: {}
        }, // 优惠券显示的详情
        coupon_log: { // 需要查看日志的优惠券
          id: 0,
          code: '',
          title: ''
        },
        couponType: Constant.ITEM_COUPON_TYPE,
        dialog: {
          addWidth: '700px',
          isShowAdd: false,
          isShowSend: false,
          isShowLog: false,
          isShowStatistic: false,
          isShowDetail: false
        },
        dataItem: {
          items: [],
          num: 0
        }
      }
    },
    created() {
      documentTitle('营销 - 优惠券');
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.province.id){
          let { query } = this;
          this.$data.province = data;
          query.page = 1;
          query.province_code = data.code;
          this.$data.query = query;
        }else{
          this.$data.province = data;
          this.initQuery();
        }
        this.itemCouponQuery();
      },
      //获取数据
      async itemCouponQuery(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemCouponQuery, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //新增
      async itemCouponAdd({item, success, error}) {
        let res = await Http.post(Config.api.itemCouponAdd, item);
        if (res.code === 0) {
          this.$message({title: '提示', message: '优惠券添加成功！', type: 'success'});
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
      },
      //发放
      async itemCouponDistribute({item, success, error}) {
        let res = await Http.post(Config.api.itemCouponDistribute, item);
        if (res.code === 0) {
          this.$message({title: '提示', message: '优惠券发放成功！', type: 'success'});
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
      },
      //暂停开始
      async itemCouponAutoDis({data, success, error}) {
        let res = await Http.post(Config.api.itemCouponAutoDis, data);
        let message = data.auto_dis_status == 0 ? '自动发放已暂停！' : '自动发放已开始！';
        if (res.code === 0) {
          this.$message({title: '提示', message: message, type: 'success'});
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
      },
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          status: '', //活动状态 '' 全部； 'st_activated'：进行中； 'st_deactivated'：'未开展'
          coupon_type: '',  // '' 全部； 'type_reduction' 全场满减； 'type_discount' 单品满折
          is_auto_dis: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },

      changeQuery() {
        this.itemCouponQuery();
      },
      resetQuery() {
        this.initQuery();
        this.itemCouponQuery();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.itemCouponQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.itemCouponQuery();
      },

      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      returnDiscount(discount) {
        return DataHandle.returnDiscount(discount);
      },

      endSending() {
        this.$data.formSending = false;
      },

      handleAddItem() {
        // 为需要编辑的活动对象进行初始化设置
        this.$data.item = Object.assign({}, this.$data.item, {
          province_code: this.province.code,
          title: '',
          pickerValue: null, // handle
          time_start: '',
          time_end: '',
          pickerDisValue: null, // handle
          dis_time_start: '',
          dis_time_end: '',
          coupon_type: 'type_reduction',
          rule: { // handle 优惠券使用规则
            amount_full: '',
            benefit: '',
            item: {id: '', title: ''},
          },
          amount_full: '',
          benefit: '', // 减xx元，打xx折，送xx件
          gift_item_id: '',

          range: { // handle 优惠券使用范围
            type: 'all', // all 全场，item 单品
            item: {id: '', title: ''} // 如果是单品，则选择商品的信息
          },
          item_id: 0, // 优惠券适用的商品ID，0 全场
          is_auto_dis: 0, // 自动发放
          auto_dis_full: '', // 自动发放条件
          auto_range: { // handle 优惠券自动发放范围
            type: 'all',
            item: { id: '', title: '' }
          },
          auto_dis_item: 0, // 自动发放范围
        });
        this.$data.dialog.isShowAdd = true;
      },
      // 根据表单的类型 调整弹窗的宽度
      handleChangeType(type) {
        switch(type) {
          case 'type_reduction':
          case 'type_discount':
            this.$data.dialog.addWidth = '700px';
            break;
          case 'type_gift':
            this.$data.dialog.addWidth = '900px';
            break;
        }
      },
      handleSubmit() {
        this.$data.formSending = true;
        let {
          province_code,
          title,
          time_start,
          time_end,
          coupon_type,
          amount_full,
          benefit,
          gift_item_id,
          item_id,
          is_auto_dis,
          auto_dis_full,
          auto_dis_item,
          dis_time_start,
          dis_time_end,
        } = this.$data.item;
        amount_full = DataHandle.handlePrice(this.$data.item.rule.amount_full);
        switch(coupon_type) {
          case 'type_reduction':
            benefit = DataHandle.handlePrice(this.$data.item.rule.benefit);
            break;
          case 'type_discount':
            benefit = DataHandle.handleDiscount(this.$data.item.rule.benefit);
            break;
          case 'type_gift':
            gift_item_id = this.$data.item.rule.item.id; // 设置赠送商品的id
            benefit = this.$data.item.rule.benefit; // 赠送商品的个数
            break;
        }
        switch(this.$data.item.range.type) {
          case 'all':
            item_id = 0; // 表示适用于全场
            break;
          case 'item':
            item_id = this.$data.item.range.item.id; // 设置使用商品的id
            break;
        }
        if (is_auto_dis == 1) {
          auto_dis_full = DataHandle.handlePrice(auto_dis_full);
          switch(this.$data.item.auto_range.type) {
            case 'all':
              auto_dis_item = 0; // 表示适用于全场
              break;
            case 'item':
              auto_dis_item = this.$data.item.auto_range.item.id; // 设置使用商品的id
              break;
          }
        }
        let success = () => {
          this.$data.formSending = false;
          this.$data.dialog.isShowAdd = false;
          this.itemCouponQuery();
        };
        let error = () => {
          this.$data.formSending = false;
        };

        this.itemCouponAdd({
          item: { province_code, title, time_start, time_end, coupon_type, amount_full, benefit, gift_item_id, item_id, is_auto_dis, auto_dis_full, auto_dis_item, dis_time_start, dis_time_end, },
          success: success,
          error: error
        });
      },

      handleClose() {
        this.$data.dialog.isShowAdd = false;
      },

      handleSendItem(item) {
        this.$data.send = Object.assign({}, this.$data.send, {
          id: item.id,
          code: item.code,
          title: item.title,
          type: 'grade', // handle发放优惠券的类型， 默认为grade
          grade_codes: [],
          city_ids: [],
          merchant_ids: []
        });
        this.$data.dialog.isShowSend = true;
      },
      handleAutoDis(item) {

        let success = () => {
          this.itemCouponQuery();
        }
        let messageTitle = item.auto_dis_status ? '确认暂停自动发放？' : '确认开始自动发放？';
        let data = {
          coupon_id: item.id,
          auto_dis_status: item.auto_dis_status ? 0 : 1
        }

        MessageBox.confirm(messageTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.itemCouponAutoDis({ data, success });
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleSendSubmit() {
        this.$data.formSending = true;
        let { id, type, grade_codes, city_ids, merchant_ids } = this.$data.send;
        let data = { coupon_id: id };
        switch (type) {
          case 'grade':
            data.grade_codes = grade_codes.map(item => item.code);
            data.city_ids = city_ids.map(item => item.code);
            break;
          case 'city':
            data.city_ids = city_ids.map(item => item.code);
            break;
          case 'merchant':
            data.merchant_ids = merchant_ids.map(item => item.code);
            break;
          default:
            return;
        }

        let success = () => {
          this.$data.formSending = false;
          this.$data.dialog.isShowSend = false;
        };
        let error = () => {
          this.$data.formSending = false;
        };

        this.itemCouponDistribute({ item: data, success: success, error: error });

      },
      handleCloseSend() {
        this.$data.dialog.isShowSend = false;
      },
      // 根据传递进来的id，显示优惠券的详情！
      async handleShowItem(id) {
        let res = await Http.get(Config.api.itemCouponDetail, { coupon_id: id });
        if (res.code === 0) {
          this.detail = res.data;
          this.$data.dialog.isShowDetail = true;
        } else {
          Message.warning(res.message);
        }
      },
      // 显示发放记录
      handleShowLog(item) {
        this.$data.coupon_log = Object.assign(this.$data.coupon_log, {
          id: item.id,
          code: item.code,
          title: item.title
        })
        this.$data.dialog.isShowLog = true;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
