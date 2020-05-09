<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="仓库">
            <select-storehouse size="small" v-model="query.storehouse_id" showAll clearable @change="changeQuery"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="日期">
            <el-date-picker
              size="small"
              v-model="pickerValue"
              type="daterange"
              align="right"
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
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="商品编号/名称"
              clearable
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
          <query-tabs v-model="query.sale_status" @change="changeQuery" :tab-panes="statusOptions"/>
        </div>
        <div class="right" v-if="auth.isAdmin || auth.InventoryMarketExport">
          <el-button @click.native="handleExport('supModifyStockSaleExport', query)" size="mini" type="primary" plain>导出销售记录</el-button>
        </div>
      </div>
      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" width="80" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column label="商品编号/名称" min-width="100">
            <template slot-scope="scope">{{scope.row.item_code}} / {{scope.row.item_title}}</template>
          </el-table-column>
          <el-table-column label="批次" prop="batch_code" min-width="100"/>
          <el-table-column label="仓" min-width="60">
            <template slot-scope="scope">{{scope.row.storehouse.title}}</template>
          </el-table-column>
          <el-table-column label="销售数量" min-width="60">
            <template slot-scope="scope">{{Math.abs(scope.row.chg_num)}}件</template>
          </el-table-column>
          <el-table-column label="状态" min-width="60">
            <template slot-scope="scope">
              <el-tag size="small" :type="inventorySaleStatusType[returnSaleStatus(scope.row)]" disable-transitions>
                {{inventorySaleStatus[returnSaleStatus(scope.row)]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="销售金额" min-width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.amount">&yen;{{returnPrice(scope.row.amount)}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                :list="[
                  {
                    title: '确认销售',
                    isDisplay: ($auth.isAdmin || $auth.InventoryMarketAdd) && returnSaleStatus(scope.row) === 'wait_sale',
                    command: () => handleMarket(scope.row)
                  },
                  {
                    title: '详情',
                    isDisplay: $auth.isAdmin || $auth.InventoryMarketDetail,
                    command: () => handleDetailItem(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-bottom" v-if="list.items.length > 0">
        <div class="left"></div>
        <div class="right">
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
    <!--销售-->
    <add-edit-layout :is-show="market.visible" title="确认销售" :before-close="handleCancel">
      <market v-if="market.visible" :item="market.item" :loading="market.loading" @submit="submitMarket" @cancel="handleCancel"/>
    </add-edit-layout>
    <!--详情-->
    <add-edit-layout :is-show="detail.visible" title="详情" :before-close="handleCancel">
      <detail v-if="detail.visible" :item="detail.item"/>
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn, Tag } from 'element-ui';
  import { SelectOption, QueryItem, QuerySearchInput, TableOperate } from '@/common';
  import { SelectStorehouse } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import detailDom from './detail';
  import marketDom from './market';
  import AddEditLayout from '@/share/layout/Layout';
  import mainMixin from '@/share/mixin/main.mixin';
  import queryMixin from '@/share/mixin/query.mixin';
  import tableMixin from '@/share/mixin/table.mixin';
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, queryMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'query-search-input': QuerySearchInput,
      'select-storehouse': SelectStorehouse,
      'detail': detailDom,
      'market': marketDom,
      'query-tabs': queryTabs
    },
    data() {
      return {
        statusOptions: { '全部': '', ...Constant.INVENTORY_SALE_STATUS('value_key')},
        inventorySaleStatus: Constant.INVENTORY_SALE_STATUS(),
        inventorySaleStatusType: Constant.INVENTORY_SALE_STATUS_TYPE,
        pickerValue: null,
        query: {
          sale_status: '',
          storehouse_id: '',
          delivery_date: '',
          condition: ''
        },
        list: {
          items: [],
          num: 0
        },
        // 确认销售
        market: {
          visible: false,
          item: {},
          loading: false
        },
        // 详情弹层
        detail: {
          visible: false,
          item: {}
        },
      }
    },
    created() {
      documentTitle('商品 - 库存销售');
      this.resetQuery();
    },
    methods: {
      //返回状态
      returnSaleStatus(item){
        if(item.amount) return 'saled';
        return 'wait_sale';
      },

      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = query;
        this.supModifyStockSaleQuery();
      },

      initQuery() {
        this.$data.query = {
          ...this.query,
          storehouse_id: '',
          sale_status: '',
          condition: '',
          begin_date: '',
          end_date: ''
        };
        this.$data.pickerValue = null;
      },

      changeQuery() {
        this.supModifyStockSaleQuery();
      },

      resetQuery() {
        this.initQuery();
        this.supModifyStockSaleQuery();
      },

      handleDetailItem(item) {
        this.$data.detail = {
          visible: true,
          item: item
        };
      },

      handleMarket(item) {
        this.$data.market = {
          visible: true,
          item: item
        };
      },

      //销售确认
      async submitMarket(addData){
        let { market } = this;
        this.$data.market = Object.assign({loading: true}, market);
        let res = await Http.post(Config.api.supModifyStockEditSaleAmount, {
          id: market.item.id,
          ...addData
        });
        this.$data.market = Object.assign({loading: false}, market);
        if (res.code === 0){
          this.$message({title: '提示', message: '已销售', type: 'success'});
          this.changeQuery();
          this.handleCancel();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化确认弹层
        this.$data.market = {
          visible: false,
          list: [],
          loading: false
        };
        // 初始化详情弹层
        this.$data.detail = {
          visible: false,
          item: {
            items: []
          }
        };
      },

      async supModifyStockSaleQuery() {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supModifyStockSaleQuery, this.query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

       changePage(page) {
          this.$data.query.page = page;
          this.supModifyStockSaleQuery();
        },

        changePageSize(page_size) {
          this.$data.query.page = 1;
          this.$data.query.page_size = page_size;
          this.supModifyStockSaleQuery();
        },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
