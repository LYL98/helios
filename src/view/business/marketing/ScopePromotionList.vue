<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <query-marketing-scope-promotion
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
    >
    </query-marketing-scope-promotion>
    <div class="container-table">
      <div class="table-top" v-if="auth.isAdmin || auth.MarketingScopePromotionAdd">
        <div class="left"></div>
        <div class="right">
          <el-button @click="handleAddItem" size="mini" type="primary">新增</el-button>
        </div>
      </div>
      <table-marketing-scope-promotion
        :data="dataItem.items"
        :page="query.page"
        :pageSize="query.page_size"
        :start="handleStart"
        :end="handleEnd"
      />
      <div class="footer" v-if="dataItem.num > 0">
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
      :visible.sync="dialog.isShow"
      title="新增全场营销"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
    >
      <form-marketing-scope-promotion
        v-if="dialog.isShow"
        v-model="item"
        :submit="handleSubmit"
        :close="handleClose"
        :sending="formSending"
      ></form-marketing-scope-promotion>
    </el-dialog>
  </sub-menu>
</template>

<script>
  /**
   * 促销活动列表
   */
  import { Pagination, Button, Dialog } from 'element-ui';
  import QueryMarketingScopePromotion from './QueryMarketingScopePromotion';
  import TableMarketingScopePromotion from './TableMarketingScopePromotion';
  import FormMarketingScopePromotion from './FormMarketingScopePromotion';
  import { GlobalProvince } from '@/component';
  import CouponList from './CouponList';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "ScopePromotionList",
    mixins: [mainMixin],
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-marketing-scope-promotion': QueryMarketingScopePromotion,
      'table-marketing-scope-promotion': TableMarketingScopePromotion,
      'form-marketing-scope-promotion': FormMarketingScopePromotion,
      'global-province': GlobalProvince,
    },
    data() {
      return {
        province: {},
        auth: this.$auth,
        query: {
          province_code: '',
          date_status: '', //活动状态 '' 全部； 'date_before'：未开展； 'date_on'：'进行中'; 'date_out_of': '已结束'
          promotion_type: '',  // '' 全部； 'type_reduction' 全场满减； 'scope_discount' 全场满折
          status: '', // 生效状态 '' 全部；'st_deactivated' 未生效； 'st_activated' 已生效
          topic: '', // 活动主题模糊搜索
          page: 1,
          page_size: Constant.PAGE_SIZE
        }, //查询条件
        item: {}, // 需要添加的活动对象
        formSending: false,
        dialog: {
          isShow: false
        },
        dataItem: {
          items: [],
          num: 0
        }
      }
    },
    created() {
      documentTitle('营销 - 全场营销');
    },
    methods: {
      //选择区域后【初始化】
      selectProvince(data){
        this.$data.province = data;
        this.initQuery();
        this.itemScopePromotionQuery();
      },
      //获取数据
      async itemScopePromotionQuery(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemScopePromotionQuery, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //新增
      async itemScopePromotionAdd({item, success, error}) {
        let res = await Http.post(Config.api.itemScopePromotionAdd, item);
        if (res.code === 0) {
          this.$message({title: '提示', message: '促销活动添加成功！', type: 'success'});
          success && success();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
          error && error();
        }
      },
      //开始
      async itemScopePromotionStart({promotion_id, callback}) {
        let res = await Http.post(Config.api.itemPromotionStart, {promotion_id});
        if (res.code === 0) {
          this.$message({title: '提示', message: '活动已经上架！', type: 'success'});
          callback && callback();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //停止
      async itemScopePromotionHalt({promotion_id, callback}) {
        let res = await Http.post(Config.api.itemPromotionHalt, {promotion_id});
        if (res.code === 0) {
          this.$message({title: '提示', message: '活动已经下架！', type: 'success'});
          callback && callback();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      initQuery() {
        this.$data.query = Object.assign({}, this.query, {
          province_code: this.province.code,
          date_status: '', //活动状态 '' 全部； 'date_before'：未开展； 'date_on'：'进行中'; 'date_out_of': '已结束'
          promotion_type: '',  // '' 全部； 'type_reduction' 全场满减； 'scope_discount' 全场满折
          status: '', // 生效状态 '' 全部；'st_deactivated' 未生效； 'st_activated' 已生效
          topic: '', // 活动主题模糊搜索
          page: 1,
          page_size: Constant.PAGE_SIZE
        });
      },

      changeQuery() {
        this.itemScopePromotionQuery();
      },
      resetQuery() {
        this.initQuery();
        this.itemScopePromotionQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.itemScopePromotionQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.itemScopePromotionQuery();
      },
      handleAddItem() {
        // 为需要编辑的活动对象进行初始化设置
        this.$data.item = Object.assign({}, this.item, {
          province_code: this.province.code,
          promotion_type: 'type_reduction',
          topic: '',
          pickerValue: null, // handle
          time_start: '',
          time_end: '',
          rules: [ { full: null, reduction: null } ],
        });
        this.$data.dialog.isShow = true;
      },

      handleSubmit() {
        this.$data.formSending = true;
        let {
          province_code,
          promotion_type,
          topic,
          time_start,
          time_end,
          rules
        } = Object.assign({}, this.$data.item);

        rules = rules.map(item => {
          let { full, reduction } = item;

          full = DataHandle.handlePrice(full);

          reduction = promotion_type === 'type_reduction'
            ? DataHandle.handlePrice(reduction)
            : DataHandle.handleDiscount(reduction);

          return {full: full, reduction: reduction};
        });

        let success = () => {
          this.itemScopePromotionQuery();
          this.$data.formSending = false;
          this.$data.dialog.isShow = false;
        };

        let error = () => {
          this.$data.formSending = false;
        };

        this.itemScopePromotionAdd({
          item: { province_code, promotion_type, topic, time_start, time_end, rules },
          success: success,
          error: error
        });
      },
      handleClose() {
        this.$data.dialog.isShow = false;
      },
      // 上线活动
      handleStart(id) {
        let callback = () => {
          this.itemScopePromotionQuery();
        };
        this.itemScopePromotionStart({promotion_id: id, callback: callback});
      },
      // 结束活动
      handleEnd(id) {
        let callback = () => {
          this.itemScopePromotionQuery();
        };
        this.itemScopePromotionHalt({promotion_id: id, callback: callback});
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
