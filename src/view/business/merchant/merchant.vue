<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province v-model="query.province_code" type="select" @change="selectProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="县域">
            <my-select-city
              :disabled="!query.province_code"
              size="small"
              showAll
              clearable
              v-model="query.city_id"
              :provinceCode="query.province_code"
              @change="changeQuery"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="门店名称/用户名称/电话"
              v-model="query.condition"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="审核状态">
            <select-option
              :options="{'全部': '', '待审核': 0, '已审核': 1}"
              v-model="query.is_audited"
              @change="changeQuery"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="冻结状态">
            <select-option
              :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
              v-model="query.is_freeze"
              @change="changeQuery"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="团购门店">
            <select-option
              :options="{'全部': '', '非团购': 0, '团购': 1}"
              v-model="query.gb_included"
              @change="changeQuery"
              size="small"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="创建时间">
            <el-date-picker
              size="small"
              v-model="query.pickerValue"
              style="width: 100%;"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              unlink-panels
              :picker-options="fixDateOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changePicker"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="query.is_post_pay" @change="changeQuery" :tab-panes="{'全部': '', '协议': '1', '非协议': '0'}"/>
        </div>
        <div class="right" v-if="auth.isAdmin || auth.MerchantExport || auth.MerchantAdd">
          <el-button v-if="auth.isAdmin || auth.MerchantExport" @click.native="merchantListExport" size="mini" type="primary" plain >导出商户列表</el-button>
          <el-button v-if="auth.isAdmin || auth.MerchantAdd" @click="handleAddItem" size="mini" type="primary">新增</el-button>
        </div>
      </div>
      <!-- 头部end -->

      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="dataItem.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <!-- 表格宽度： 860 / 830（带全选） -->
          <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (page - 1) * query.page_size <= 999950 ? 68 : 88" label="序号" :index="indexMethod">
          </el-table-column>
          <el-table-column label="门店名称" min-width="150" prop="title">
            <template slot-scope="scope">
          <span v-if="auth.isAdmin || auth.MerchantAuditDetail">
            <a class="title" href="javascript:void(0);" @click.prevent="showMerchantDetail(scope.row)">
              {{ scope.row.title }}
            </a>
          </span>
              <span v-else>
            {{ scope.row.title }}
          </span>
            </template>
          </el-table-column>
          <el-table-column label="商户名称" min-width="120">

            <template slot-scope="scope">
              <span>
                {{ scope.row.merchant && scope.row.merchant.title || '-' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="协议商户" min-width="80">
            <template slot-scope="scope">
              <el-tag disable-transitions :type="scope.row.merchant && scope.row.merchant.is_post_pay ? 'regular' : 'info'" size="small"
              >{{scope.row.merchant && scope.row.merchant.is_post_pay ? '是' : '否'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="县域" min-width="80" prop="city.title">
            <template slot-scope="scope">
              <div>
                {{ scope.row.city && scope.row.city.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" min-width="80">
            <template slot-scope="scope">
              <el-tag disable-transitions :type="scope.row.is_audited ? 'regular' : 'info'" size="small"
              >{{scope.row.is_audited ? '已审核' : '未审核'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="冻结状态" min-width="80">
            <template slot-scope="scope">
              <el-tag disable-transitions :type="scope.row.is_freeze ? 'regular' : 'info'" size="small"
              >{{scope.row.is_freeze ? '已冻结' : '未冻结'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
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

<!--    <el-dialog title="商户详情" width="1200px" :visible.sync="detail.visible" append-to-body>-->
<!--      <merchant-detail :storeQuery="storeQuery" v-if="detail.visible" :merchant_id="detail.merchant_id" />-->
<!--    </el-dialog>-->

    <add-edit-layout
      title="商户详情"
      :is-show="detail.visible"
      :before-close="handleCancel"
    >
      <merchant-detail :storeQuery="storeQuery" v-if="detail.visible" :merchant_id="detail.merchant_id" />
    </add-edit-layout>

    <add-edit-layout
      title="新增商户"
      :is-show="dialog.visible"
      :before-close="handleCancel"
    >
      <merchant-edit
        module="merchant"
        :type="dialog.type"
        v-if="dialog.visible"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import { MessageBox, Message, Row, Col, Form, FormItem, Button, Input, Select, Option, Dialog, Tag, Pagination, DatePicker } from 'element-ui';

  import {SelectOption, QueryItem, QuerySearchInput, TableOperate} from '@/common';
  import { GlobalProvince, SelectCity } from '@/component';
  import tableMixin from '@/share/mixin/table.mixin';

  import MerchantEdit from './merchant-edit';
  import MerchantDetail from './merchant-detail';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryTabs from '@/share/layout/QueryTabs';
  import AddEditLayout from '@/share/layout/Layout';
  import { Config, Constant, DataHandle, Method, Http } from '@/util';

  export default {
    name: "Merchant",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'el-date-picker': DatePicker,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'my-select-city': SelectCity,
      'global-province': GlobalProvince,
      'query-search-input': QuerySearchInput,
      'query-tabs': queryTabs,
      'add-edit-layout': AddEditLayout,
      'merchant-edit': MerchantEdit,
      'merchant-detail': MerchantDetail,
      'my-table-operate': TableOperate,
    },
    mixins: [mainMixin, tableMixin],
    created() {
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      documentTitle('业务 - 门店');
      this.initQuery();
    },
    data() {
      return {

        auth: this.$auth,
        tencentPath: Config.tencentPath,
        query: {  },

        dataItem: {
          items: [],
          num: 0
        },

        dialog: {
          visible: false,
          type: 'add',
          item: {},
        },

        detail: {
          visible: false,
          merchant_id: 0
        },
      }
    },
    methods: {
      //刷新
      initQuery() {
        this.$data.query = {
          is_audited: '',
          is_freeze: '',
          is_post_pay: '',
          gb_included: '',
          province_code: '',
          city_id: '',
          condition: '',
          pickerValue: null,
          begin_date: '',
          end_date: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
      },

      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.storeQuery();
      },

      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.storeQuery();
      },

      //查询选择区域后
      selectProvince(data, type) {
        this.$data.query.city_id = '';
        if(type === 'init'){
          this.$data.query.province_code = data.code;
        }
        this.changeQuery();
      },
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.changeQuery();
      },

      changeQuery() {
        window.scrollTo(0, 0);
        this.query.page = 1;
        this.storeQuery();
      },

      resetQuery() {
        window.scrollTo(0, 0);
        this.initQuery();
        this.storeQuery();
      },

      handleAddItem() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          item: {}
        }
      },

      handleSubmit() {
        this.handleCancel();
        this.storeQuery();
      },

      handleCancel() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: {}
        };
        this.$data.detail = {
          visible: false,
          merchant_id: 0
        };
      },

      //商户列表导出
      async merchantListExport() {
        let api = Config.api.merchantExport;
        let {is_audited, is_freeze, is_post_pay, gb_included, city_id, condition, begin_date, end_date} = this.query;
        let query = {
          is_audited,
          is_freeze,
          is_post_pay,
          gb_included,
          city_id,
          condition,
          begin_date,
          end_date
        };
        if (!begin_date || !end_date) {
          query.begin_date = '';
          query.end_date = '';
        }
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.$data.query.province_code,
          ...query
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.query.province_code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },

      /**
       * 获取商户列表信息：
       * 1、请求API
       * 2、将获取的data数据，赋值给组件的dataItem
       */
      async storeQuery() {
        let query = {...this.$data.query};
        delete query.picker_value;
        // get merchant list data
        let res = await Http.get(Config.api.storeQuery, query);
        // 如果返回结果正确，则将该数据 赋值给 dataItem；
        if (res.code === 0) {
          this.$data.dataItem = res.data;
          window.scrollTo(0, 0);
        } else { // 如果返回值不正确，则提示弹窗
          Message.warning(res.message);
        }
      },

      //确认审核
      affirmApprove(item) {
        this.$messageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeApprove(item);
        }).catch(() => {
          // console.log('取消');
        });

      },

      //商户审核
      async storeApprove(item) {
        let res = await Http.post(Config.api.storeApprove, {id: item.id});
        if (res.code === 0) {
          this.$message({ message: '商户审核通过！', type: 'success' });
          item.is_audited = true;
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      },

      /**
       * 点击 【冻结】 按钮的 响应事件，该事件接受一个参数 item，以确认 运营人员目前需要冻结哪个商户？
       * 1、弹窗提醒用户是否需要冻结
       * 2、点击确认后，调用冻结处理函数 merchantFreeze(item)，并将商户的信息传递给该处理函数
       */
      affirmStoreFreeze(data) {
        MessageBox.confirm('确认冻结门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.storeFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      /**
       * 冻结处理函数，接受一个商户对象 参数
       * 1、发送api请求，传递商户的id 作为api参数 进行冻结，并等待响应结果
       * 2、冻结成功，则调用 merchantList函数（获取商户列表信息），对组件中的dataItem进行重新赋值 ！！！！！！！！！ ？？？ 是否需要重新请求api ？？？
       *
       */
      async storeFreeze(data) {
        let res = await Http.post(Config.api.storeFreeze, {id: data.id});
        if (res.code === 0) {
          this.storeQuery();
          this.$message({ message: '门店已经冻结！', type: 'success' });
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      },

      /**
       * 点击【解冻】按钮的 响应事件，该事件需要接受一个参数 item，以确认 运营人员目前需要解冻哪个商户？
       * 1、弹窗提醒运营人员 是否需要解冻该商户
       * 2、如果运营人员 点击【确认】按钮，则调用解冻的处理函数 merchantFreeze，并将该商户对象 作为参数 进行传递
       */
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
      /**
       * 解冻处理函数，接受一个商户对象 参数
       * 1、发送api请求，传递商户的id，作为api参数 进行解冻，并等待响应结果
       * 2、解冻成功，则调用merchantList函数（获取商户列表信息），对组件中的dateItem进行重新赋值！
       */
      async storeUnFreeze(data) {
        let that = this;
        let res = await Http.post(Config.api.storeUnFreeze, {
          id: data.id
        });
        if (res.code === 0) {
          that.storeQuery();
          this.$message({ message: '门店已经解冻！', type: 'success' });
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      },

      //确认删除门店
      deleteStore(data){

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
      async storeDelete(data){
        let that = this;
        let res = await Http.post(Config.api.storeDelete, {
          id: data.id
        });
        if(res.code === 0){
          that.storeQuery();
          this.$message({ message: '门店已删除！', type: 'success' });
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },

      async showDetail(item) {
        return;
        let res = await Http.get(Config.api.merchantDetail, { id: item.merchant_id });
        if (res.code === 0) {
          this.$data.dialog = { visible: true, item: res.data, type: 'detail' };
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      },

      showMerchantDetail(item) {
        this.$data.detail = {
          visible: true,
          merchant_id: item.merchant_id,
        };

      },

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';

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
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
