<template>
  <sub-menu>
    <template slot="left-query">
      <global-province @change="changeProvince" is-required/>
    </template>
    <div class="container-query">
      <div class="city-container">
        <template v-for="item in cityList">
          <el-button
            v-if="item.id === query.city_id"
            size="mini"
            :key="item.id"
            type="primary"
            @click="changeCity(item)"
          >{{ item.title }}</el-button>
          <span v-else class="city-label" @click="changeCity(item)">{{ item.title }}</span>
        </template>

      </div>
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
      <div class="table-top" v-if="$auth.isAdmin || $auth.MarketingStrategyCityAdd">
        <div class="left"></div>
        <div class="right">
          <el-button @click="handleAddItems" size="mini" type="primary">新增</el-button>
        </div>
      </div>

      <div @mousemove="handleTableMouseMove" class="mt-16 table-conter">
        <el-table
          class="list-table my-table-float"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
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
            v-if="$auth.isAdmin || $auth.MarketingStrategyCityModify || MarketingStrategyCityDelete"
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column label="商品编号/名称" prop="item_id" min-width="240">
            <template slot-scope="scope">
              <div class="my-td-item">
                {{ scope.row.item && scope.row.item.code }} / {{ scope.row.item && scope.row.item.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="定价" prop="price_sale" min-width="100">
            <template slot-scope="scope">
              <div class="mt-td-item" v-if="scope.row.item && !!scope.row.item.price_sale">
                ￥{{ DataHandle.returnPrice(scope.row.item.price_sale) }}
              </div>
              <div class="my-td-item" v-else>
                未报价
              </div>
            </template>
          </el-table-column>
          <el-table-column label="浮动率" prop="discount" min-width="90" sortable="custom">
            <template slot-scope="scope">
              <div class="my-td-item">
                {{ DataHandle.returnDiscount(scope.row.discount) }}%
              </div>
            </template>
          </el-table-column>
          <el-table-column label="浮动价格" min-width="100">
            <template slot-scope="scope">
              <div class="my-td-item" v-if="scope.row.item && !!scope.row.item.price_sale">
                ￥{{ DataHandle.returnPrice(DataHandle.returnDiscount(scope.row.item.price_sale * scope.row.discount / 100)) }}
              </div>
              <div class="my-td-item" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总库存" prop="item_stock" min-width="100">
            <template slot-scope="scope">
              <div class="my-td-item" v-if="scope.row.item && !!scope.row.item.item_stock">
                {{ scope.row.item.item_stock }}件
              </div>
              <div class="my-td-item" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="已售数量" prop="sale_already" min-width="100">
            <template slot-scope="scope">
              <div class="my-td-item" v-if="scope.row.item && !!scope.row.item.sale_already">
                {{ scope.row.item.sale_already }}件
              </div>
              <div class="my-td-item" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="updated" min-width="160">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '修改',
                    isDisplay: $auth.isAdmin || $auth.MarketingStrategyCityModify,
                    command: () => handleModifyItem(scope.row)
                  },
                  {
                    title: '删除',
                    isDisplay: $auth.isAdmin || $auth.MarketingStrategyCityDelete,
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
          <el-button size="mini" type="primary" :disabled="selectedList.length <= 0" @click="handleModifyItems" v-if="$auth.isAdmin || $auth.MarketingStrategyCityModify">批量修改</el-button>
          <el-button size="mini" type="primary" :disabled="selectedList.length <= 0" @click="handleDeleteItems" v-if="$auth.isAdmin || $auth.MarketingStrategyCityDelete">批量删除</el-button>
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
      :title="`${dialog.type === 'add' ? '新增' : '修改'}县域（${selectedCity.title}）定价`"
      :before-close="handleCancelEdit"
    >
      <city-price-edit
        v-if="dialog.visible"
        :city="selectedCity"
        :type="dialog.type"
        :items="dialog.items"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit"
      />
    </add-edit-layout>
    <el-dialog
      title="修改县域定价"
      :close-on-click-modal="false"
      :visible.sync="modify.visible"
      append-to-body
      width="500px"
    >
      <city-price-modify
        v-if="modify.visible"
        :item="modify.item"
        @submit="handleSubmitModify"
        @cancel="handleCancelModify"
      />
    </el-dialog>
  </sub-menu>
</template>

<script>
  import {Row, Col, Button, Input, Select, Option, Pagination, Table, TableColumn, Dialog, DatePicker, Tag} from 'element-ui';
  import {SelectOption, QueryItem, QuerySearchInput, TableOperate, SelectCity} from '@/common';
  import { GlobalProvince } from '@/component';
  import AddEditLayout from '@/share/layout/Layout';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  import CityPriceEdit from './city-price-edit';
  import CityPriceModify from './city-price-modify';
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
      'my-select-city': SelectCity,
      'my-table-operate': TableOperate,
      'query-search-input': QuerySearchInput,
      'city-price-edit': CityPriceEdit,
      'city-price-modify': CityPriceModify,
      'global-province': GlobalProvince
    },
    data() {
      return {
        cityList: [],
        query: {},
        list: {
          items: []
        },
        selectedList: [],
        dialog: {
          visible: false,
          type: 'add',
          items: null
        },
        modify: {
          visible: false,
          item: null
        }
      }
    },
    computed: {
      selectedCity() {
        let city = this.$data.cityList.find(item => item.id === this.$data.query.city_id);
        if (!city) return { id: '', title: '' };
        return city;
      }
    },
    created() {
      documentTitle('营销策略 - 县域定价');
      this.DataHandle = DataHandle;
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      // 判断是否具有促销活动的权限
      this.initQuery();
      this.baseCityList();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          province_code: this.$province.code,
          city_id: '',
          sort: '',
          discount: '',
          condition: '',
          picker_value: null,
          page: 1,
          page_size: Constant.PAGE_SIZE
        };
      },

      changeQuery() {
        this.cityPriceQuery();
      },

      resetQuery() {
        let city_id = this.$data.query.city_id;
        this.initQuery();
        this.$data.query.city_id = city_id;
        this.cityPriceQuery();
      },

      changeProvince(province) {
        this.$data.query.province_code = province.code;
        this.baseCityList();
      },

      changeCity(item) {
        this.$data.query.city_id = item.id;
        this.cityPriceQuery();
      },

      changePicker(value){
        if(value && value.length === 2){
          this.query.update_begin = value[0];
          this.query.update_end = value[1];
        }else{
          this.query.update_begin = '';
          this.query.update_end = '';
        }
        this.$data.query = this.query;
        this.cityPriceQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.cityPriceQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.cityPriceQuery();
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
        this.cityPriceQuery();
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
        this.cityPriceQuery();
      },

      handleCancelEdit() {
        this.$data.dialog = {
          visible: false,
          type: 'add',
          items: [],
        };
      },

      // 单个修改 独立的dialog
      handleModifyItem(item) {
        this.$data.modify = {
          visible: true,
          item: item,
        };
      },

      handleSubmitModify() {
        this.handleCancelModify();
        this.cityPriceQuery();
      },

      handleCancelModify() {
        this.$data.modify = {
          visible: false,
          item: null,
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
        this.$messageBox.confirm('确认删除所选商品的县域定价?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.businessMarketingStrategyCityDelete, {
            ids: ids
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '删除成功', type: 'success'});
            this.cityPriceQuery();
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

      async baseCityList() {
        let res = await Http.get(Config.api.baseCityList, {
          province_code: this.$data.query.province_code || '',
        });
        if(res.code === 0) {
          let rd = res.data || [];
          this.$data.cityList = rd;
          if (rd.length > 0) {
            this.$data.query.city_id = rd[0].id;
            this.cityPriceQuery();
          }
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },

      async cityPriceQuery() {
        let res = await Http.get(Config.api.businessMarketingStrategyCityQuery, this.$data.query);
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
  .city-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .city-label {
      font-size: 12px;
      box-sizing: border-box;
      padding: 0px 10px;
      line-height: 24px;
      margin-bottom: 5px;
      cursor: pointer;

      &:hover {
        color: darken(#2c3e50, 40);
      }
    }

    .el-button {
      box-sizing: border-box;
      padding: 0px 10px;
      margin-bottom: 5px;
    }
  }
</style>
