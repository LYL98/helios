<template>
  <sub-menu>
    <template slot="left-query">
      <select-storehouse
        style="width: 120px"
        size="small"
        borderless
        v-model="query.storehouse_id"
        @change="changeQuery"
        isAuth
        @initCallBack="storehouseInit"
      />
    </template>
    <div class="container-query">
      <el-row :gutter="32">
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
<!--      <div class="table-top">-->
<!--        <div class="left">-->
<!--        </div>-->
<!--      </div>-->

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
          <el-table-column label="批次" prop="code" min-width="140">
            <template slot-scope="scope">
              <div
                :class="`td-item link-item`"
                @click.prevent="handleDetailItem(scope.row)"
              >{{ scope.row.code }}</div>
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
              <span v-if="scope.row.num > 0">
                {{ scope.row.num }}件
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '调拨',
                    isDisplay: ($auth.isAdmin || $auth.OperateItemSupStockDistribute),
                    command: () => handleDistributeItem(scope.row)
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
      :title="'收货单 - ' + detail.item.code + ' 详情'"
      :visible.sync="detail.visible"
      width="800px"
    >
      <sup-stock-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Pagination, Table, TableColumn, Dialog, Tag} from 'element-ui';
  import {QueryItem, QuerySearchInput, TableOperate} from '@/common';
  import { SelectStorehouse } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import SupStockDetail from './sup-stock-detail';
  import SupStockDistribute from './sup-stock-distribute';
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
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'add-edit-layout': AddEditLayout,
      'query-search-input': QuerySearchInput,
      'select-storehouse': SelectStorehouse,
      'sup-stock-detail': SupStockDetail,
      'sup-stock-distribute': SupStockDistribute,
    },
    data() {
      return {
        query: {},
        list: {
          items: []
        },
        detail: {
          visible: false,
          item: {}
        },
        distribute: {
          visible: false,
          items: {}
        }
      }
    },
    created() {
      documentTitle('场地商品 - 场地库存');
      this.DataHandle = DataHandle;
      // 判断是否具有促销活动的权限
      this.initQuery();
      // this.supAcceptQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          storehouse_id: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      storehouseInit(dataItem){
        let d = dataItem.filter(item => item.province_code === this.$province.code);
        if(d.length > 0){
          this.$data.query.storehouse_id = d[0].id;
        }else{
          this.$data.query.storehouse_id = dataItem[0].id;
        }
        this.supStockQuery();
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.supStockQuery();
      },

      resetQuery() {
        this.initQuery();
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

        let res = await Http.get(Config.api.operateItemSupStockGetDistributes, {
          src_storehouse_id: this.$data.query.storehouse_id,
          item_code: item.p_item.code
        });

        if (res.code !== 0 || !Array.isArray(res.data)) {
          return;
        }

        if (res.data.length === 0) {
          this.$message({title: '提示', message: '该商品没有关联的调拨单！', type: 'warning'});
          return;
        }

        // 如果只关联了一个调拨单，则直接调拨
        if (res.data.length == 1) {
          const { id, num } = res.data[0];
          this.$messageBox.confirm('是否确认调拨?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let res = await Http.post(Config.api.operateItemSupStockDistribute, {
              batch_code: item.code,
              distribute_id: id,
              need_allocate_num: num
            });
            if(res.code === 0){
              this.$message({ title: '提示', message: '调拨成功', type: 'success'});
              this.supStockQuery();
            }else{
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
      },

      async handleDetailItem(item) {
        return;
        let res = await Http.get(Config.api.operateItemSupAcceptDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.detail = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async supStockQuery() {
        let query = {...this.$data.query};
        let res = await Http.get(Config.api.operateItemSupStockQuery, query);
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
