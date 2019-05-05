<template>
  <div class="merchant-outer-tags-list">
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataMerchantOuterTagsListAdd">
      <el-button @click="basicDataMerchantOuterTagsShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataMerchantOuterTagsListAdd">新增</el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column prop="title" label="名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '编辑',
                isDisplay: auth.isAdmin || auth.BasicDataMerchantOuterTagsListUpdate,
                command: () => basicDataMerchantOuterTagsShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataMerchantOuterTagsListDelete,
                command: () => deleteMerchantOuterTags(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <my-merchant-outer-tags-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Input, Table, TableColumn, Tag, RadioGroup, RadioButton, MessageBox } from 'element-ui';
import {TableOperate} from '@/common';
import { Config, Constant } from '@/util';
import MerchantOuterTagsAddEdit from './MerchantOuterTagsAddEdit';
import { tableMixin } from "@/mixins";

export default {
  name: 'MerchantOuterTagsList',
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tag': Tag,
    'my-merchant-outer-tags-add-edit': MerchantOuterTagsAddEdit,
    'my-table-operate': TableOperate
  },
  mixins: [tableMixin],
  created(){
    documentTitle("信息 - 商户外标签列表");
    this.basicDataMerchantOuterTagsList();

    if (!this.auth.isAdmin && !this.auth.BasicDataMerchantOuterTagsListAdd) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT
    }
  },
  computed: mapGetters({
    dataItem: 'basicDataMerchantOuterTagsListDataItem',
    auth: 'globalAuth',
    windowHeight: 'windowHeight',
  }),
  data(){
    return {
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE
    }
  },
  methods: {
    //省改变
    changeProvince(v, isInit){
      if(!isInit) this.basicDataMerchantOuterTagsList();
    },
    //组件回调
    myCallBack(res){
      this.basicDataMerchantOuterTagsList();
    },
    //删除
    deleteMerchantOuterTags(data) {
      let that = this;
      MessageBox.confirm(`您确认要删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         that.basicDataMerchantOuterTagsDelete({
            data: {
              id: data.id
            },
            callback: ()=>{
              that.basicDataMerchantOuterTagsList();
            }
          });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    ...mapActions(['basicDataMerchantOuterTagsList', 'basicDataMerchantOuterTagsDelete', 'basicDataMerchantOuterTagsShowHideAddEdit'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
