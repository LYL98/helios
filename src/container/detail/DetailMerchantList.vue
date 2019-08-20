<template>
  <div class="detail">
    <el-table :data="tableData" :row-class-name="highlightRowClassName">
      <el-table-column label="商户名称" prop="title">
        <template slot-scope="scope">
          <my-omission-text :content="scope.row.title" :maxlength="16"></my-omission-text>
        </template>
      </el-table-column>
      <el-table-column label="协议商户" width="80" prop="is_post_pay">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.is_post_pay ? 'regular' : 'info'"
            disable-transitions
          >
            {{ scope.row.is_post_pay ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="授信额度" prop="credit_limit" v-if="merchantDetail.is_post_pay">
        <template slot-scope="scope">
          <my-to-price :amount="scope.row.credit_limit"></my-to-price>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="账户余额" prop="balance">
        <template slot-scope="scope">
          <my-to-price :amount="scope.row.balance"></my-to-price>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="商户等级">
        <template slot-scope="scope">
          <my-omission-text
            v-if="merchantDetail.grade_code && merchantDetail.grade.title"
            :content="merchantDetail.grade.title"
            :maxlength="10"
          />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column width="140" align="left" label="内标签">
        <template slot-scope="scope">
          <ul style="display: flex; flex-direction: column; justify-content: center;">
            <li v-for="tag in scope.row.inner_tags" :key="tag + '-' + scope.row.id">
              <el-tag disable-transitions size="mini" type="primary">{{ tag }}</el-tag>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column width="160" align="left" label="外标签">
        <template slot-scope="scope">
          <ul style="display: flex; flex-direction: column; align-items: flex-start;">
            <li v-for="tag in scope.row.outer_tags" :key="tag + '-' + scope.row.id">
              <el-tag disable-transitions size="mini" type="primary">{{ tag }}</el-tag>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column width="110" align="left" label="创建时间" prop="created">
        <template slot-scope="scope">
          <div>{{returnDate(scope.row.created)}}</div>
          <div>{{returnTime(scope.row.created)}}</div>
        </template>
      </el-table-column>
      <el-table-column width="110" align="left" label="更新时间" prop="updated">
        <template slot-scope="scope">
          <div>{{returnDate(scope.row.updated)}}</div>
          <div>{{returnTime(scope.row.updated)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <my-table-operate
            :list="[
              {
                title: '修改商户信息',
                isDisplay: auth.isAdmin || auth.MerchantEdit,
                command: () => editMerchantDetail()
              },
              {
                title: '修改等级标签',
                isDisplay: auth.isAdmin || auth.MerchantGradeTags,
                command: () => showTag()
              }
            ]"
          />
        </template>
      </el-table-column>
    </el-table>

    <div style="position: relative; height: 0; top: 52px;right: 10px; z-index: 100;">
      <el-button v-if="activeTab === 'store' && (auth.isAdmin || auth.MerchantStoreAdd)"
                 style="float: right;"
                 @click="addStore"
                 type="primary"
                 size="small">新增门店</el-button>
      <el-button v-if="activeTab === 'member' && (auth.isAdmin || auth.MerchantMemberAdd)"
                 style="float: right;"
                 @click="addMember"
                 type="primary"
                 size="small">新增用户</el-button>
    </div>

    <el-tabs v-model="activeTab" class="edit-card" @tab-click="handleTabClick">
      <el-tab-pane label="门店管理" v-if="auth.isAdmin || auth.MerchantStoreEdit || auth.MerchantStoreList" name="store">
        <merchant-store :merchant_id="merchant_id" :storeQuery="storeQuery" :updateCount="updateCount"></merchant-store>
      </el-tab-pane>
      <el-tab-pane label="用户管理" :lazy="true" v-if="auth.isAdmin || auth.MerchantMemberList" name="member">
        <merchant-member :merchant_id="merchant_id" :updateCount="updateCount"></merchant-member>
      </el-tab-pane>
    </el-tabs>
    
    <el-dialog title="修改等级、标签" :visible.sync="isShowTag" width="680px" append-to-body :close-on-click-modal="false">
      <merchant-tags-edit
        :merchantDetail="merchantDetail"
        :affirmTag="affirmTag"
        :cancelTag="cancelTag"
      >
      </merchant-tags-edit>
    </el-dialog>

    <el-dialog 
      title="修改商户信息" 
      :visible.sync="editMerchantDialogVisible" 
      v-if="editMerchantDialogVisible" 
      width="640px" 
      append-to-body 
      :close-on-click-modal="false"
    >
      <merchant-edit
        :merchantDetail="merchantDetail"
        :editMerchantSuccess="editMerchantSuccess"
        :editMerchantCancel="editMerchantCancel"
      >
      </merchant-edit>
    </el-dialog>

    <el-dialog title="充值 / 扣款" :visible.sync="isShowBalanceEdit" v-if="isShowBalanceEdit" width="640px" append-to-body>
      <merchant-balance-edit
        :merchant_title="merchantDetail.title"
        :cancelBalanceEdit="cancelBalanceEdit"
        :confirmBalanceEdit="confirmBalanceEdit"
      >
      </merchant-balance-edit>
    </el-dialog>

    <el-dialog title="新增门店" :close-on-click-modal="false" :visible.sync="editStoreDialogVisible" v-if="editStoreDialogVisible" width="640px" append-to-body>
      <store-add-edit
        :isEditStore="isEditStore"
        :merchant_id="merchant_id"
        :store_id="store_id"
        :editStoreSuccess="editStoreSuccess"
        :editStoreCancel="editStoreCancel"
      >
      </store-add-edit>
    </el-dialog>

    <el-dialog title="新增用户" :close-on-click-modal="false" :visible.sync="addMemberDialogVisible" v-if="addMemberDialogVisible" width="640px" append-to-body>
      <member-add-edit
        :merchant_id="merchant_id"
        :editMemberSuccess="editMemberSuccess"
        :editMemberCancel="editMemberCancel"
      >
      </member-add-edit>
    </el-dialog>

  </div>
</template>

<script>
  import detailMixin from './detail.mixin';
  import {TableOperate, ToPrice, OmissionText} from '@/common';
  import TagsEdit from '@/view/merchant/TagsEdit';
  import MerchantStore from '@/view/merchant/Store';
  import MerchantMember from '@/view/merchant/Member';
  import MerchantEdit from '@/view/merchant/Edit';
  import MemberAddEdit from '@/view/merchant/MemberAddEdit';
  import StoreAddEdit from '@/view/merchant/StoreAddEdit';
  import { Http, Config, DataHandle } from '@/util';

  export default {
    mixins: [detailMixin],
    components: {
      'merchant-tags-edit': TagsEdit,
      'merchant-edit': MerchantEdit,
      'merchant-store': MerchantStore,
      'merchant-member': MerchantMember,
      'member-add-edit': MemberAddEdit,
      'store-add-edit': StoreAddEdit,
      'my-table-operate': TableOperate,
      'my-to-price': ToPrice,
      'my-omission-text': OmissionText
    },
    created() {
      this.getMerchantDetail();
    },
    props: {
      storeQuery: Function,
      merchant_id: { type: Number | String, default: '' },
    },
    computed: {
      tableData() {
        return [ { merchant_id: this.merchant_id, ...this.merchantDetail } ]
      }
    },
    data: () => ({
      tencentPath: Config.tencentPath,
      merchantDetail: {
        inner_tags: [],
        outer_tags: []
      },
      isShowTag: false,
      isShowBalanceEdit: false,
      storeEditDailog: {
        isShow: false,
        store_id: ''
      },
      isEditStore: false,
      store_id: '',
      editMerchantDialogVisible: false,
      editStoreDialogVisible: false,
      addMemberDialogVisible: false,
      // 更新统计。用于父组件的更新监听
      updateCount: 0,
      activeTab: 'store'
    }),
    methods: {

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },

      handleTabClick(tab, event) {
        this.activeTab = tab.name
      },

      returnPrice(value) {
        return DataHandle.returnPrice(value);
      },

      returnDateFormat(dateStr) {
        return DataHandle.returnDateFormat(dateStr, 'yyyy-MM-dd');
      },

      returnDate(dateStr) {
        return DataHandle.returnDateFormat(dateStr, 'yyyy-MM-dd')
      },
      returnTime(dateStr) {
        return DataHandle.returnDateFormat(dateStr, 'HH:mm:ss')
      },

      /**
       * 获取商户的详情，在 组件加载时、编辑门店信息后、编辑用户信息后 调用
       */
      async getMerchantDetail() {
        let { merchant_id } = this;
        let res = await Http.get(Config.api.merchantDetail, {
          id: merchant_id
        });
        if (res.code === 0) {
          this.$data.merchantDetail = res.data;
        } else {
          this.$message({message: res.message, type: 'error'});
        }
      },

      /**
       * 修改等级标签
       */
      showTag() {
        this.isShowTag = true;
      },
      cancelTag() {
        this.isShowTag = false;
      },
      affirmTag() {
        let that = this;
        this.isShowTag = false;
        that.getMerchantDetail();
      },

      /**
       * 充值/扣款
       */
      balanceEdit() {
        this.isShowBalanceEdit = true;
      },
      cancelBalanceEdit() {
        this.isShowBalanceEdit = false;
      },
      confirmBalanceEdit(data) {
        this.isShowBalanceEdit = false;
        this.updateCount++;
        this.merchantDetail.balance = data.balance; // 设置当前商户的余额显示
      },

      /**
       * 修改商户详情
       */
      editMerchantDetail() {
        this.editMerchantDialogVisible = true;
      },
      editMerchantCancel() {
        this.editMerchantDialogVisible = false;
      },
      editMerchantSuccess() {
        this.editMerchantDialogVisible = false;
        this.getMerchantDetail();
        this.$forceUpdate();
      },

      /**
       * 新增 / 编辑 门店
       */
      addStore() {
        this.isEditStore = false;
        this.editStoreDialogVisible = true;
      },
      // 编辑门店完成
      editStoreSuccess() {
        this.store_id = '';
        this.editStoreDialogVisible = false;
        this.updateCount++;
        this.getMerchantDetail();
        this.storeQuery();
      },
      // 退出编辑门店
      editStoreCancel() {
        this.store_id = '';
        this.editStoreDialogVisible = false;
      },

      /**
       * 新增用户
       */
      addMember() {
        this.addMemberDialogVisible = true;
      },
      editMemberCancel() {
        this.addMemberDialogVisible = false;
      },
      editMemberSuccess() {
        this.updateCount++;
        this.addMemberDialogVisible = false;
        this.getMerchantDetail();
      },

      //返回
      backPage() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    margin-top: -15px;
    padding: 0 20px 10px;
  }
  .lightgrey{
    background: #13ce66;
  }
  .edit-card {
    width: 100%;
    margin-top: 50px;
    .el-tabs__header {
      margin-bottom: 0px !important;
    }
  }

  .el-tab-pane {
    background: #FFFFFF;

  }
</style>
