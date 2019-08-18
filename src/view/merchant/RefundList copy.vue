<template>
  <div>
    <div class="query">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="所在仓">
            <my-select-city
              size="small"
              :isUseToQuery="true"
              clearable
              v-model="query.city_code"
              :provinceCode="query.province_code"
              @change="selectMerchantByCondition"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="10" :lg="14" :span="14">
          <my-query-item label="搜索">
            <div style="display: flex">
              <el-input
                size="small"
                placeholder="门店名称、用户名称、电话"
                v-model="query.condition"
                class="query-item-input"
                clearable
                @keyup.enter.native="selectMerchantByCondition"
                @clear="selectMerchantByCondition"
                ref="condition"
              />
              <el-button type="primary" size="small" @click="selectMerchantByCondition" icon="el-icon-search" style="margin-left: 4px;"></el-button>
              <el-button type="primary" size="small" class="query-item-reset" plain @click="clearQueryCondition">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div class="operate" v-if="auth.isAdmin || auth.MerchantRefundLogQuery">
      <el-button
        size="mini"
        v-if="auth.isAdmin || auth.MerchantRefundLogQuery"
        type="primary"
        @click="() => { showLogDialog = true }"
      >退框变更记录</el-button>
    </div>

    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem.items"
        :row-class-name="highlightRowClassName"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
        </el-table-column>
        <el-table-column label="门店名称" prop="title" min-width="220">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所在仓" min-width="200" prop="city.title">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city && scope.row.city.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已退框数" min-width="100" prop="frame_num_real">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_num_real || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余框数" min-width="100" prop="frame_num">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_num || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已退金额" min-width="110" prop="frame_amount_real">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_amount_real == 0 ? '' : '￥' }}{{ scope.row.frame_amount_real == 0 ? '-' : returnPrice(scope.row.frame_amount_real) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余金额" min-width="110" prop="frame_amount">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_amount == 0 ? '' : '￥' }}{{ scope.row.frame_amount == 0 ? '-' : returnPrice(scope.row.frame_amount) }}
            </div>
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
                isDisplay: auth.isAdmin || auth.MerchantRefundEdit,
                command: () => handleClickEdit(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页标签 -->
    <div class="footer">
      <div class="table-pagination" v-if="listItem.num > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="listItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>

    <el-dialog title="退框信息修改" :close-on-click-modal="false" :visible.sync="showEditDialog" width="600px" append-to-body>
      <refund-edit
        v-if="showEditDialog"
        :store="editStoreItem"
        :callback="listQuery"
        :closeDialog="() => { showEditDialog = false}"
      >
      </refund-edit>
    </el-dialog>

    <el-dialog title="退框变更记录" :visible.sync="showLogDialog" width="1100px" append-to-body>
      <refund-log
        v-if="showLogDialog"
        :closeDialog="() => { showLogDialog = false}"
      />
    </el-dialog>

  </div>
</template>

<script>
  import { Row, Col, Dialog, Input, Radio, Button, DatePicker, Table, TableColumn, Pagination, Form, FormItem, Message } from 'element-ui';
  import { QueryItem, TableOperate } from '@/common';
  import { SelectCity } from '@/container';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import RefundLog from './RefundLog';
  import RefundEdit from './RefundEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "ReturnFrameList",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-radio': Radio,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-form': Form,
      'el-form-item': FormItem,
      'my-query-item': QueryItem,
      'my-select-city': SelectCity,
      'refund-log': RefundLog,
      'refund-edit': RefundEdit,
      'my-table-operate': TableOperate,
    },
    mixins: [tableMixin, viewMixin],
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
        query: {
          city_code: '',
          title: '',
          userinfo: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        listItem: [],
        editStoreItem: {
          radio: '1'
        },
        showEditDialog: false,
        showLogDialog: false,
      }
    },
    created() {
      documentTitle('门店 - 门店框信息');
      this.$data.query.province_code = this.province.code;
      this.listQuery();

      if (!this.auth.isAdmin && !this.auth.MerchantRefundLogQuery) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    methods: {

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.listQuery();
      },

      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.listQuery();
      },

      // 查询列表
      selectMerchantByCondition() {
        let { query, province } = this;
        query.province_code = province.code; // 当前省份code
        query.page = 1;
        this.$data.query = query;
        this.listQuery();
      },

      // 重置
      clearQueryCondition(){
        this.$data.query = {
          province_code: this.province.code,
          city_code: '',
          title: '',
          userinfo: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
        this.$refs['condition'].currentValue = '';
        this.listQuery();
      },

      // 查询退框列表信息
      async listQuery() {
        let that = this;
        let {query} = that;
        // get merchant list data
        let res = await Http.get(Config.api.storeQuery, query);
        // 如果返回结果正确，则将该数据 赋值给 dataItem；
        if (res.code === 0) {
          that.$data.listItem = res.data;
          window.scrollTo(0, 0);
        } else { // 如果返回值不正确，则提示弹窗
          Message.warning(res.message);
        }
      },

      // 修改门店的退框信息
      handleClickEdit(item) {
        this.$data.showEditDialog = true;
        this.$data.editStoreItem = Object.assign({}, this.$data.editStoreItem, item);

      },

    }
  }
</script>

<style lang="scss" scoped>
  .form-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

</style>
