<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :xl="7" :lg="7" :span="10">
          <my-query-item label="可售日期">
            <el-date-picker
              size="small"
              v-model="query.available_date"
              value-format="yyyy-MM-dd"
              @change="changeQuery"
              style="width: 100%;"
              placeholder="配送日期"
              :clearable="false"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="7" :lg="7" :span="10">
          <my-query-item label="创建日期">
            <el-date-picker
              size="small"
              v-model="query.picker_value"
              type="daterange"
              align="left"
              value-format="yyyy-MM-dd"
              unlink-panels
              :picker-options="fixDateOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changePicker"
              style="width: 100%;"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="10" :lg="10" :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="入库单号/商品编号/名称"
              clearable
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" class="mt-16">
        <el-col :xl="7" :lg="7" :span="10">
          <my-query-item label="调出仓">
            <select-storehouse clearable size="small" v-model="query.src_storehouse_id" @change="changeQuery"/>
          </my-query-item>
        </el-col>
        <el-col :xl="7" :lg="7" :span="10">
          <my-query-item label="调入仓">
            <select-storehouse clearable size="small" v-model="query.tar_storehouse_id" @change="changeQuery"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="query.status" @change="changeQuery" :tab-panes="statusOptions"/>
        </div>
        <div class="right" v-if="$auth.isAdmin || $auth.ItemSupDistributePlanAdd">
          <el-button @click="handleAddItem" size="mini" type="primary">新增</el-button>
        </div>
      </div>

      <div @mousemove="handleTableMouseMove" class="table-conter">
        <el-table
          class="list-table my-table-float"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          highlight-current-row="highlight-current-row"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column label="调拨计划单" prop="creator_id" min-width="200">
            <template slot-scope="scope">
              <div
                class="td-item link-item position-relative"
                @click.prevent="handleDetailItem(scope.row)"
              >
                {{ scope.row.code }}
                <span class="icon-count" v-if="scope.row.distribute_order_num > 0">
                  {{ scope.row.distribute_order_num }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="调出仓" prop="src_storehouse_id" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.src_storehouse && scope.row.src_storehouse.title || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="调入仓" prop="tar_storehouse_id" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.tar_storehouse && scope.row.tar_storehouse.title || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="销售日期" prop="available_date" min-width="100">
          </el-table-column>
          <el-table-column label="预计到货时间" prop="estimate_arrive_at" min-width="200">
          </el-table-column>
<!--          <el-table-column label="生效时间" prop="step_prices_updated" min-width="100">-->
<!--            <template slot-scope="scope">-->
<!--              <div>{{ typeof scope.row.step_prices_updated === 'string' ? scope.row.step_prices_updated.substring(0, 10) : '-' }}</div>-->
<!--              <div>{{ typeof scope.row.step_prices_updated === 'string' ? scope.row.step_prices_updated.substring(11) : '-' }}</div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="状态" prop="status" min-width="100">
            <template slot-scope="scope">
              <el-tag size="small" :type="distribulte_plan_status_type[scope.row.status]" disable-transitions>
                {{ distribulte_plan_status[scope.row.status] }}
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
                    title: '修改',
                    isDisplay: scope.row.status === 'init' && ($auth.isAdmin || $auth.ItemSupDistributePlanModify),
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '审核',
                    isDisplay: scope.row.status === 'init' && ($auth.isAdmin || $auth.ItemSupDistributePlanAudit),
                    command: () => handleAuditItem(scope.row)
                  },
                  {
                    title: '生成调拨单',
                    isDisplay: scope.row.status === 'audit_success' && ($auth.isAdmin || $auth.ItemSupDistributeWaybillAdd),
                    command: () => handleAddDistribute(scope.row)
                  },
                  {
                    title: '关闭',
                    isDisplay: scope.row.status !== 'closed' && scope.row.status !== 'audit_fail' && ($auth.isAdmin || $auth.ItemSupDistributePlanClose),
                    command: () => handleCloseItem(scope.row.id)
                  },
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
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
    </div>

    <el-dialog
      title="调拨计划审核"
      :visible="audit.visible"
      width="600px"
      :before-close="handleCancel"
    >
      <distribute-plan-audit
        v-if="audit.visible"
        :item="audit.item"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </el-dialog>

    <add-edit-layout
      :is-show="dialog.visible"
      :title="`${dialog.type === 'add' ? '新增' : '修改'}调拨计划`"
      :before-close="handleCancel"
    >
      <distribute-plan-edit
        v-if="dialog.visible"
        :type="dialog.type"
        :item="dialog.item"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </add-edit-layout>
    <el-dialog
      :title="'调拨计划 - ' + detail.item.code + ' 详情'"
      :visible.sync="detail.visible"
      width="800px"
    >
      <distribute-plan-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
    <add-edit-layout
      :is-show="distribute.visible"
      title="生成调拨单"
      :before-close="handleCancel"
    >
      <distribute-waybill-edit
        v-if="distribute.visible"
        :type="distribute.type"
        :item="distribute.item"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Select, Option, Pagination, Table, TableColumn, Dialog, DatePicker, Tag} from 'element-ui';
  import {SelectOption, QueryItem, QuerySearchInput, TableOperate} from '@/common';
  import {SelectStorehouse} from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import queryTabs from '@/share/layout/QueryTabs';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import DistributePlanAudit from './distribute-plan-audit';
  import DistributePlanEdit from './distribute-plan-edit';
  import DistributePlanDetail from './distribute-plan-detail';
  import DistributeWaybillEdit from './distribute-waybill-edit';
  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-date-picker': DatePicker,
      'el-pagination': Pagination,
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'select-storehouse': SelectStorehouse,
      'query-search-input': QuerySearchInput,
      'query-tabs': queryTabs,
      'distribute-plan-audit': DistributePlanAudit,
      'distribute-plan-edit': DistributePlanEdit,
      'distribute-plan-detail': DistributePlanDetail,
      'distribute-waybill-edit': DistributeWaybillEdit,
    },
    data() {
      return {
        statusOptions: {'全部': '', ...Constant.DISTRIBUTE_PLAN_STATUS('value_key')}, // 状态查询条件
        distribulte_plan_status: Constant.DISTRIBUTE_PLAN_STATUS(), // 调拨计划列表状态
        distribulte_plan_status_type: Constant.DISTRIBUTE_PLAN_STATUS_TYPE,
        query: {},
        list: {
          items: []
        },
        // 编辑调拨计划弹层
        dialog: {
          visible: false,
          type: 'add',
          item: null
        },
        // 详情弹层
        detail: {
          visible: false,
          item: {}
        },
        audit: {
          visible: false,
          item: {},
        },
        // 生成调拨单弹层
        distribute: {
          visible: false,
          type: 'add',
          item: null,
        },
      }
    },
    created() {
      documentTitle('调拨 - 调拨计划');
      this.DataHandle = DataHandle;
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.distributePlanQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          available_date: DataHandle.formatDate(new Date(), 'yyyy-MM-dd'),
          src_storehouse_id: '', // 调出仓
          tar_storehouse_id: '', // 调入仓
          status: '',
          condition: '',
          picker_value: null,
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.distributePlanQuery();
      },

      resetQuery() {
        this.initQuery();
        this.distributePlanQuery();
      },

      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.$data.query = this.query;
        this.distributePlanQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.distributePlanQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.distributePlanQuery();
      },

      handleAddItem() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          item: null,
        }
      },

      async handleDetailItem(item) {
        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          console.log('res.data: ', res.data);
          this.$data.detail = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleModifyItem(item) {

        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.dialog = {
            visible: true,
            type: 'modify',
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleAddDistribute(item) {
        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.distribute = {
            visible: true,
            type: 'add',
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleSubmit() {
        this.handleCancel();
        this.distributePlanQuery();
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化调拨计划编辑弹层
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
        // 初始化调拨单生成弹层
        this.$data.distribute = {
          visible: false,
          type: 'add',
          item: null,
        };
        // 初始化审核弹层
        this.$data.audit = {
          visible: false,
          item: {},
        };
      },

      handleAuditItem(item) {
        this.$data.audit = {
          visible: true,
          item: item
        };
      },

      handleCloseItem(id) {
        this.$messageBox.confirm('确认关闭该调拨计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.itemSupDistributePlanClose, {
            ids: [id]
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '调拨计划关闭成功', type: 'success'});
            this.distributePlanQuery();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async distributePlanQuery() {
        let query = {...this.$data.query};
        delete query.picker_value;
        let res = await Http.get(Config.api.itemSupDistributePlanQuery, query);
        if (res.code !== 0) return;
        this.$data.list = res.data || { items: [] };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .mt-16 {
    margin-top: 16px;
  }
  .position-relative {
    position: relative;
  }

  .icon-count {
    position: absolute;
    font-size: 12px;
    display: inline-block;
    padding: 0 5px;
    line-height: 16px;
    left: 110px;
    top: 0px;
    background-color: #00ADE7;
    border-radius: 50%;
    color: white;
    text-decoration: none;
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
