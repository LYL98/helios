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
              placeholder="请选择日期"
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
              placeholder="调拨单号"
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
          <el-table-column label="调拨单" prop="creator_id" min-width="200">
            <template slot-scope="scope">
              <div
                :class="`td-item link-item`"
                @click.prevent="handleDetailItem(scope.row)"
              >{{ scope.row.code }}</div>
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
          <el-table-column label="状态" prop="status" min-width="100">
            <template slot-scope="scope">
              <el-tag size="small" :type="distribulte_waybill_status_type[scope.row.status]" disable-transitions>
                {{ distribulte_waybill_status[scope.row.status] }}
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
                    isDisplay: (scope.row.status === 'init' || scope.row.status === 'wait_delivery') && ($auth.isAdmin || $auth.ItemSupDistributeWaybillModify),
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '关闭',
                    isDisplay: (scope.row.status === 'init' || scope.row.status === 'wait_delivery') && ($auth.isAdmin || $auth.ItemSupDistributeWaybillClose),
                    command: () => handleCloseItem(scope.row.id)
                  },
                  {
                    title: '司机轨迹',
                    isDisplay: scope.row.status === 'deliveried' && ($auth.isAdmin || $auth.ItemSupDistributeWaybillLocation),
                    command: () => handleLocationItem(scope.row)
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
    <add-edit-layout
      :is-show="dialog.visible"
      title="修改调拨单"
      :before-close="handleCancel"
    >
      <distribute-waybill-edit
        v-if="dialog.visible"
        :type="dialog.type"
        :item="dialog.item"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </add-edit-layout>
    <el-dialog
      :title="'调拨单 - ' + detail.item.code + ' 详情'"
      :visible.sync="detail.visible"
      width="800px"
    >
      <distribute-waybill-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
    <el-dialog
      title="司机轨迹"
      :visible.sync="location.visible"
      width="800px"
    >
      <el-location
        v-if="location.visible"
        :center="location.item.last_geo"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Select, Option, Pagination, Table, TableColumn, Dialog, DatePicker, Tag} from 'element-ui';
  import {SelectOption, QueryItem, QuerySearchInput, TableOperate, Location} from '@/common';
  import {SelectStorehouse} from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import queryTabs from '@/share/layout/QueryTabs';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import DistributeWaybillDetail from './distribute-waybill-detail';
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
      'el-location': Location,
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'select-storehouse': SelectStorehouse,
      'query-search-input': QuerySearchInput,
      'query-tabs': queryTabs,
      'distribute-waybill-detail': DistributeWaybillDetail,
      'distribute-waybill-edit': DistributeWaybillEdit,
    },
    data() {
      return {
        statusOptions: {'全部': '', ...Constant.DISTRIBUTE_WAYBILL_STATUS('value_key')}, // 状态查询条件
        distribulte_waybill_status: Constant.DISTRIBUTE_WAYBILL_STATUS(), // 调拨计划列表状态
        distribulte_waybill_status_type: Constant.DISTRIBUTE_WAYBILL_STATUS_TYPE,
        query: {},
        list: {
          items: []
        },
        // 编辑调拨单
        dialog: {
          visible: false,
          type: 'modify',
          item: null
        },
        // 详情弹层
        detail: {
          visible: false,
          item: {}
        },

        location: {
          visible: false,
          item: {}
        },
      }
    },
    created() {
      documentTitle('调拨 - 调拨单');
      this.DataHandle = DataHandle;
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.distributeWaybillQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          available_date: '',
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
        this.distributeWaybillQuery();
      },

      resetQuery() {
        this.initQuery();
        this.distributeWaybillQuery();
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
        this.distributeWaybillQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.distributeWaybillQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.distributeWaybillQuery();
      },

      async handleDetailItem(item) {
        let res = await Http.get(Config.api.itemSupDistributeWaybillDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.detail = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleModifyItem(item) {
        let res = await Http.get(Config.api.itemSupDistributeWaybillDetail, {id: item.id});
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

      async handleLocationItem(item) {

        let res = await Http.get(Config.api.itemSupDistributeWaybillDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.location = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleSubmit() {
        this.handleCancel();
        this.distributeWaybillQuery();
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化调拨计划编辑弹层
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
      },


      handleCloseItem(id) {
        this.$messageBox.confirm('确认关闭该调拨单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.itemSupDistributeWaybillClose, {
            id: id
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '调拨单关闭成功', type: 'success'});
            this.distributeWaybillQuery();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async distributeWaybillQuery() {
        let query = {...this.$data.query};
        delete query.picker_value;
        let res = await Http.get(Config.api.itemSupDistributeWaybillQuery, query);
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
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
