<template>
  <sub-menu>
    <template slot="left-query">
      <global-storehouse
        style="width: 120px"
        size="small"
        v-model="query.storehouse_id"
        @change="changeQuery"
        @initCallBack="storehouseInit"
      />
    </template>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :xl="7" :lg="7" :span="7">
          <my-query-item label="科学分类">
            <my-select-system-class
              clearable
              :value="query.system_class_codes"
              size="small"
              @change="changeSystemClassCodes"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="7" :lg="7" :span="7">
          <my-query-item label="操作类型">
            <el-select clearable v-model="query.opt_type" placeholder="操作类型" size="small" style="width: 100%" @change="changeQuery">
              <el-option value="distribute" label="调拨" />
              <el-option value="allocate" label="分配" />
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :xl="10" :lg="10" :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="收货单号/商品编号/名称"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div class="table-top">
        <div class="left">
          <el-button
            size="mini"
            plain
            type="primary"
            :disabled="selectedList.length <= 0"
            v-if="$auth.isAdmin || $auth.OperateItemSupStockWarehousing"
            @click="handleWarehousingItems(selectedList)"
          >批量入库
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            plain-->
<!--            type="primary"-->
<!--            :disabled="selectedList.length <= 0"-->
<!--            v-if="$auth.isAdmin || $auth.OperateItemSupStockAllocate"-->
<!--            @click="handleAllocateItems(selectedList)"-->
<!--          >批量分配-->
<!--          </el-button>-->
        </div>
        <div class="right">
          <el-button
            @click="handleChangeRecord"
            size="mini"
            type="primary"
            v-if="$auth.isAdmin || $auth.OperateItemSupStockRecord"
          >场地变动记录</el-button>
        </div>
      </div>

      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          highlight-current-row="highlight-current-row"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="$auth.isAdmin || $auth.OperateItemSupStockWarehousing || $auth.OperateItemSupStockAllocate"
            align="center"
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column label="批次" prop="code" min-width="160">
            <template slot-scope="scope">
              <div
                class="td-item link-item position-relative"
                @click.prevent="handleDetailItem(scope.row)"
              >
                {{ scope.row.batch_code }}
                <span class="icon-marker warning" v-if="scope.row.unqualified">不合格</span>
                <span class="icon-marker primary" v-if="!scope.row.unqualified && ['sale_ac_edit', 'dt_ac_edit'].includes(scope.row.out_type)">打货</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品编号/名称" prop="p_item" min-width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.p_item">
                {{ scope.row.p_item.code || '' }} / {{ scope.row.p_item.title }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="场地库存" prop="num" min-width="100">
            <template slot-scope="scope">
              <span v-if="!!scope.row.num">
                {{ scope.row.num }}件
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                :list="[
                  {
                    title: '分配',
                    isDisplay: ($auth.isAdmin || $auth.OperateItemSupStockAllocate),
                    command: () => handleAllocateItems([scope.row])
                  },
                  {
                    title: '入库',
                    isDisplay: ($auth.isAdmin || $auth.OperateItemSupStockWarehousing),
                    command: () => handleWarehousingItems([scope.row])
                  },
                  {
                    title: '调拨',
                    isDisplay: ($auth.isAdmin || $auth.OperateItemSupStockDistribute),
                    command: () => handleDistributeItem(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer">
        <div class="left">
          <el-button
            size="mini"
            plain
            type="primary"
            :disabled="selectedList.length <= 0"
            v-if="$auth.isAdmin || $auth.OperateItemSupStockWarehousing"
            @click="handleWarehousingItems(selectedList)"
          >批量入库
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            plain-->
<!--            type="primary"-->
<!--            :disabled="selectedList.length <= 0"-->
<!--            v-if="$auth.isAdmin || $auth.OperateItemSupStockAllocate"-->
<!--            @click="handleAllocateItems(selectedList)"-->
<!--          >批量分配-->
<!--          </el-button>-->
        </div>
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
      :is-show="distribute.visible"
      title="调拨"
      :before-close="handleCancel"
    >
      <sup-stock-distribute
        v-if="distribute.visible"
        :item="distribute.item"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </add-edit-layout>
    <el-dialog
      title="场地库存详情"
      :visible.sync="detail.visible"
      width="900px"
    >
      <sup-stock-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
    <el-dialog
      title="场地变动记录"
      :visible.sync="record.visible"
      width="1000px"
    >
      <sup-stock-record
        v-if="record.visible"
        :storehouse_id="query.storehouse_id"
      />
    </el-dialog>
    <el-dialog
      title="入库"
      :visible="warehousing.visible"
      width="1000px"
      :before-close="handleCancel"
    >
      <sup-stock-warehousing
        v-if="warehousing.visible"
        :items="warehousing.items"
        :storehouse_id="query.storehouse_id"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Pagination, Table, TableColumn, Dialog, Tag, Select, Option} from 'element-ui';
  import {QueryItem, QuerySearchInput, TableOperate, SelectSystemClass} from '@/common';
  import {GlobalStorehouse} from '@/component';
  import {Http, Config, Constant, DataHandle} from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import SupStockDetail from './sup-stock-detail';
  import SupStockDistribute from './sup-stock-distribute';
  import SupStockRecord from './sup-stock-record';
  import SupStockWarehousing from './sup-stock-warehousing';

  export default {
    name: 'sup-accept',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'el-select': Select,
      'el-option': Option,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'add-edit-layout': AddEditLayout,
      'my-select-system-class': SelectSystemClass,
      'query-search-input': QuerySearchInput,
      'global-storehouse': GlobalStorehouse,
      'sup-stock-detail': SupStockDetail,
      'sup-stock-distribute': SupStockDistribute,
      'sup-stock-record': SupStockRecord,
      'sup-stock-warehousing': SupStockWarehousing,
    },
    data() {
      return {
        query: {},
        list: {
          items: []
        },
        selectedList: [],

        // 调拨
        distribute: {
          visible: false,
          items: {}
        },

        // 详情
        detail: {
          visible: false,
          item: {}
        },

        // 场地变动记录
        record: {
          visible: false,
        },

        warehousing: {
          visible: false,
          items: []
        }
      }
    },
    created() {
      documentTitle('场地商品 - 场地库存');
      this.DataHandle = DataHandle;
      // 判断是否具有促销活动的权限
      this.initQuery();
    },
    methods: {

      handleSelectionChange(val) {
        this.$data.selectedList = val;
      },

      handleWarehousingItems(items) {

        this.$data.warehousing = {
          visible: true,
          items: items
        };
      },

      async handleAllocateItems(items) {
        let formData = {
          storehouse_id: this.$data.query.storehouse_id,
          batch_codes: items.map(item => item.batch_code)
        };
        this.$loading({isWhole: true});
        let res = await Http.post(Config.api.operateItemSupStockAllocate, formData);
        this.$loading({isWhole: false});
        if (res.code === 0) {
          this.$message({message: '分配成功', type: 'success'});
          this.supStockQuery();
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      initQuery() {
        this.$data.query = {
          storehouse_id: '',
          system_class_codes: [],
          opt_type: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      storehouseInit(item) {
        this.$data.query.storehouse_id = item.id;
        if (!item.id) return;
        this.supStockQuery();
      },

      changeSystemClassCodes(v, d) {
        this.$data.query.system_class_codes = v;
        this.changeQuery();
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.supStockQuery();
      },

      resetQuery() {
        let storehouse_id = this.$data.query.storehouse_id;
        this.initQuery();
        this.$data.query.storehouse_id = storehouse_id;
        this.supStockQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.supStockQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.supStockQuery();
      },

      async handleDistributeItem(item) {

        this.$loading({isWhole: true});
        let res = await Http.get(Config.api.operateItemSupStockGetDistributes, {
          src_storehouse_id: this.$data.query.storehouse_id,
          item_code: item.p_item.code
        });
        this.$loading({isWhole: false});

        if (res.code !== 0 || !Array.isArray(res.data)) {
          return;
        }

        if (res.data.length === 0) {
          this.$message({title: '提示', message: '该商品没有关联的调拨单！', type: 'warning'});
          return;
        }

        // 如果只关联了一个调拨单，则直接调拨
        if (res.data.length === 1) {
          const {id, plan_num, dist_num} = res.data[0];
          this.$messageBox.confirm('是否确认调拨?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let res = await Http.post(Config.api.operateItemSupStockDistribute, {
              batch_code: item.batch_code,
              distribute_id: id,
              need_allocate_num: plan_num - dist_num > item.num ? item.num : plan_num - dist_num
            });
            if (res.code === 0) {
              this.$message({title: '提示', message: '调拨成功', type: 'success'});
              this.supStockQuery();
            } else {
              this.$message({title: '提示', message: res.message, type: 'error'});
            }
          }).catch(() => {
            // console.log('取消');
          });

          return;
        }

        this.$data.distribute = {
          visible: true,
          item: {
            ...item,
            distributes: res.data
          },
        };

      },

      handleSubmit() {
        this.handleCancel();
        this.supStockQuery();
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化调拨单生成弹层
        this.$data.distribute = {
          visible: false,
          item: null,
        };

        this.$data.warehousing = {
          visible: false,
          items: []
        }
      },

      handleChangeRecord() {
        this.$data.record.visible = true;
      },

      async handleDetailItem(item) {
        this.$data.detail = {
          visible: true,
          item: item,
        };
      },

      async supStockQuery() {
        let query = {...this.$data.query};
        if (Array.isArray(query.system_class_codes) && query.system_class_codes.length > 0) {
          query.system_class_code = query.system_class_codes[query.system_class_codes.length - 1];
        }
        delete query.system_class_codes;
        let res = await Http.get(Config.api.operateItemSupStockQuery, query);
        if (res.code !== 0) return;
        this.$data.list = res.data || {items: []};
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

  .icon-marker {
    position: absolute;
    font-size: 12px;
    display: inline-block;
    padding: 0 10px;
    line-height: 18px;
    left: 110px;
    top: 0px;
    border-radius: 10px;
    color: white;
    text-decoration: none;

    &.primary {
      background-color: #00ADE7;
    }
    &.warning {
      background-color: #DCA450;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';

</style>
