<template>
  <div>
    <!-- 头部start -->
    <div class="operate space-between">
      <div>
        <el-button v-if="auth.isAdmin || auth.SystemBannerDelete"
                   :disabled="multipleSelection.length > 0 ? false : true"
                   size="mini"
                   type="primary"
                   plain
                   @click.native="deleteBanner('multiple')">批量删除</el-button>
      </div>
      <div>
        <el-button @click="systemBannerShowHideAddEdit({
          isShow: true
        })" size="mini" v-if="auth.isAdmin || auth.SystemBannerAdd" type="primary">新增</el-button>
      </div>
    </div>
     <!--头部end-->
    <!-- 表格start -->
    <el-table :data="dataItem"
              style="width: 100%"
              :loading="true"
              class="list-table"
              :row-class-name="highlightRowClassName"
              @selection-change="handleSelectionChange"
              :height="windowHeight - offsetHeight">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <a href="javascript:void(0);">
            <my-image-preview><img :src="tencentPath + scope.row.image + '_min200x200'" width="84" height="63"/></my-image-preview>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="rank" label="排序"/>
      <!--<el-table-column label="类型">-->
        <!--<template slot-scope="scope">-->
          <!--{{{'commdity': '链接到商品', 'category': '链接到品类', 'external_link': '外部链接', 'nolink': '没有链接'}[scope.row.banner_type]}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.is_usable ? 'regular' : 'info'">{{scope.row.is_usable ? '可用' : '不可用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.SystemBannerEdit,
                command: () => systemBannerShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.SystemBannerDelete,
                command: () => deleteBanner(scope.row.id)
              }
            ]"
          />
        </template>
      </el-table-column>
    </el-table>
     <!--表格end -->
    <!--<div class="table-bottom" style="">-->
      <!--<div class="operate">-->
       <!---->
      <!--</div>-->
    <!--</div>-->
    <!--新增或修改-->
    <my-banner-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Form, FormItem, Button, Input, Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import {TableOperate, ImagePreview} from '@/common';
  import { Config, Constant } from '@/util';
  import BannerAddEdit from './BannerAddEdit';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "BannerList",
    mixins: [viewMixin],
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-banner-add-edit': BannerAddEdit,
      'my-table-operate': TableOperate,
      'my-image-preview': ImagePreview,
    },
    computed: mapGetters({
      dataItem: 'bannerDataItem'
    }),
    data: function () {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        tencentPath: Config.tencentPath,
        multipleSelection: [],
      }
    },
    created: function () {
      documentTitle("设置 - Banner管理");
      this.systemBannerList({
        data: { province_code: this.province.code }
      });
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      //多选
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      deleteBanner(id) {
        let that = this;
        MessageBox.confirm('您确认要删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          if(id === 'multiple'){
            (that.multipleSelection).forEach(row => {
              ids.push(row.id);
            });
          }else{
            ids = [id];
          }
          that.systemBannerDelete({
            data: {
              ids: ids
            },
            callback: function (data) {
              that.myCallBack()
            }
          });
        }).catch(() => {
          console.log('取消');
        });
      },
      //组件回调
      myCallBack(res){
        this.systemBannerList({
          data: { province_code: this.province.code }
        });
      },
      ...mapActions(['systemBannerList', 'systemBannerShowHideAddEdit', 'systemBannerDelete', 'systemBannerAddEdit'])
    }
  }
</script>

<style scoped>

</style>
