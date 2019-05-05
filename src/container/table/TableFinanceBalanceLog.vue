<template>
  <div>
    <div class="wp-query">
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
          class="dialog-query-item-date"
          style="width: 210px;"
        />
      </my-query-item>
      <my-query-item>
        <el-select size="small" v-model="query.reason" style="width: 180px; margin-left: 20px;"
                   @change="changeQuery" placeholder="选择变动原因" clearable>
          <el-option v-for="(item, key) in reason" :key="key" :label="item" :value="key"></el-option>
        </el-select>
      </my-query-item>
      <my-query-item>
        <el-select size="small" v-model="query.operator_class" style="width: 180px; margin-left: 20px;"
                   @change="changeQuery" placeholder="选择操作人类型" clearable>
          <el-option v-for="(item, key) in operator" :key="key" :label="item" :value="key"></el-option>
        </el-select>
      </my-query-item>
      <my-query-item>
        <el-input
          size="small"
          clearable
          style="width: 180px; margin-left: 20px;"
          placeholder="输入操作人名称"
          v-model="query.operator_name"
          @clear="changeQuery"
          @keyup.enter.native="changeQuery"
          ref="operator_name"
        ></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="changeQuery" style="margin-left: 4px;"></el-button>
        <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="resetQuery">重置</el-button>
      </my-query-item>
    </div>
    <el-table
      :data="listItem.items"
      :row-class-name="highlightRowClassName"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :highlight-current-row="true"
    >
      <el-table-column label="时间" prop="created" width="180">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.created }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="原有金额" prop="old_balance" width="120">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.old_balance == 0 ? '' : '￥' }}{{ returnPrice(scope.row.old_balance) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="变动金额" prop="amount" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.amount == 0">0</div>
          <div v-else :class="isEllipsis(scope.row) + (scope.row.amount > 0 ? ' red' : ' green')">
            {{ scope.row.amount > 0 ? '+￥' : '-￥' }}{{ returnPrice(Math.abs(scope.row.amount)) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="现有金额" prop="new_balance" width="120">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.new_balance == 0 ? '' : '￥' }}{{ returnPrice(scope.row.new_balance) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator_name" width="110">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.operator_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作人类型" prop="operator_class" width="110">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ operator[scope.row.operator_class] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="变动原因" prop="reason" width="160">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ reason[scope.row.reason] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款备注">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.remark || '-' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
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
</template>

<script>
  import { mapGetters } from 'vuex';
  import { Input, Button, Select, Option, Table, TableColumn, Pagination, Message, DatePicker } from 'element-ui';
  import { ButtonGroup, QueryItem, ToPrice, OmissionText, TableOperate } from '@/common';
  import { Constant, DataHandle } from '@/util';
  import { Finance } from '@/service';
  export default {
    name: "TableFinanceBalanceLog",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-date-picker': DatePicker,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-to-price': ToPrice,
      'my-omission-text': OmissionText,
      'my-table-operate': TableOperate
    },
    props: {
      merchant_id: { type: String | Number, required: true }
    },
    computed: {
      ...mapGetters({
        province: 'globalProvince'
      })
    },
    data() {
      return {
        pickerValue: null,
        query: { },
        listItem: {
          items: [],
          num: 0
        },
        reason: Constant.MERCHANT_BALANCE_REASON,
        operator: {
          member: '用户',
          operator: '运营人员',
          background: '后台'
        },
        status: {
          wait_check: '待审核',
          checked: '审核通过',
          declined: '被驳回'
        },
        fixDateOptions: Constant.FIX_DATE_RANGE,
        currentRow: {}
      }
    },
    created() {
      this.initQuery();
      this.BalanceLogQuery();
    },
    methods: {
      cellMouseEnter(row, column, cell, event) {
        if(row.id !== this.$data.currentRow.id) {
          this.$data.currentRow = row;
        }
      },

      cellMouseLeave(row, column, cell, event) {
        this.$data.currentRow = {};
      },

      isEllipsis(row) {
        return row.id != this.$data.currentRow.id ? 'ellipsis' : ''
      },
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      initQuery() {
        this.$data.query = Object.assign(this.$data.query, {
          province_code: this.province.code,
          merchant_id: this.$props.merchant_id,
          reason: '',
          operator_class: '',
          operator_name: '',
          begin_date: '',
          end_date: '',
          page: 1,
          page_size: 10
        })
      },
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.query.page = 1;
        this.BalanceLogQuery();
      },
      changeQuery() {
        this.query.page = 1;
        this.BalanceLogQuery();
      },
      resetQuery() {
        this.initQuery();
        this.$data.pickerValue = null;
        this.BalanceLogQuery();
        this.$refs['operator_name'].currentValue = '';
      },
      changePage(page) {
        this.$data.query.page = page;
        this.BalanceLogQuery();
      },
      changePageSize(size) {
        this.$data.query.page_size = size;
        this.BalanceLogQuery();
      },
      async BalanceLogQuery() {
        let res = await Finance.balanceLogQuery(this.$data.query);
        if (res.code === 0) {
          this.$data.listItem = Object.assign({}, this.$data.listItem, res.data);
        } else {
          Message.warning(res.message);
        }
      }
    }
  }
</script>

<style scoped>
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
  .green {
    color: #00d600;
  }
  .red {
    color: #ff3724;
  }

</style>
