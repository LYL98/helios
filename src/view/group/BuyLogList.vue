<template>
  <div>
    <div class="wp-query">
      <my-query-item>
        <el-select
          style="width: 180px;"
          v-model="query.action"
          @change="changeQuery"
          placeholder="操作类型"
          size="small"
          clearable
        >
          <el-option
            v-for="(item, key) in actionType"
            :key="key"
            :label="item"
            :value="key"
          ></el-option>
        </el-select>
      </my-query-item>

      <my-query-item>
        <el-date-picker
          size="small"
          v-model="pickerValue"
          type="daterange"
          align="left"
          value-format="yyyy-MM-dd"
          unlink-panels
          :picker-options="fixDateOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changePicker"
          style="width: 230px; margin-left: 20px;"
        />
      </my-query-item>

      <my-query-item>
        <div style="display: flex">
          <el-input
            size="small"
            clearable
            v-model="query.condition"
            placeholder="输入商品名称查询"
            @keyup.enter.native="changeQuery"
            @clear="changeQuery"
            ref="condition"
            style="width: 180px; margin-left: 20px;"
          />
          <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                     @click="changeQuery"></el-button>
          <el-button type="primary" size="small" class="query-item-reset" plain @click="initQuery">重置</el-button>
        </div>
      </my-query-item>
    </div>

    <div>
      <el-table
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="操作时间" prop="start_time" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="团购商品" prop="title" min-width="280">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="团购时间" min-width="320">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.start_time }} ~ {{ scope.row.end_time }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改类型" prop="amount" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ actionType[scope.row.action] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改人" prop="pay_amount" min-width="140">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.realname || '系统' }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="table-footer">
      <div class="table-pagination">
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

  </div>
</template>

<script>

  import { Button, Input, Select, Option, DatePicker, Table, TableColumn, Tag, Pagination, MessageBox } from 'element-ui';
  import { QueryItem } from '@/common';
  import { Http, Constant, Config, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "BuyLogList",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
    },
    mixins: [tableMixin],
    data() {
      return {
        pickerValue: null,
        fixDateOptions: Constant.FIX_DATE_RANGE,
        actionType: {
          action_create: '创建',
          action_active: '上架',
          action_deactive: '下架',
          action_edit: '修改',
          action_close: '结算'
        },
        query: {},
        listItem: {
          num: 0,
          items: []
        },
      }
    },
    created() {
      this.initQuery();
    },

    methods: {

      changePicker(value){
        if(value && value.length === 2){
          this.query.time_start = value[0];
          this.query.time_end = value[1];
        }else{
          this.query.time_start = '';
          this.query.time_end = '';
        }
        this.query.page = 1;
        this.logQuery();
      },

      initQuery() {
        this.$data.query = {
          province_code: this.province.code,
          action: '',
          time_start: '',
          time_end: '',
          condition: '',
          page: 1,
          page_size: 10
        }
        this.$data.pickerValue = null;
        this.logQuery();
      },
      changeQuery() {
        this.$data.query = Object.assign(this.$data.query, { page: 1 });
        this.logQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.logQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.logQuery();
      },
      async logQuery() {
        let res = await Http.get(Config.api.groupBuyLogQuery, this.query);
        if (res.code === 0) {
          this.$data.listItem = Object.assign(this.$data.listItem, {
            num: res.data.num,
            items: res.data.items
          });
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

    }
  }
</script>

<style lang="scss" scoped>
  .wp-query {
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    border-bottom: 10px solid #F7F7F8;
  }
  .table-footer {
    padding: 12px 10px 0;
    display: flex;
    justify-content: flex-end;
  }
</style>
