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
        <el-table-column label="所在仓" width="100" prop="city.title">
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
        <el-table-column label="创建日期" width="120" prop="created">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{returnDate(scope.row.created)}}</div>
            <div v-if="scope.row.id === currentRow.id">{{returnTime(scope.row.created)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" prop="is_approve">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.is_approve ? 'regular' : 'info'"
              disable-transitions>{{scope.row.is_approve ? '已审核' : '未审核'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否冻结" width="100" prop="is_approve">
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
                isDisplay: (auth.isAdmin || auth.MerchantStoreApprove) && !scope.row.is_approve,
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
                title: '修改所在仓',
                isDisplay: auth.isAdmin || auth.MerchantStoreEditCity,
                command: () => editCity(scope.row)
              },
              {
                title: '修改详情',
                isDisplay: auth.isAdmin || auth.MerchantStoreEdit,
                command: () => editStore(scope.row)
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

    <!-- 分页标签 -->
    <div class="table-bottom" v-if="dataItem.num > 0">
      <div class="table-pagination">
        <el-pagination background layout="total, prev, pager, next"
                       @current-change="changePage"
                       :total="dataItem.num" :page-size="query.page_size" :current-page="query.page"/>
      </div>
    </div>

    <!--<div v-else class="load-none">暂无数据</div>-->

    <el-dialog title="编辑门店" :close-on-click-modal="false" width="640px" :visible.sync="editDialogVisible" v-if="editDialogVisible" append-to-body>
      <store-add-edit
        :isEditStore="isEditStore"
        :merchant_id="query.merchant_id"
        :store_id="store_id"
        :editStoreSuccess="editStoreSuccess"
        :editStoreCancel="editStoreCancel"
      >
      </store-add-edit>
    </el-dialog>

    <el-dialog title="修改所在仓" :close-on-click-modal="false" width="640px" :visible.sync="editCityVisible" v-if="editCityVisible" append-to-body>
      <store-edit-city :store_id="store_id" :editCitySuccess="editCitySuccess" :editCityCancel="editCityCancel"></store-edit-city>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import { Table, TableColumn, MessageBox, Message, Button, Tag, Dialog, Pagination, Form, FormItem, Input, Select} from 'element-ui';
  import {TableOperate, OmissionText, SelectProvince} from '@/common';
  import {Http, Config, Constant, DataHandle, Method} from '@/util';
  import StoreAddEdit from './StoreAddEdit';
  import StoreEditCity from './StoreEditCity';
  import tableMixin from '@/container/table/table.mixin';

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
      'store-add-edit': StoreAddEdit,
      'store-edit-city': StoreEditCity,
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
      // merchant_id: [String, Number],
      updateCount: Number,
      storeQuery: Function
    },
    data() {
      return {
        merchant_id: '',
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
        editCityVisible: false,
        currentRow: {}
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
        query.is_approve = '';
        query.province_code = '';
        this.$data.query = query;
        this.storeList();
      },
      //省份改变
      changeProvince() {
        //this.$data.addData.sales_man = '';
      },
      //翻页
      changePage(type) {
        let {query} = this;
        type === 'next' ? query.page++ : query.page--;
        this.$data.query = query;
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
      // 开始新增门店
      addStore() {
        this.isEditStore = false;
        this.editDialogVisible = true;
      },
      // 开始编辑门店
      editStore(item) {
        this.isEditStore = true;
        this.store_id = item.id;
        this.editDialogVisible = true;
        // 要修改哪个门店？设置需要修改的门店 id
      },
      // 编辑门店完成
      editStoreSuccess() {
        this.store_id = '';
        this.editDialogVisible = false;
        this.refresh();
        this.storeQuery();
      },
      // 退出编辑门店
      editStoreCancel() {
        this.store_id = '';
        this.editDialogVisible = false;
      },

      // 编辑门店所在仓
      editCity(item) {
        this.store_id = item.id;
        this.editCityVisible = true;
      },
      // 编辑门店所在仓
      editCitySuccess() {
        this.store_id = '';
        this.editCityVisible = false;
        this.refresh();
        this.storeQuery();
      },
      // 退出编辑门店所在仓
      editCityCancel() {
        this.store_id = '';
        this.editCityVisible = false;
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
      /**
       * 翻页 的 按钮事件
       * 1、设置组件中 query.page的值
       * 2、调用merchantList 重新加载商户列表信息
       */
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.storeList();
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
