<template>
  <sub-menu>
    <template slot="left-query">
      <global-province @change="changeProvince" is-required/>
    </template>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :xl="7" :lg="7" :span="10">
          <my-query-item label="生效日期">
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
        <el-col :xl="7" :lg="7" :span="10">
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
              placeholder="商品编号/名称"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div class="table-top" v-if="$auth.isAdmin || $auth.MarketingStrategyStepAdd">
        <div class="left"></div>
        <div class="right">
          <el-button @click="handleAddItems" size="mini" type="primary">新增</el-button>
        </div>
      </div>

      <div class="mt-16 table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          highlight-current-row="highlight-current-row"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          :default-sort = "{prop: 'discount', order: ''}"
        >
          <el-table-column
            v-if="$auth.isAdmin || $auth.MarketingStrategyStepModify || $auth.MarketingStrategyStepDelete"
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
          <el-table-column label="商品编号/名称" prop="item_id" min-width="220">
            <template slot-scope="scope">
              <div class="my-td-item">
                {{ scope.row.code }} / {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="定价" prop="price_sale" min-width="100">
            <template slot-scope="scope">
              <div class="mt-td-item" v-if="!!scope.row.price_sale">
                ￥{{ DataHandle.returnPrice(scope.row.price_sale) }}
              </div>
              <div class="my-td-item" v-else>
                未报价
              </div>
            </template>
          </el-table-column>
          <el-table-column label="阶梯优惠" min-width="200">
            <template slot-scope="scope">
              <div v-if="Array.isArray(scope.row.step_prices) && scope.row.step_prices.length >= 1" class="line-height-18">
                <div v-for="(item, index) in scope.row.step_prices" :key="index">满{{item.num}}件，￥{{DataHandle.returnPrice(DataHandle.returnDiscount(scope.row.price_sale * item.discount / 100))}}</div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="step_prices_updated" min-width="100">
            <template slot-scope="scope">
              <div>{{ typeof scope.row.step_prices_updated === 'string' ? scope.row.step_prices_updated.substring(0, 10) : '-' }}</div>
              <div>{{ typeof scope.row.step_prices_updated === 'string' ? scope.row.step_prices_updated.substring(11) : '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="总库存" prop="item_stock" min-width="120">
            <template slot-scope="scope">
              <div class="my-td-item" v-if="!!scope.row.item_stock">
                {{ scope.row.item_stock }}件
              </div>
              <div class="my-td-item" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="已售数量" prop="sale_already" min-width="100">
            <template slot-scope="scope">
              <div class="my-td-item" v-if="!!scope.row.sale_already">
                {{ scope.row.sale_already }}件
              </div>
              <div class="my-td-item" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                :list="[
                  {
                    title: '修改',
                    isDisplay: $auth.isAdmin || $auth.MarketingStrategyStepModify,
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '删除',
                    isDisplay: $auth.isAdmin || $auth.MarketingStrategyStepDelete,
                    command: () => handleDeleteItem(scope.row)
                  },
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer">
        <div>
          <el-button size="mini" type="primary" :disabled="selectedList.length <= 0" @click="handleModifyItems" v-if="$auth.isAdmin || $auth.MarketingStrategyStepModify">批量修改</el-button>
          <el-button size="mini" type="primary" :disabled="selectedList.length <= 0" @click="handleDeleteItems" v-if="$auth.isAdmin || $auth.MarketingStrategyStepDelete">批量删除</el-button>
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
      :is-show="dialog.visible"
      :title="`${dialog.type === 'add' ? '新增' : '修改'}阶梯定价`"
      :before-close="handleCancelEdit"
    >
      <step-price-edit
        v-if="dialog.visible"
        :type="dialog.type"
        :items="dialog.items"
        :windowHeight="viewWindowHeight"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Select, Option, Pagination, Table, TableColumn, Dialog, DatePicker, Tag} from 'element-ui';
  import {SelectOption, SelectSystemClass, QueryItem, QuerySearchInput, TableOperate, SelectCity} from '@/common';
  import { GlobalProvince } from '@/component';
  import AddEditLayout from '@/share/layout/Layout';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import StepPriceEdit from './step-price-edit';
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
      'el-date-picker': DatePicker,
      'el-pagination': Pagination,
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-select-system-class': SelectSystemClass,
      'my-select-city': SelectCity,
      'my-table-operate': TableOperate,
      'query-search-input': QuerySearchInput,
      'step-price-edit': StepPriceEdit,
      'global-province': GlobalProvince
    },
    data() {
      return {
        query: {},
        list: {
          items: []
        },
        selectedList: [],
        dialog: {
          visible: false,
          type: 'add',
          items: []
        },
      }
    },
    created() {
      documentTitle('营销策略 - 阶梯定价');
      this.DataHandle = DataHandle;
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.stepPriceQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          has_step_price: 1, // 表示查询具有阶梯定价的商品
          is_on_sale: 1, // 已上架
          is_gift: 0, // 不是赠品
          province_code: this.$province.code,
          system_class_codes: [],
          sort: '',
          discount: '',
          condition: '',
          picker_value: null,
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.stepPriceQuery();
      },

      resetQuery() {
        this.initQuery();
        this.stepPriceQuery();
      },

      changeProvince(province) {
        this.$data.query.province_code = province.code;
        this.stepPriceQuery();
      },

      changePicker(value){
        if(value && value.length === 2){
          this.query.step_price_update_begin = value[0];
          this.query.step_price_update_end = value[1];
        }else{
          this.query.step_price_update_begin = '';
          this.query.step_price_update_end = '';
        }
        this.$data.query = this.query;
        this.stepPriceQuery();
      },

      changeSystemClassCodes(v, d) {
        this.$data.query.system_class_codes = v;
        this.stepPriceQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.stepPriceQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.stepPriceQuery();
      },

      sortChange({ column, prop, order }) {
        if (prop === 'discount') {
          switch (order) {
            case 'ascending':
              this.$data.query.sort = 'discount';
              break;
            case 'descending':
              this.$data.query.sort = '-discount';
              break;
            default:
              this.$data.query.sort = '';
              break;
          }
        }
        this.$data.query.page = 1;
        this.stepPriceQuery();
      },

      handleAddItems() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          items: [],
        }
      },

      handleModifyItems() {
        this.$data.dialog = {
          visible: true,
          type: 'modify',
          items: [...this.$data.selectedList],
        };
      },

      handleSubmitEdit() {
        this.handleCancelEdit();
        this.stepPriceQuery();
      },

      handleCancelEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          items: [],
        };
      },

      // 单个修改
      handleModifyItem(item) {
        this.$data.dialog = {
          visible: true,
          type: 'modify',
          items: [item],
        };
      },

      handleDeleteItem(item) {
        this.handleDelete([item.id]);
      },

      handleDeleteItems() {
        let ids = this.$data.selectedList.map(item => item.id);
        if (ids.length <= 0) return;
        this.handleDelete(ids);
      },

      handleDelete(ids) {
        this.$messageBox.confirm('确认删除所选商品的阶梯定价?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.businessMarketingStrategyStepDelete, {
            ids: ids
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '删除成功', type: 'success'});
            this.stepPriceQuery();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      handleSelectionChange(val) {
        this.$data.selectedList = val;
      },

      async stepPriceQuery() {

        let query = {...this.$data.query};
        if (Array.isArray(query.system_class_codes) && query.system_class_codes.length > 0) {
          query.system_class_code = query.system_class_codes[query.system_class_codes.length - 1];
        }
        delete query.system_class_codes;

        let res = await Http.get(Config.api.businessMarketingStrategyStepQuery, query);
        if (res.code !== 0) return;
        this.$data.list = res.data || { items: [] };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .line-height-18 {
    line-height: 18px;
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
