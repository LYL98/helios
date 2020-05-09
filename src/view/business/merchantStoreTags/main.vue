<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="标签名称"
              v-model="query.condition"
              @search="changeQuery()"
              @reset="resetQuery()"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="table-top" v-if="auth.isAdmin || auth.MerchantStoreTagsAdd">
        <div class="left"></div>
        <div class="right">
          <el-button @click="handleAddItems()" size="mini" type="primary">新增</el-button>
        </div>
      </div>
      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column prop="title" label="名称" min-width="120">
            <template slot-scope="scope">
              <div>
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标签项" min-width="300">
            <template slot-scope="scope">
              <el-tag type="info" disable-transitions v-for="(item, index) in scope.row.child_tags" :key="index" style="margin: 0 5px 5px 0;">{{item.title}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created" label="创建时间" min-width="160">
            <template slot-scope="scope">
              <div>
                {{ scope.row.created }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.MerchantStoreTagsEdit,
                  command: () => handleEditItems(scope.row)
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.MerchantStoreTagsDelete,
                  command: () => handleDeleteItems(scope.row)
                }
              ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <!--新增、修改门店标签-->
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      append-to-body
    >
      <add-edit-view v-if="dialog.visible" :item="dialog.item" @cancel="handleCancel" @submitSuccess="addEditSuccess"/>
    </el-dialog>
  </sub-menu>
</template>

<script>
  import { Row, Col, Table, TableColumn, Pagination, Tag, Dialog } from 'element-ui';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import { QueryItem, QuerySearchInput } from '@/common';
  import AddEdit from './addEdit';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'add-edit-view': AddEdit,
      'my-query-item': QueryItem,
      'query-search-input': QuerySearchInput
    },
    data() {
      let initDialog = {
        visible: false,
        title: '门店标签',
        item: {
          title: '',
          child_tags: [{
            title: ''
          }]
        }
      }
      return {
        query: {
          condition: '',
        },
        list: [],
        initDialog: initDialog,
        dialog: this.copyJson(initDialog),
      }
    },
    created() {
      documentTitle('业务 - 商户属性 - 门店标签');
      this.initQuery();
      this.basicdataStoreTagList();
    },
    methods: {
      initQuery() {
        this.$data.query.condition = '';
      },

      changeQuery() {
        this.basicdataStoreTagList();
      },

      resetQuery() {
        this.initQuery();
        this.basicdataStoreTagList();
      },

      async basicdataStoreTagList() {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataStoreTagList, this.query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleCancel(){
        this.$data.dialog = this.copyJson(this.initDialog);
      },

      addEditSuccess(){
        this.handleCancel();
        this.changeQuery();
      },

      handleAddItems(){
        this.$data.dialog = {
          ...this.copyJson(this.initDialog),
          visible: true,
          title: '新增门店标签'
        }
      },

      handleEditItems(item){
        let d = this.copyJson(item);
        if(d.child_tags.length === 0){
          d.child_tags = [{
            title: ''
          }];
        }
        this.$data.dialog = {
          item: d,
          visible: true,
          title: '修改门店标签'
        }
      },

      handleDeleteItems(item){
        this.$messageBox.confirm('您确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$loading({isShow: true, isWhole: true});
          let res = await Http.post(Config.api.basicdataStoreTagDelete, {
            id: item.id
          });
          this.$loading({isShow: false});
          if (res.code === 0){
            this.changeQuery();
            this.$message({title: '提示', message: '删除成功', type: 'success'});
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .menu-left-query{
    width: 280px;
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>


