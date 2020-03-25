<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="商品名称"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">

      </el-row>
    </div>

    <div class="container-table">
      <div class="table-top">
        <div class="left"></div>
        <div class="right">
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
          <el-table-column label="商品编号/名称" prop="item_id" min-width="240">
            <template slot-scope="scope">
              {{ scope.row.item && scope.row.item.id }} / {{ scope.row.item && scope.row.item.title }}
            </template>
          </el-table-column>
          <el-table-column label="今日报价" prop="price_sale" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.item && DataHandle.returnPrice(scope.row.item.price_sale) }}
            </template>
          </el-table-column>
          <el-table-column label="折扣率" prop="discount" min-width="100">
            <template slot-scope="scope">
              {{ DataHandle.returnDiscount(scope.row.discount) }}%
            </template>
          </el-table-column>
          <el-table-column label="优惠价" prop="status" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.item && DataHandle.returnPrice(DataHandle.returnDiscount(scope.row.item.price_sale * scope.row.discount / 100)) }}
            </template>
          </el-table-column>
          <el-table-column label="总库存" prop="item_stock" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.item && scope.row.item.item_stock }}
            </template>
          </el-table-column>
          <el-table-column label="已售数量" prop="sale_already" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.item && scope.row.item.sale_already }}
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="updated" min-width="160">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[]"
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
      title="新增县域定价"
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      width="1200px"
      append-to-body
    >
      <city-price-add
        v-if="dialog.visible"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Select, Option, Pagination, Table, TableColumn, Dialog, MessageBox, Tag} from 'element-ui';
  import {SelectOption, QueryItem, QuerySearchInput, TableOperate} from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import CityPriceAdd from './city-price-add';
  export default {
    name: 'city',
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
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'query-search-input': QuerySearchInput,
      'city-price-add': CityPriceAdd,
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
      }
    },
    created() {
      documentTitle('营销策略 - 县域定价');
      this.DataHandle = DataHandle;
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.cityPriceQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          province_code: this.$province.code,
          display_class_id: '',
          system_class_code: '',
          discount: '',
          update_date: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      changeQuery() {

      },

      resetQuery() {

      },

      changePage() {
        this.cityPriceQuery();
      },

      changePageSize() {
        this.initQuery();
        this.cityPriceQuery();
      },

      handleAddItem() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          item: null
        }
      },

      handleSubmitEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
        this.cityPriceQuery();
      },

      handleCancelEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
      },

      async cityPriceQuery() {
        let res = await Http.get(Config.api.bussinessMarketingStrategyCityQuery, this.$data.query);
        if (res.code !== 0) return;
        this.$data.list = res.data || { items: [] };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
