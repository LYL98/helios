<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province v-model="query.province_code" type="select" @change="changeProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="县域">
            <select-city
              size="small"
              :disabled="!query.province_code"
              clearable
              showAll
              v-model="query.city_id"
              :provinceCode="query.province_code"
              @change="changeQuery"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="门店名称"
              v-model="query.condition"
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
        </div>
        <div class="right" v-if="$auth.isAdmin || $auth.itemSupDistributePlanAdd">
          <el-button size="mini" type="primary" plain>导出意向客户</el-button>
          <el-button @click="handleAddItem" size="mini" type="primary">新增</el-button>
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
        >
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column label="门店名称" min-width="150" prop="title">
            <template slot-scope="scope">
              <span v-if="auth.isAdmin || auth.MerchantAuditDetail">
                <a :class="`title ${isEllipsis(scope.row)}`" href="javascript:void(0);"
                   @click.prevent="showDetail(scope.row)">
                  {{ scope.row.title }}
                </a>
              </span>
              <span v-else :class="isEllipsis(scope.row)">
                {{ scope.row.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="县域" min-width="80" prop="city">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">
                {{ scope.row.city && scope.row.city.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门店地址" prop="address" min-width="300">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '修改',
                    isDisplay: (auth.isAdmin || auth.MerchantStoreFreeze),
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '激活',
                    isDisplay: (auth.isAdmin || auth.MerchantStoreUnFreeze),
                    command: () => {}
                  },
                  {
                    title: '删除',
                    isDisplay: auth.isAdmin || auth.MerchantStoreDelete,
                    command: () => handleDeleteItem(scope.row)
                  }
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
      :title="`${dialog.type === 'add' ? '新增' : '修改'}意向客户`"
      :before-close="handleCancelEdit"
    >
      <merchant-edit
        v-if="dialog.visible"
        :type="dialog.type"
        :item="dialog.item"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </add-edit-layout>
    <el-dialog
      title="意向客户详情"
      :visible.sync="detail.visible"
      width="800px"
    >
      <intended-detail
        v-if="detail.visible"
        :item="detail.item"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {
    Row,
    Col,
    Button,
    Input,
    Select,
    Option,
    Pagination,
    Table,
    TableColumn,
    Dialog,
    DatePicker,
    Tag
  } from 'element-ui';
  import {QueryItem, QuerySearchInput, TableOperate, SelectCity} from '@/common';
  import {GlobalProvince} from '@/component';
  import {Http, Config, Constant, DataHandle} from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import queryTabs from '@/share/layout/QueryTabs';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import MerchantEdit from './merchant-edit';
  import IntendedDetail from './intended-detail';

  export default {
    name: 'intended',
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
      'el-pagination': Pagination,
      'add-edit-layout': AddEditLayout,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'select-city': SelectCity,
      'global-province': GlobalProvince,
      'query-search-input': QuerySearchInput,
      'query-tabs': queryTabs,
      'merchant-edit': MerchantEdit,
      'intended-detail': IntendedDetail,
    },
    data() {
      return {

        query: {},
        list: {
          items: []
        },
        dialog: {
          visible: true,
          type: 'add',
          item: null
        },
        detail: {
          visible: false,
          item: {}
        }
      }
    },
    created() {
      documentTitle('商户 - 意向客户');
      this.DataHandle = DataHandle;
      // 判断是否具有促销活动的权限
      this.initQuery();
      // this.intendedQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          province_code: '',
          city_id: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.intendedQuery();
      },

      resetQuery() {
        this.initQuery();
        this.intendedQuery();
      },

      //查询选择区域后
      changeProvince(data) {
        console.log('data: ', data);
        this.$data.query.city_id = '';
        this.$data.query.province_code = data.code;
        console.log('change province');
        this.changeQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.intendedQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.intendedQuery();
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
          this.$data.detail = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleModifyItem(item) {

        return;

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

      handleSubmitEdit() {
        this.handleCancelEdit();
        this.intendedQuery();
      },

      handleCancelEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
      },

      handleDeleteItem(id) {

        this.$messageBox.confirm('确认删除意向客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // let res = await Http.post(Config.api.itemSupDistributePlanClose, {
          //   ids: [id]
          // });
          // if (res.code === 0) {
          //   this.$message({title: '提示', message: '调拨计划关闭成功', type: 'success'});
          //   this.intendedQuery();
          // } else {
          //   this.$message({title: '提示', message: res.message, type: 'error'});
          // }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async intendedQuery() {
        let query = {...this.$data.query};
        let res = await Http.get(Config.api.storeQuery, query);
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

  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .title:hover {
    font-weight: 600;
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
