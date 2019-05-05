<template>
  <div>
    <query-purchase-supplier
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"
    />
    <div class="operate" v-if="auth.isAdmin || auth.PurchaseSupplierExport || auth.PurchaseSupplierAdd">
      <el-button
        v-if="auth.isAdmin || auth.PurchaseSupplierExport"
        @click.native="() => {supplierListExport();}"
        size="mini"
        type="primary"
        plain
      >导出供应商列表</el-button>
      <el-button
        v-if="auth.isAdmin || auth.PurchaseSupplierAdd"
        type="primary"
        size="mini"
        @click="handleAddItem"
      >
        新增
      </el-button>
    </div>
    <table-purchase-supplier
      :data="listItem.items"
      :modifyItem="handleModifyItem"
      :page="query.page"
      :pageSize="query.page_size"
      :offsetHeight="offsetHeight"
    />
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
      :visible.sync="dialog.isShowEditSupplier"
      width="700px"
      :title="dialog.isModify ? '修改供应商' : '新增供应商'"
      :close-on-click-modal="false"
    >
      <form-purchase-supplier
        v-model="item"
        v-if="dialog.isShowEditSupplier"
        :isModify="dialog.isModify"
        :submit="handleSubmit"
        :close="handleClose"
        :sending="formSending"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {Button, Pagination, Dialog} from 'element-ui';
  import {QueryPurchaseSupplier, TablePurchaseSupplier, FormPurchaseSupplier} from '@/container';

  import { Config, Constant} from '@/util';

  export default {
    name: "SupplierList",
    components: {
      'el-button': Button,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'query-purchase-supplier': QueryPurchaseSupplier,
      'table-purchase-supplier': TablePurchaseSupplier,
      'form-purchase-supplier': FormPurchaseSupplier
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        listItem: 'pruchaseSupplierListItem'
      }),
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION + Constant.OFFSET_OPERATE,
        // 查询条件
        query: {},
        // 正在编辑的项
        item: {},
        formSending: false,
        dialog: {
          isShowEditSupplier: false,
          isModify: false
        }
      }
    },
    created() {
      documentTitle('采购 - 供应商管理');
      this.initQuery();
      // 页面创建后，发送请求查询供应商列表
      this.pruchaseSupplierQuery({query: this.$data.query});

      if (!this.auth.isAdmin && !this.auth.PurchaseSupplierExport && !this.auth.PurchaseSupplierAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
    },
    methods: {
      ...mapActions(['pruchaseSupplierQuery', 'pruchaseSupplierAdd', 'pruchaseSupplierModify']),

      /**
       * 1、查询
       * 2、新增
       * 3、修改
       * 4、审核
       * 5、冻结
       * 6、解冻
       */

      // 初始化查询对象
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          is_check: '',
          is_freeze: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        })
      },

      // 根据搜索条件查询供应商列表
      changeQuery(v) {
        this.pruchaseSupplierQuery({query: this.$data.query});
      },
      // 重置查询条件
      resetQuery() {
        this.initQuery();
        this.pruchaseSupplierQuery({query: this.$data.query});
      },

      changePage(page) {
        this.$data.query.page = page;
        this.pruchaseSupplierQuery({query: this.$data.query});
      },

      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.pruchaseSupplierQuery({query: this.$data.query});
      },
      //供应商列表导出
      supplierListExport() {
        let queryStr = Config.api.purchaseSupplierExport;
        let {condition, is_check, is_freeze} = this.query;
        let query = {
          is_check,
          is_freeze,
          condition,
        };
        queryStr += `?province_code=${this.province.code}`;
        for (let item in query) {
          queryStr += `&${item}=${query[item]}`
        }
        window.open(queryStr);
      },
      // 新增供应商
      handleAddItem() {
        this.$data.item = Object.assign({}, this.$data.item, {
          code: '',
          name: '',
          supplier_code: '',
          contact: '',
          phone: '',
          bank_name: '',
          bank_account_owner: '',
          bank_account: '',
          pay_type: 'cash',
        });
        this.dialog.isShowEditSupplier = true;
        this.dialog.isModify = false;
      },
      // 修改供应商
      handleModifyItem(item) {
        // 获取到需要修改项的值，再打开编辑的表单
        this.$data.item = Object.assign({}, this.$data.item, item);
        this.dialog.isShowEditSupplier = true;
        this.dialog.isModify = true;
      },
      // 提交供应商编辑的表单
      handleSubmit() {
        this.$data.formSending = true;
        let success = () => {
          this.pruchaseSupplierQuery({query: this.$data.query});
          this.$data.formSending = false;
          this.dialog.isShowEditSupplier = false;
        };
        let error = () => {
          this.$data.formSending = false;
        };
        let item = this.$data.item;
        item.province_code = this.province.code;

        this.$data.dialog.isModify
          ? this.pruchaseSupplierModify({item: item, success: success, error: error})
          : this.pruchaseSupplierAdd({item: item, success: success, error: error});
      },
      // 关闭供应商编辑表单的弹窗
      handleClose() {
        this.dialog.isShowEditSupplier = false;
      }
    }
  }
</script>

<style scoped>
</style>
