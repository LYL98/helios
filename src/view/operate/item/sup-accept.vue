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
          <query-tabs v-model="query.is_confirm" @change="changeQuery" :tab-panes="{'全部': '', '待确认': '0', '已确认': '1', }"/>
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
          <el-table-column label="收货单号" prop="code" min-width="140">
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
          <el-table-column label="收货数量" prop="num" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.num > 0">
                {{ scope.row.num }}件
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="is_confirm" min-width="100">
            <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.is_confirm ? 'info' : 'primary'" disable-transitions>
                {{ scope.row.is_confirm ? '已确认' : '待确认' }}
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
                    title: '确认',
                    isDisplay: !scope.row.is_confirm && ($auth.isAdmin || $auth.OperateItemSupAcceptConfirm),
                    command: () => handleConfirmItem(scope.row)
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
      title="收货单详情"
      :visible.sync="detail.visible"
      width="900px"
    >
      <sup-accept-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Pagination, Table, TableColumn, Dialog, Tag} from 'element-ui';
  import {QueryItem, QuerySearchInput, TableOperate, SelectSystemClass} from '@/common';
  import { GlobalStorehouse } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import queryTabs from '@/share/layout/QueryTabs';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import SupAcceptDetail from './sup-accept-detail';
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
      'my-select-system-class': SelectSystemClass,
      'query-search-input': QuerySearchInput,
      'query-tabs': queryTabs,
      'global-storehouse': GlobalStorehouse,
      'sup-accept-detail': SupAcceptDetail,
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
        }
      }
    },
    created() {
      documentTitle('场地商品 - 收货单');
      this.DataHandle = DataHandle;
      // 判断是否具有促销活动的权限
      this.initQuery();
      // this.supAcceptQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          storehouse_id: '',
          system_class_codes: [],
          is_confirm: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      storehouseInit(item){
        this.$data.query.storehouse_id = item.id;
        this.supAcceptQuery();
      },

      changeSystemClassCodes(v, d) {
        this.$data.query.system_class_codes = v;
        this.changeQuery();
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.supAcceptQuery();
      },

      resetQuery() {
        this.initQuery();
        this.supAcceptQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.supAcceptQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.supAcceptQuery();
      },

      handleConfirmItem(item) {
        this.$messageBox.confirm('确认该收货单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.operateItemSupAcceptConfirm, {
            id: item.id
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '确认收货单成功', type: 'success'});
            this.supAcceptQuery();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async handleDetailItem(item) {
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

      async supAcceptQuery() {
        let query = {...this.$data.query};
        if (Array.isArray(query.system_class_codes) && query.system_class_codes.length > 0) {
          query.system_class_code = query.system_class_codes[query.system_class_codes.length - 1];
        }
        let res = await Http.get(Config.api.operateItemSupAcceptQuery, query);
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
