<template>
  <div>
    <div class="query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="职务">
            <my-select-option
              :options="{'全部': '', ...query_deliver_post}"
              v-model="query.post"
              @change="changeQuery"
              size="small"
              clearable
              placeholder="全部"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="审核状态">
            <my-select-option
              :options="{'全部': '', '待审核': 0, '已审核': 1}"
              v-model="query.is_audited"
              @change="changeQuery"
              size="small"
              clearable
              placeholder="全部"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <my-query-search-input
              size="small"
              placeholder="用户名/手机号"
              v-model="query.condition"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px">
        <el-col :span="7">
          <my-query-item label="冻结状态">
            <my-select-option
              :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
              v-model="query.is_freeze"
              @change="changeQuery"
              size="small"
              clearable
              placeholder="全部"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="display-flex justify-content-end" v-if="$auth.isAdmin || $auth.DeliverAdd || $auth.DeliverExport">
        <el-button type="primary" plain size="mini" @click.native="handleExport" v-if="$auth.isAdmin || $auth.DeliverExport">导出配送人员</el-button>
        <el-button class="right" type="primary" size="mini" @click.native="handleAddItem" v-if="$auth.isAdmin || $auth.DeliverAdd">新增</el-button>
      </div>
      <div class="mt-16 table-conter" @mousemove="handleTableMouseMove">
        <el-table
          :data="list.items"
          :row-class-name="highlightRowClassName"
          class="list-table my-table-float"
          :highlight-current-row="true"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          />
          <el-table-column
            min-width="140"
            label="姓名"
            prop="realname"
          >
            <div
              slot-scope="scope"
              :class="`td-item link-item ${isEllipsis(scope.row)}`"
              @click.prevent="handleDetailItem(scope.row)"
            >{{scope.row.realname}}</div>
          </el-table-column>
          <el-table-column
            min-width="110"
            label="账号手机号"
            prop="phone"
          />
          <el-table-column
            min-width="80"
            label="职务"
          >
            <template slot-scope="scope">
              {{ deliver_post[scope.row.post] }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="车牌"
            prop="driver_car_num"
          >
            <template slot-scope="scope">
              {{ scope.row.driver_car_num || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="车型"
            prop="driver_car_type"
          >
            <template slot-scope="scope">
              {{ scope.row.driver_car_type || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="90"
            label="审核状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.is_audited" size="small" type="primary" disable-transitions>待审核</el-tag>
              <el-tag v-else size="small" type="regular" disable-transitions>已审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="90"
            label="冻结状态"
          >
            <template slot-scope="scope">
              <el-switch
                @change="(v)=>handleFreezeItem(v, scope.row)"
                :value="scope.row.is_freeze"
                :active-value="true"
                :inactive-value="false"
                :disabled="!$auth.isAdmin && !$auth.DeliverFreeze"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '审核',
                    isDisplay: !scope.row.is_audited && ($auth.isAdmin || $auth.DeliverAudit),
                    command: () => handleAuditItem(scope.row)
                  },
                  {
                    title: '修改',
                    isDisplay: $auth.isAdmin || $auth.DeliverEdit,
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '详情',
                    isDisplay: $auth.isAdmin || $auth.DeliverDetail,
                    command: () => handleDetailItem(scope.row)
                  },
                  {
                    title: '重置密码',
                    isDisplay: $auth.isAdmin || $auth.DeliverResetPassword,
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
      width="500px"
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
  import { QueryItem, QuerySearchInput, TableOperate, SelectOption } from '@/common';
  import tableMixin from '@/container/table/table.mixin';
  import DeliverEdit from './deliver-edit';
  import DeliverDetail from './deliver-detail';
  import ResetPassword from './reset-password';
  export default {
    name: 'deliver',
    mixins: [tableMixin],
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
      'my-select-option': SelectOption,
      'deliver-edit': DeliverEdit,
      'deliver-detail': DeliverDetail,
      'reset-password': ResetPassword,
    },
    data() {
      return {
        rowIdentifier: "id",
        deliver_post: Constant.DELIVER_POST(),
        query_deliver_post: Constant.DELIVER_POST('value_key'),
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
        let queryStr = `${Config.api.operateDeliverExport}?time=${new Date().getTime()}`;
        for(let key in this.query){
          queryStr += `&${key}=${this.query[key]}`;
        }
        window.open(queryStr);
      },

      highlightRowClassName({ row, rowIndex }) {
        if (rowIndex % 2 == 0) {
          return "stripe-row";
        } else if (rowIndex % 2 != 0) {
          return "default-row";
        }
        return "";
      },
    }
  };
</script>

<style lang="scss" scoped>
  .td-item{
    &.link-item, .link-item{
      text-decoration: underline;
      //font-weight: bold;
      &:hover{
        cursor: pointer;
        //font-weight: bold;
        opacity: .7;
      }
    }
  }
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
