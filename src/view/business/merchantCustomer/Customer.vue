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
            :disabled="query.province_code ? false : true"
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
            placeholder="门店名称/商品名称"
            v-model="query.condition"
            @search="changeQuery"
            @reset="resetQuery"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="展示分类">
          <my-select-display-class
            :disabled="query.province_code ? false : true"
            v-model="query.display_class_id"
            @change="changeQuery"
            size="small"
            :clearable="true"
            :provinceCode="query.province_code"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
       <my-query-item label="创建时间">
          <el-date-picker
            size="small"
            v-model="pickerValue"
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
        </div>
        <div class="right" v-if="auth.isAdmin || auth.AdvicedItemStatistical">
          <el-button v-if="auth.isAdmin || auth.AdvicedItemQuery" @click="showDetailEchart" size="mini" type="primary">客户提报统计</el-button>
          <!-- <el-button v-if="auth.isAdmin || auth.MerchantExport" @click.native="() => {merchantListExport();}" size="mini" type="primary" plain >导出客户提报</el-button> -->
        </div>
      </div>
      <!-- 头部end -->
<div @mousemove="handleTableMouseMove" class="table-conter">
    <el-table
      class="list-table my-table-float"
      :data="dataItem.items"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :row-class-name="highlightRowClassName"
      :highlight-current-row="true"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <!-- 表格宽度： 860 / 830（带全选） -->
      <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size <= 999950 ? 68 : 88" label="序号" :index="indexMethod">
      </el-table-column>
      <el-table-column label="门店名称" min-width="100" prop="store.title">
        <template slot-scope="scope">
        <span v-if="auth.isAdmin || auth.AdvicedItemQuery">
          <a :class="`title ${isEllipsis(scope.row)}`" href="javascript:void(0);" @click.prevent="showDetail(scope.row)">
            {{ scope.row.store.title }}
          </a>
        </span>
          <span v-else :class="isEllipsis(scope.row)">
          {{ scope.row.store.title }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="县域" min-width="80" prop="city.title">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.city && scope.row.city.title }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="展示分类" min-width="80" prop="display_class.title" >
        <template slot-scope="scope">
          {{scope.row.display_class.title}}
        </template>
      </el-table-column>
      
      <el-table-column label="商品名称" min-width="120" prop="title" >
        <template slot-scope="scope">
          <div>{{ scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column label="提报时间" min-width="80" prop="created">
        <template slot-scope="scope">
          {{scope.row.created}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
              {
                title: '详情',
                isDisplay: auth.isAdmin || auth.AdvicedItemQuery,
                command: () => showDetail(scope.row)
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
    <!-- 客户提报详情 -->
     <detail-layout
      title="客户提报详情"
      :isShow="detailDrawer.isShow"
      type="drawer"
      direction="ttb"
      :before-close="handleCancel"
    >
        <detail-customer
          v-if="detailDrawer.isShow"
          style="padding: 0 20px;"
          :formData='detailDrawer.item'
        />
    </detail-layout>
    <!-- 提报统计 -->
     <detail-layout
      title="提报统计"
      :isShow="detailEchart.isShow"
      type="drawer"
      direction="ttb"
      :before-close="closeDetailEchart"
    >

    <detail-echart  :echartData="detailEchart.item"/>
    </detail-layout>
  </sub-menu>
</template>

<script>
  import {Row, Col, DatePicker, MessageBox, Message, Form, FormItem, Button, Input, Select, Option, Dialog, Tag, Pagination } from 'element-ui';
  import QueryMerchantCustomer  from './QueryMerchantCustomer';
  import DetailCustomer from './DetailCustomer';
  import DetailEchart from './DetailEchart';

//   import AddEditMerchantList from './AddEditMerchantList';
//   import DetailMerchantList from './DetailMerchantList';
  import { Config, Constant, DataHandle, Method, Http } from '@/util';
  import {SelectOption, QueryItem, SelectProvince ,SelectDisplayClass,TableOperate} from '@/common';
  import { GlobalProvince, SelectCity } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryMixin from '@/share/mixin/query.mixin';
  import tableMixin from '@/share/mixin/table.mixin';
  import detailLayout from "@/share/layout/Layout";

  export default {
    name: "MerchantCustomer",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-pagination': Pagination,
    //   'table-merchant-list': TableMerchantList,
    //   'add-edit-merchant-list': AddEditMerchantList,
    //   'detail-merchant-list': DetailMerchantList,
      'query-merchant-customer': QueryMerchantCustomer,
      'el-row': Row,
      'el-col': Col,
      'el-date-picker': DatePicker,
      'my-query-item': QueryItem,
      'select-option': SelectOption,
      'my-select-city': SelectCity,
      'global-province': GlobalProvince,
      'my-select-display-class':SelectDisplayClass,
      'my-table-operate': TableOperate,
      'detail-layout': detailLayout,
      'detail-customer':DetailCustomer,
      'detail-echart':DetailEchart
    },
    mixins: [mainMixin,queryMixin,tableMixin],
    created() {
      let that = this;
      documentTitle('业务 - 客户提报');
      let p = that.province;
    //   if (p.code) {
        console.log(p);
        that.$data.query.province_code = '',
        // console.log(this.$auth);
        that.customerQuery();
    //   }
    },
    data() {
      return {
        merchant_id: '',
        province: this.$province,
        auth: this.$auth,
        tencentPath: Config.tencentPath,
        provinceList: [],//区域列表
        fixDateOptions: Constant.FIX_DATE_RANGE,
        query: {
          province_code: '',
          city_id: '',
          condition: '',
          display_class_id: '',
          begin_date: '',
          end_date:'',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        pickerValue: null,
        dataItem: {
          items: [],
          num: 0
        },
        detailDrawer: {
          isShow: false,
          item: {}
        },
        detailEchart:{
            isShow: false,
        }
      }
    },
    methods: {
      indexMethod(index) {
        let {query} = this;
        return (query.page - 1) * query.page_size + index + 1;
      },
      //刷新
      refresh() {
        let {query} = this;
        query.page = 1;
        query.is_audited = '';
        this.$data.query = query;
        this.customerQuery();
      },

      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.customerQuery();
      },

      /**
       * 翻页 的 按钮事件
       * 1、设置组件中 query.page的值
       * 2、调用merchantList 重新加载商户列表信息
       */
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.customerQuery();
      },

      /**
       * 切换区域 的按钮事件
       * 1、设置当前的区域code
       * 2、设置page属性为1
       * 3、重新加载商户列表
       */
      selectProvince(data,type) {
        let {query} = this;
        // console.log(data,type);
        if(type === 'init'){
          query.province_code = data.code || '';
          console.log(111);
          
        }else{
        query.province_code = data.code;
        query.page = 1;
        this.$data.query = query;
        this.customerQuery();
        }
        
      },

      changeQuery() {
          
        window.scrollTo(0, 0);
        this.query.page = 1;
        this.customerQuery();
      },
      /**
       * 清除筛选条件
       */
      resetQuery(){
        let { page_size } = this.$data.query;
        this.$data.query = {
          province_code: '',
          city_id: '',
          condition: '',
          display_class_id: '',
          begin_date: '',
          end_date:'',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
        this.customerQuery();
      },

      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = query;
        this.customerQuery();
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
          province_code: this.query.province_code,
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
       * 获取客户提报列表信息：
       * 1、请求API
       * 2、将获取的data数据，赋值给组件的dataItem
       */
      async customerQuery() {
        let that = this;
        let {query} = that;
        // get merchant list data
        let res = await Http.get(Config.api.advicedItemQuery, query);
        // 如果返回结果正确，则将该数据 赋值给 dataItem；
        if (res.code === 0) {
          that.$data.dataItem = res.data;
          
          window.scrollTo(0, 0);
        } else { // 如果返回值不正确，则提示弹窗
          Message.warning(res.message);
        }
      },
      //点击显示详情页面
      showDetail(data){
          this.detailDrawer = {
          isShow: true,
          item: data
        }
      },
      //关闭详情
      handleCancel(){
        this.detailDrawer = {
          isShow: false,
          item: {}
        }

      },
      //客户提报统计
     async showDetailEchart(data){
        let that = this;
        let {query} = that;
        let res = await Http.get(Config.api.advicedItemStatistical);
         if (res.code === 0) {
        
          that.$data.detailEchart = {
             isShow: true,
            item: res.data
          };
          window.scrollTo(0, 0);
        } else { // 如果返回值不正确，则提示弹窗
          Message.warning(res.message);
        }
      },
      //关闭客户提报统计
      closeDetailEchart(){
          this.detailEchart={
                isShow: false,
               item: []
          }
      }

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
