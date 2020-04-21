<template>
  <div>
    <el-row :gutter="32">
      <el-col :span="7">
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
          :clearable="false"
          style="width: 100%;"
        />
      </el-col>
      <el-col :span="7">
        <el-select
          size="small"
          v-model="query.opt_type"
          clearable
          placeholder="记录类型"
          style="width: 100%"
          @change="changeQuery"
        >
          <el-option
            v-for="(value, key) of statusOptions"
            :key="value"
            :label="key"
            :value="value"
          />
        </el-select>
      </el-col>
      <el-col :span="10">
        <query-search-input
          size="small"
          v-model="query.condition"
          placeholder="调拨计划单号"
          clearable
          @search="changeQuery"
          @reset="resetQuery"
        />
      </el-col>
    </el-row>
    <div class="container-table mt-20">

      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          highlight-current-row="highlight-current-row"
          style="min-height: 300px"
        >
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column label="商品编号/名称" min-width="160">
            <template  slot-scope="scope">
              <span v-if="scope.row.p_item && scope.row.p_item.code && scope.row.p_item.title">
                {{ scope.row.p_item.code }} / {{ scope.row.p_item.title }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="批次" prop="batch_code" width="140">
          </el-table-column>
          <el-table-column label="类型" prop="opt_type" width="100">
            <template slot-scope="scope">
              {{ sup_stock_record_type[scope.row.opt_type] }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="num" width="100">
            <template  slot-scope="scope">
              <span v-if="!!scope.row.num">
                {{ scope.row.reckon_flg * scope.row.num }}件
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="creator" width="100">
            <template slot-scope="scope">
              {{ scope.row.creator && scope.row.creator.realname || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作时间" prop="created" width="160">
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
  </div>
</template>

<script>
  import {Form, FormItem, Row, Col, Table, TableColumn, DatePicker, Select, Option, Pagination} from "element-ui";
  import {FormArea, QuerySearchInput, QueryItem} from "@/common";
  import tableMixin from "@/share/mixin/table.mixin";
  import {Http, Config, Constant, DataHandle} from "@/util";

  export default {
    name: "sup-stock-record",
    mixins: [tableMixin],
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-row": Row,
      "el-col": Col,
      "el-form-area": FormArea,
      "el-table": Table,
      "el-table-column": TableColumn,
      "el-date-picker": DatePicker,
      "el-select": Select,
      "el-option": Option,
      "el-pagination": Pagination,
      "my-query-item": QueryItem,
      "query-search-input": QuerySearchInput
    },
    props: {
      items: {type: Object, default: () => ({})},
      storehouse_id: {type: Number, default: ''},
    },
    data() {
      return {
        statusOptions: {...Constant.SUP_STOCK_RECORD_TYPE('value_key')}, // 状态查询条件
        sup_stock_record_type: Constant.SUP_STOCK_RECORD_TYPE(), // 调拨计划列表状态
        query: {},
        list: {
          items: [],
          num: 0
        }
      };
    },
    created() {
      this.fixDateOptions = Constant.FIX_DATE_RANGE;
      this.initQuery();
      this.recordQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          storehouse_id: this.$props.storehouse_id,
          picker_value: [DataHandle.formatDate(new Date(), 'yyyy-MM-dd'), DataHandle.formatDate(new Date(), 'yyyy-MM-dd')],
          condition: '',
          opt_type: '',
          begin_date: DataHandle.formatDate(new Date(), 'yyyy-MM-dd'),
          end_date: DataHandle.formatDate(new Date(), 'yyyy-MM-dd'),
          page: 1,
          page_size: 10,
        }
      },
      resetQuery() {
        this.initQuery();
        this.recordQuery();
      },
      changeQuery() {
        this.recordQuery();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.recordQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.recordQuery();
      },
      changePicker(value) {
        if (value && value.length === 2) {
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        } else {
          this.query.begin_date = "";
          this.query.end_date = "";
        }
        this.$data.query = this.query;
        this.recordQuery();
      },
      async recordQuery() {
        let query = {...this.$data.query};
        delete query.picker_value;
        let res = await Http.get(Config.api.operateItemSupStockRecord, query);
        if (res.code !== 0) return;
        this.$data.list = res.data;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/share/scss/table.scss";

  .mt-16 {
    margin-top: 16px;
  }

  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
<style lang="scss">
  @import "@/share/scss/table.global.scss";
</style>
