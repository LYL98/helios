<template>
  <detail-layout
    :title="`${detail.title}`"
    :isShow="isShow"
    direction="ttb"
    :before-close="handleCancel"
    type="drawer"
  >
    <div style="padding: 0 30px; ">
      <div class="container-query">
        <el-row :gutter="32">
           <el-col :span="12">
            <my-query-item label="搜索">
              <query-search-input
                v-model="query.condition"
                placeholder="请输入商品编号/名称"
                size="small"
                @search="changeQuery"
                @reset="resetQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :span="8">
            <my-query-item label="科学分类">
              <select-system-class
                v-model="query.system_class_codes"
                @change="selectSystemClass"
                :clearable="false"
                size="small"
              />
            </my-query-item>
          </el-col>
         
        </el-row>
      </div>
      <div class="container-table">
        <div class="table-top" v-if="auth.isAdmin || auth.ItemTagAdd">
          <div class="left"></div>
          <div class="right">
            <el-button @click="handleAddItems" size="mini" type="primary">新增</el-button>
          </div>
        </div>
        <el-table :data="dataItem.items" width="100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="42"
            v-if="(auth.isAdmin || auth.ItemQueryByItemTag)"
          ></el-table-column>
          <el-table-column label="商品名称" prop="title"  align="center" />
          <!-- 序号 -->
          <!-- type="index" :index="indexMethod" -->
          <el-table-column label="排序" prop="rank" align="center"></el-table-column>
          <el-table-column label="定价" width="150" align="center" prop="price_sale">
            <template slot-scope="scope">
              <!-- <input-weight
                size="medium"
                unit="元"
                :placeholder="`${DataHandle.returnPrice(scope.row.price_sale)}`"
                :disabled="true"
              /> -->
              {{ !!scope.row.price_sale ? '￥' + DataHandle.returnPrice(scope.row.price_sale) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="created"  align="center" />

          <el-table-column label="操作内容"  >
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.ItemTagRankEdit,
                command: () => handleModifyItem(scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.ItemTagDelete,
                command: () => handleDelete(scope.row)
              }
            ]"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="table-bottom">
          <div class="left">
            <el-button
              v-if="auth.isAdmin || auth.ItemTagDelete"
              @click="handleDelete('multiple')"
              size="mini"
              type="primary"
              :disabled="multipleSelection.length === 0 ? true : false"
            >批量删除</el-button>
          </div>
          <div class="right">
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
    </div>
    <add-edit-layout
      :is-show="dialog.visible"
      :title="`${dialog.type === 'add' ? '新增' : '修改'}商品`"
      :before-close="handleCancelEdit"
      type="dialog"
      :append-to-body="dialog.append"
      :width="'80%'"
    >
      <tags-item-edit
        v-if="dialog.visible"
        :tag="selectedTag"
        :type="dialog.type"
        :items="dialog.items"
        :windowHeight="viewWindowHeight"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </add-edit-layout>
    <el-dialog
      title="修改商品排序"
      :close-on-click-modal="false"
      :visible.sync="modify.visible"
      :append-to-body="true"
      width="500px"
    >
      <tag-rank-modify
        v-if="modify.visible"
        :item="modify.item"
        @submit="handleSubmitModify"
        @cancel="handleCancelModify"
      />
    </el-dialog>
  </detail-layout>
</template>
<script>
import detailMixin from "@/share/mixin/detail.mixin";
import mainMixin from "@/share/mixin/main.mixin";
import queryMixin from "@/share/mixin/query.mixin";
import tableMixin from "@/share/mixin/table.mixin";

import { Http, Config, Constant, Lodop ,DataHandle} from "@/util";

import TagsItemEdit from "./tags-item-edit";
import TagRankModify from "./tag-rank-modify";

import AddEditLayout from "@/share/layout/Layout";

import { GlobalProvince } from "@/component";

import { TableOperate,InputWeight,SelectOption, SelectSystemClass } from "@/common";
import {
  Row,
  Col,
  Button,
  Input,
  Select,
  Option,
  Pagination,
  Table,
  TableColumn,
  Dialog,
  DatePicker,
  Tag
} from "element-ui";

export default {
  name: "DetailItemTags",
  components: {
    "select-system-class": SelectSystemClass,
    "select-option": SelectOption,
    "my-table-operate": TableOperate,
    "input-weight": InputWeight,
    "tags-item-edit": TagsItemEdit,
    "add-edit-layout": AddEditLayout,
    "tag-rank-modify": TagRankModify,

    "el-dialog": Dialog
  },
  mixins: [detailMixin, mainMixin, queryMixin, tableMixin],
  props: {
    provinceCode: { type: String, default: "" } //省code
  },
  data() {
    // let initQuery = {
    //   // system_class_code: "",
    //   system_class_codes: [],
    //   condition: "",
    //   // is_deleted: "0",
    //   id: '',
    //   page: 1,
    //   page_size: Constant.PAGE_SIZE,
    //   item_tag_id: ''
    // };
    return {
      initDetail: {},
      query: {},
      dataItem: {
        items: [],
        num: 0
      },

      //新增页面
      dialog: {
        visible: false,
        type: "add",
        items: null,
        append: true
      },
      //修改页面
      modify: {
        visible: false,
        item: null
      }
    };
  },
  created() {
    this.DataHandle = DataHandle;
    this.initQuery();
  },
  computed: {
    selectedTag() {
      return this.$data.detail;
    }
  },
  methods: {
    initQuery() {
      this.$data.query = {
        system_class_codes: [],
        condition: "",
        is_deleted: 0,
        id: "",
        page: 1,
        page_size: Constant.PAGE_SIZE,
        item_tag_id: "",
        province_code: this.$province.code,
        // sort: "",
        // discount: ""
      };
    },

    //显示详情(重写mixin)
    showDetail(data) {
      if (data) {
        this.$data.detail = JSON.parse(JSON.stringify(data));
      } else {
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      //获取明细列表

      this.$data.query.item_tag_id = this.$data.detail.id;
      this.pItemModifyDetail();
      this.$data.isShow = true;
    },

  
    //选择科学分类
    selectSystemClass(value) {
      if (value.length === 0) {
        this.$data.query.system_class_code = "";
      } else {
        this.$data.query.system_class_code = value[value.length - 1];
      }

      this.handleQuery("DetailItemTags");
    },
    //获取数据（选择科学分类时触发）
    async getData() {
      // console.log(233);
      this.pItemModifyDetail();
    },
      //重写删除数据提示
      handleDelete(data){
      this.$messageBox.confirm(`确定删除这项商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center:true
      }).then(() => {
        this.deleteData(data);
      }).catch(() => {
        //console.log('取消');
      });
    },
    //删除数据
    async deleteData(data) {
      let ids = [];

      if (data === "multiple") {
        this.multipleSelection.forEach(row => {
          ids.push({
            item_tag_id: this.$data.query.item_tag_id,
            item_id: row.id
          });
        });
      } else {
        ids = [{ item_tag_id: this.$data.query.item_tag_id, item_id: data.id }];
      }

      this.$loading({ isShow: true });
      let res = await Http.post(Config.api.itemTagDelete, {
        item_tag_records: ids
      });
      this.$loading({ isShow: false });
      if (res.code === 0) {
        this.getData();
        this.$message({ message: "已删除", type: "success" });
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    },
    //获取明细列表
    async pItemModifyDetail() {

      this.$loading({ isShow: true, isWhole: true });
      let { query } = this;
      let res = await Http.get(Config.api.itemQueryByItemTag, query);
      this.$loading({ isShow: false });
      if (res.code === 0) {
        this.$data.isShow = true;
        let rd = res.data;
        this.$data.dataItem = rd;
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    },
    //搜索
    changeQuery() {
      this.$data.query.page = 1;
      this.pItemModifyDetail();
    },
  //重置
    resetQuery() {
      let item_tag_id = this.$data.query.item_tag_id;
      this.initQuery();
      this.$data.query.item_tag_id = item_tag_id;
      this.pItemModifyDetail();
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },

    // 设置每页显示数量
    changePageSize(pageSize) {
      this.$data.query.page_size = pageSize;
      this.$data.query.page = 1;
      this.pItemModifyDetail();
    },

    //翻页
    changePage(page) {
      this.$data.query.page = page;
      this.pItemModifyDetail();
    },

    //返回str
    returnAttrStr(list) {
      let str = "";
      list.forEach(item => {
        str += item + "/";
      });
      str = str.substring(0, str.length - 1);
      return str;
    },

    //显示新增页面
    handleAddItems() {
      this.$data.dialog = {
        visible: true,
        type: "add",
        items: [],
        append: true
      };
    },
    //关闭新增页面
    handleCancelEdit() {
      this.$data.dialog = {
        visible: false,
        type: "add",
        items: [],
        append: false
      };
    },
    //新增页面提交
    handleSubmitEdit() {
      this.handleCancelEdit(), this.pItemModifyDetail();
    },

    //显示修改页面
    handleModifyItem(item) {
      this.$data.modify = {
        visible: true,
        item: { ...item, item_tag_id: this.$data.query.item_tag_id }
      };
    },
    handleSubmitModify() {
      this.handleCancelModify();
      this.pItemModifyDetail();
    },

//关闭修改页面
    handleCancelModify() {
      this.$data.modify = {
        visible: false,
        item: null
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/share/scss/detail.scss";
@import "@/share/scss/table.scss";
// @import "@/share/scss/query.scss";

</style>
<style lang="scss">
@import "@/share/scss/table.global.scss";
</style>