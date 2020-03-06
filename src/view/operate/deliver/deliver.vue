<template>
  <div>
    <div class="query">
      <el-row :gutter="32">
        <el-col :span="8">
          <my-query-item label="职务">
            <el-select size="small" v-model="query.post" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="司机" value="pre"></el-option>
              <el-option label="装车员" value="ing"></el-option>
              <el-option label="配送员" value="post"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="8">
          <my-query-item label="审核状态">
            <el-select size="small" v-model="query.is_audited" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" :value="0"></el-option>
              <el-option label="已审核" :value="1"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="8">
          <my-query-item label="冻结状态">
            <el-select size="small" v-model="query.is_freeze" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="未冻结" :value="0"></el-option>
              <el-option label="已冻结" :value="1"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px">
        <el-col :span="8">
          <div class="display-flex align-items-center">
            <my-query-item label="搜索">
              <el-input
                class="query-item-select"
                size="small"
                placeholder="请输入姓名/手机号"
                v-model="query.condition"
                @change="changeQuery"
              />
            </my-query-item>
            <el-button size="small" type="primary" style="margin-left: 10px" @click.native="changeQuery">搜索</el-button>
            <el-button size="small" type="primary" plain @click.navtive="resetQuery">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="display-flex justify-content-end" v-if="$auth.isAdmin || $auth.operateDeliverAdd || $auth.operateDeliverExport">
        <el-button type="primary" plain size="mini" @click.native="handleExport" v-if="$auth.isAdmin || $auth.operateDeliverExport">导出配送人员</el-button>
        <el-button class="right" type="primary" size="mini" @click.native="handleAddItem" v-if="$auth.isAdmin || $auth.operateDeliverAdd">新增</el-button>
      </div>
      <div class="mt-16">
        <el-table :data="list.items">
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          />
          <el-table-column
            min-width="100"
            label="姓名"
            prop="realname"
          />
          <el-table-column
            min-width="100"
            label="账号手机号"
            prop="phone"
          />
          <el-table-column
            min-width="100"
            label="职务"
          >
            <template slot-scope="scope">
              {{ deliver_post[scope.row.post] }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="车牌"
            prop="driver_car_num"
          >
            <template slot-scope="scope">
              {{ scope.row.driver_car_num || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="车型"
            prop="driver_car_type"
          >
            <template slot-scope="scope">
              {{ scope.row.driver_car_type || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="审核状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.is_audited" size="small" type="primary" disable-transitions>待审核</el-tag>
              <el-tag v-else size="small" type="regular" disable-transitions>已审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="冻结状态"
          >
            <template slot-scope="scope">
              <el-switch
                @change="(v)=>handleFreezeItem(v, scope.row)"
                :value="scope.row.is_freeze"
                :active-value="true"
                :inactive-value="false"
                :disabled="$auth.isAdmin || $auth.operateDeliverFreeze"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <my-table-operate
                :list="[
                  {
                    title: '审核',
                    isDisplay: !scope.row.is_audited && ($auth.isAdmin || $auth.operateDeliverAudit),
                    command: () => handleAuditItem(scope.row)
                  },
                  {
                    title: '修改',
                    isDisplay: $auth.isAdmin || $auth.operateDeliverEdit,
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '详情',
                    isDisplay: $auth.isAdmin || $auth.operateDeliverDetail,
                    command: () => handleDetailItem(scope.row)
                  },
                  {
                    title: '重置密码',
                    isDisplay: $auth.isAdmin || $auth.operateDeliverResetPassword,
                    command: () => handleResetPassword(scope.row)
                  },
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="list.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
    <el-dialog
      :title="`${dialog.type === 'add' ? '新增' : '修改'}配送人员`"
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
    >
      <deliver-edit
        v-if="dialog.visible"
        :type="dialog.type"
        :item="dialog.item"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </el-dialog>
    <el-dialog
      title="重置密码"
      :close-on-click-modal="false"
      :visible.sync="resetPassword.visible"
      width="600px"
      append-to-body
    >
      <reset-password
        v-if="resetPassword.visible"
        :item="resetPassword.item"
        @cancel="handleCancelResetPassword"
      />
    </el-dialog>
    <el-dialog
      title="详情"
      :close-on-click-modal="true"
      :visible.sync="detail.visible"
      width="500px"
      append-to-body
    >
      <deliver-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
  </div>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn, Pagination, Dialog, Switch, Tag } from 'element-ui';
  import { Constant, Http, Config } from '@/util';
  import { QueryItem, QuerySearchInput, TableOperate } from '@/common';
  import DeliverEdit from './deliver-edit';
  import DeliverDetail from './deliver-detail';
  import ResetPassword from './reset-password';
  export default {
    name: 'deliver',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'el-switch': Switch,
      'el-tag': Tag,
      'my-query-item': QueryItem,
      'my-query-search-input': QuerySearchInput,
      'my-table-operate': TableOperate,
      'deliver-edit': DeliverEdit,
      'deliver-detail': DeliverDetail,
      'reset-password': ResetPassword,
    },
    data() {
      return {
        deliver_post: Constant.DELIVER_POST(),
        query: {
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        list: {
          items: [],
          num: 33
        },
        dialog: {
          visible: false,
          type: 'add',
          item: null
        },
        detail: {
          visible: false,
          item: null,
        },
        resetPassword: {
          visible: false,
          item: null,
        }
      }
    },
    created() {
      document.title = '场地 - 配送人员';
      this.deliverQuery();
    },
    methods: {
      changeQuery() {
        this.deliverQuery();
      },
      resetQuery() {
        this.$data.query = {
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
        this.deliverQuery();
      },
      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },
      changePage(page) {
        this.$data.query.page = page;
        this.deliverQuery();
      },
      changePageSize(page_size) {
        this.$data.query.page_size = page_size;
        this.deliverQuery();
      },
      deliverQuery() {
        Http.get(Config.api.operateDeliverQuery, this.$data.query)
          .then(res => {
            if (res.code === 0) {
              this.$data.list = res.data;
            } else {
              this.$message({title: '提示', message: res.message, type: 'error'});
            }
          });
      },
      handleAuditItem(item) {
        Http.post(Config.api.operateDeliverAudit, { id: item.id })
          .then(res => {
             if (res.code === 0) {
               this.$message({title: '提示', message: '审核通过', type: 'success'});
               this.deliverQuery();
             } else {
               this.$message({title: '提示', message: res.message, type: 'error'});
             }
          });
      },
      handleFreezeItem(value, item) {
        let str = value ? '冻结' : '解冻';
        this.$messageBox.confirm(`确认${str}该配送人员?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api[value ? 'operateDeliverFreeze' : 'operateDeliverUnFreeze'], {
            id: item.id
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: `已${str}`, type: 'success'});
            this.deliverQuery();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleAddItem() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          item: null
        }
      },
      handleModifyItem(item) {
        this.$data.dialog = {
          visible: true,
          type: 'modify',
          item: item,
        }
      },
      handleSubmitEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
        this.deliverQuery();
      },
      handleCancelEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
      },
      handleDetailItem(item) {
        Http.get(Config.api.operateDeliverDetail, { id: item.id })
          .then(res => {
            if (res.code === 0) {
              this.$data.detail = {
                visible: true,
                item: res.data,
              };
            } else {
              this.$message({title: '提示', message: res.message, type: 'error'});
            }
        });
      },
      handleResetPassword(item) {
        this.$data.resetPassword = {
          visible: true,
          item: item,
        }
      },
      handleCancelResetPassword() {
        this.$data.resetPassword = {
          visible: false,
          item: null,
        }
      },
      async handleExport() {
        //判断是否可导出
        this.$loading({ isShow: true });
        let res = await Http.get(Config.api.operateDeliverExport, this.query);
        if(res.code === 0){
          let queryStr = `${Config.api.operateDeliverExport}?time=${new Date().getTime()}`;
          for(let key in this.query){
            queryStr += `&${key}=${this.query[key]}`;
          }
          queryStr = queryStr.substring(0, queryStr.length - 1);
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .mt-16 {
    margin-top: 16px;
  }
  .display-flex {
    display: flex;
  }
  .justify-content-end {
    justify-content: flex-end;
  }
  .align-items-center {
    align-items: center;
  }
</style>
