<template>
  <div>
    <query-marketing-scope-promotion
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
      @expandChange="onExpandChange"
    >
    </query-marketing-scope-promotion>
    <div class="operate" v-if="auth.isAdmin || auth.MarketingScopePromotionAdd">
      <el-button
        v-if="auth.isAdmin || auth.MarketingScopePromotionAdd"
        type="primary"
        size="mini"
        @click="handleAddItem"
      >
        新增
      </el-button>
    </div>
    <table-marketing-scope-promotion
      :data="listItem.items"
      :page="query.page"
      :pageSize="query.page_size"
      :start="handleStart"
      :end="handleEnd"
      :offset-height="offsetHeight"
    >
    </table-marketing-scope-promotion>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="listItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
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
  </div>

</template>

<script>
  /**
   * 促销活动列表
   */

  import { mapGetters, mapActions } from 'vuex';
  import { Pagination, Button, Dialog } from 'element-ui';
  import { QueryMarketingScopePromotion, TableMarketingScopePromotion, FormMarketingScopePromotion } from '@/container';
  import CouponList from './CouponList';
  import { Constant, DataHandle } from '@/util';

  export default {
    name: "ScopePromotionList",
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-marketing-scope-promotion': QueryMarketingScopePromotion,
      'table-marketing-scope-promotion': TableMarketingScopePromotion,
      'form-marketing-scope-promotion': FormMarketingScopePromotion
    },
    data() {
      return {
        query: {}, //查询条件
        item: {}, // 需要添加的活动对象
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
        formSending: false,
        dialog: {
          isShow: false
        }
      }
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        listItem: 'itemScopePromotionListItem'
      })
    },
    created() {
      documentTitle('营销 - 全场营销');
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.itemScopePromotionQuery({ query: this.$data.query });

      if (!this.auth.isAdmin && !this.auth.MarketingScopePromotionAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    methods: {
      ...mapActions(['itemScopePromotionQuery', 'itemScopePromotionAdd', 'itemScopePromotionStart', 'itemScopePromotionHalt']),

      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
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
        this.itemScopePromotionQuery({ query: this.$data.query });
      },
      resetQuery() {
        this.initQuery();
        this.itemScopePromotionQuery({ query: this.$data.query });
      },

      changePage(page) {
        this.$data.query.page = page;
        this.itemScopePromotionQuery({query: this.$data.query});
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.itemScopePromotionQuery({query: this.$data.query});
      },
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
      },
      handleAddItem() {
        // 为需要编辑的活动对象进行初始化设置
        this.$data.item = Object.assign({}, this.$data.item, {
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
          this.itemScopePromotionQuery({ query: this.$data.query });
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
          this.itemScopePromotionQuery({ query: this.$data.query });
        };
        this.itemScopePromotionStart({promotion_id: id, callback: callback});
      },
      // 结束活动
      handleEnd(id) {
        let callback = () => {
          this.itemScopePromotionQuery({ query: this.$data.query });
        };
        this.itemScopePromotionHalt({promotion_id: id, callback: callback});
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
