<template>
  <div>
    <div @mousemove="handleTableMouseMove">
      <el-table
        :data="dataItem"
        style="width: 100%;"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column label="门店名称" prop="title">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="县域" width="100" prop="city.title">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city && scope.row.city.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货人" width="100" prop="linkman">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.linkman }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="120" prop="phone">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" width="160" prop="address">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店标签" width="120">
          <template slot-scope="scope">
            <ul style="display: flex; flex-direction: column; justify-content: center;">
              <li v-for="(tag, i) in scope.row.tags" :key="i">
                <el-tag disable-transitions size="mini" type="primary" style="white-space: pre-wrap; height: auto;">{{ tag.title }}</el-tag>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" prop="is_audited">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.is_audited ? 'regular' : 'info'"
              disable-transitions>{{scope.row.is_audited ? '已审核' : '未审核'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否冻结" width="100" prop="is_audited">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.is_freeze ? 'info' : 'regular'"
              disable-transitions>{{scope.row.is_freeze ? '已冻结' : '未冻结'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '审核通过',
                isDisplay: (auth.isAdmin || auth.MerchantStoreApprove) && !scope.row.is_audited,
                command: () => affirmApprove(scope.row)
              },
              {
                title: '冻结',
                isDisplay: (auth.isAdmin || auth.MerchantStoreFreeze) && !scope.row.is_freeze,
                command: () => affirmStoreFreeze(scope.row)
              },
              {
                title: '解冻',
                isDisplay: (auth.isAdmin || auth.MerchantStoreUnFreeze) && scope.row.is_freeze,
                command: () => affirmStoreUnFreeze(scope.row)
              },
              {
                title: '修改详情',
                isDisplay: auth.isAdmin || auth.MerchantStoreEdit,
                command: () => editStore(scope.row)
              },
              {
                title: '修改标签',
                isDisplay: auth.isAdmin || auth.MerchantStoreEditTag,
                command: () => editStoreTag(scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.MerchantStoreDelete,
                command: () => deleteStore(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="编辑门店"
      :close-on-click-modal="false"
      width="1000px"
      :visible.sync="dialog.visible"
      v-if="dialog.visible"
      append-to-body
      :before-close="editStoreCancel"
    >
      <merchant-edit
        module="store"
        :type="dialog.type"
        :merchant_id="query.merchant_id"
        :item="dialog.item"
        @submit="editStoreSuccess"
        @cancel="editStoreCancel"
      >
      </merchant-edit>
    </el-dialog>

    <el-dialog
      title="编辑标签"
      :close-on-click-modal="false"
      width="680px"
      :visible.sync="dialogTag.visible"
      v-if="dialogTag.visible"
      append-to-body
      :before-close="editStoreCancel"
    >
      <merchant-edit-tag
        :item="dialogTag.item"
        :affirmTag="editStoreSuccess"
        :cancelTag="editStoreCancel"
      >
      </merchant-edit-tag>
    </el-dialog>

  </div>
</template>

<script>
  import { Table, TableColumn, MessageBox, Message, Button, Tag, Dialog, Pagination, Form, FormItem, Input, Select} from 'element-ui';
  import {TableOperate, OmissionText, SelectProvince} from '@/common';
  import {Http, Config, Constant, DataHandle, Method} from '@/util';
  import MerchantEdit from './merchant-edit';
  import MerchantEditTag from './merchant-detail-store-tags-edit';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "MerchantAdd",
    components: {
      'mt-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-tag': Tag,
      'el-dialog': Dialog,
      'el-pagination': Pagination,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-select': Select,
      'my-select-province': SelectProvince,
      'merchant-edit': MerchantEdit,
      'merchant-edit-tag': MerchantEditTag,
      'my-table-operate': TableOperate,
      'my-omission-text': OmissionText
    },
    mixins: [tableMixin],
    created() {
      let that = this;
      let {query} = that;  // 从组建获取query对象
      query.merchant_id = that.merchant_id; // 将 路由的商户id 设置为 组件的商户 id
      that.$data.query = query;
      that.storeList();//获取门店列表
    },
    props: {
      merchant_id: {type: Number | String, default: ''},
      updateCount: Number,
      storeQuery: Function
    },
    data() {
      return {
        tencentPath: Config.tencentPath,
        query: {
          merchant_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        dataItem: [],

        store_id: '',
        isEditStore: false,
        editDialogVisible: false,

        currentRow: {},

        dialog: {
          visible: false,
          type: 'add',
          item: {},
        },

        dialogTag: {
          visible: false,
          item: {},
        },

      }
    },
    watch: {
      updateCount: 'storeList'
    },
    methods: {
      //刷新
      refresh() {
        let {query} = this;
        query.page = 1;
        query.is_audited = '';
        query.province_code = '';
        this.$data.query = query;
        this.storeList();
      },
      //区域改变
      changeProvince() {
        //this.$data.addData.sales_man = '';
      },
      //翻页
      changePage(page) {
        console.log('page', page);
        this.$data.query.page = page;
        this.storeList();
      },
      //门店列表
      async storeList() {

        let that = this;
        let {query, merchant_id} = that;
        let res = await Http.get(Config.api.storeList, {merchant_id: merchant_id});
        if (res.code === 0) {
          that.$data.dataItem = res.data;
          window.scrollTo(0, 0);
        } else {
          Message.warning(res.message);
        }
      },
      //确认审核
      affirmApprove(data) {
        MessageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeApprove(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      //门店审核
      async storeApprove(data) {
        let that = this;
        let res = await Http.post(Config.api.storeApprove, {
          id: data.id
        });
        if (res.code === 0) {
          Message.success('审核通过！');
          that.storeQuery();
          that.storeList();
        } else {
          Message.warning(res.message);
        }
      },
      // 开始编辑门店
      async editStore(item) {
        let res = await Http.get(Config.api.storeDetail, {id: item.id});
        if (res.code === 0) {
          let rd = res.data;
          if (!rd.geo || Object.keys(rd.geo).length < 5) {
            rd.geo = {lng: '', lat: '', province_title: '', city_title: '', poi: ''};
          }
          rd.csm_id = rd.csm_id || '';
          this.$data.dialog = {
            visible: true,
            type: 'modify',
            item: rd,
          };
        } else {
          Message.warning(res.message);
        }

      },
      // 编辑门店完成
      editStoreSuccess() {
        this.editStoreCancel();
        this.refresh();
        this.storeQuery();
      },
      // 退出编辑门店
      editStoreCancel() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: {},
        };
        this.$data.dialogTag = {
          visible: false,
          item: {},
        };
      },

      //编辑标签
      editStoreTag(data){
        this.$data.dialogTag = {
          visible: true,
          item: this.copyJson(data),
        };
      },

      //确认删除门店
      deleteStore(data) {

        MessageBox.confirm('确定删除门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeDelete(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      //删除门店
      async storeDelete(data) {
        let that = this;
        let res = await Http.get(Config.api.storeDelete, {
          id: data.id
        });
        if (res.code === 0) {
          Message.success('门店已删除！');
          that.storeList();
          that.storeQuery();
        } else {
          Message.warning(res.message);
        }
      },
      //确认冻结
      affirmStoreFreeze(data) {

        MessageBox.confirm('确认冻结门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      //冻结
      async storeFreeze(data) {
        let that = this;
        let res = await Http.post(Config.api.storeFreeze, {
          id: data.id
        });
        if (res.code === 0) {
          that.storeList();
          that.storeQuery();
          Message.success('门店已经冻结！');
        } else {
          Message.warning(res.message);
        }
      },
      //确认解冻
      affirmStoreUnFreeze(data) {

        MessageBox.confirm('确认解冻门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeUnFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      //解冻
      async storeUnFreeze(data) {
        let that = this;
        let res = await Http.post(Config.api.storeUnFreeze, {
          id: data.id
        });
        if (res.code === 0) {
          that.storeList();
          that.storeQuery();
          Message.success('门店已经解冻！');
        } else {
          Message.warning(res.message);
        }
      },

    }
  };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .el-upload__tip {
    margin-left: 20px;
  }

  .level, .label {
    padding: 12px 0 2px;
    span {
      display: inline-block;
      padding: 2px 5px;
      margin: 0 5px 10px;
      border: 1px solid #999;
      border-radius: 3px;
    }
  }
</style>
