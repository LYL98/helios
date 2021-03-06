<template>
  <div>
    <div class="wp-query">
      <my-query-item>
        <el-select size="small" v-model="query.status" style="width: 180px;"
                   @change="changeQuery" placeholder="选择审核状态" clearable>
          <el-option
            v-for="(item, key) in {'wait_check': '待审核', 'checked': '审核通过', 'declined': '被驳回'}"
            :key="key"
            :label="item"
            :value="key"
          ></el-option>
        </el-select>
      </my-query-item>
      <my-query-item style="margin-left: 20px;">
        <select-option
          size="small"
          buttonWidth="60"
          :options="{'全部': '', '充值': 'manual_topup', '扣款': 'manual_deduct'}"
          v-model="query.opt_type"
          @change="changeQuery"
        />
      </my-query-item>
      <my-query-item>
        <el-date-picker
          size="small"
          v-model="pickerValue"
          type="daterange"
          align="center"
          value-format="yyyy-MM-dd"
          unlink-panels
          :picker-options="fixDateOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changePicker"
          class="dialog-query-item-date"
          style="width: 210px; margin-left: 20px;"
        />
      </my-query-item>
      <my-query-item>
        <el-input
          size="small"
          clearable
          style="width: 180px; margin-left: 20px;"
          placeholder="输入提交人名称"
          v-model="query.creator_name"
          @clear="changeQuery"
          @keyup.enter.native="changeQuery"
          ref="creator_name"
        ></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="changeQuery" style="margin-left: 4px;"></el-button>
        <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="resetQuery">重置</el-button>
      </my-query-item>
    </div>
    <el-table
      :data="dataItem.items"
      :row-class-name="highlightRowClassName"
      :highlight-current-row="true"
    >
      <el-table-column label="提交时间" prop="created" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.created }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款" prop="amount" width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.amount >= 0 ? '充值' : '扣款' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款类型" prop="opt_type" width="180">
        <template slot-scope="scope">
          <div>
            {{ opt_type[scope.row.opt_type] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.amount == 0">0</div>
          <div v-else :class="(scope.row.amount > 0 ? ' red' : ' green')">
            {{ scope.row.amount > 0 ? '+￥' : '-￥' }}{{returnPrice(Math.abs(scope.row.amount))}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="creator_name" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.creator_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="充值/扣款备注">
        <template slot-scope="scope">
          <div>
            {{ scope.row.remark || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          <div>
            {{ status[scope.row.status] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <my-table-operate
            :list="[
              {
                title: '查看详情',
                isDisplay: (auth.isAdmin || auth.FinanceBalanceApproveDetail) && (scope.row.status === 'checked' || scope.row.status === 'declined'),
                command: () => handleShowDetail(scope.row)
              }
            ]"
          />
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
        :total="dataItem.num"
        :page-size="query.page_size"
        :current-page="query.page"
      />
    </div>
    <el-dialog
      :visible.sync="dialog.isShow"
      :before-close="handleCloseDetail"
      width="600px"
      append-to-body
      title="审核详情"
    >
      <el-form label-position="left" label-width="100px" style="padding: 20px;" v-if="dialog.isShow">
        <el-form-item label="审核状态：">{{ status[dialog.detail.status] }}</el-form-item>
        <el-form-item label="审核备注：">{{ dialog.detail.audit_remark }}</el-form-item>
        <el-form-item label="审核人：">{{ dialog.detail.checker_name }}</el-form-item>
        <el-form-item label="审核时间：">{{ dialog.detail.audit_time }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { Input, Button, Table, TableColumn, Pagination, Message, DatePicker, Select, Option, Dialog, Form, FormItem } from 'element-ui';
  import { SelectOption, QueryItem, OmissionText, TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  
  export default {
    name: "TableFinanceBalanceApproveLog",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-omission-text': OmissionText,
      'my-table-operate': TableOperate
    },
    props: {
      merchant_id: { type: String | Number, required: true },
      province: { type: Object, default: {} }
    },
    data() {
      return {
        auth: this.$auth,
        pickerValue: null,
        query: {
          creator_name: ''
        },
        dataItem: {
          items: [],
          num: 0
        },
        opt_type: Constant.MERCHANT_BALANCE_REASON,
        status: {
          wait_check: '待审核',
          checked: '审核通过',
          declined: '被驳回'
        },
        dialog: {
          isShow: false,
          detail: {  } // 审核详情
        },

        fixDateOptions: Constant.FIX_DATE_RANGE
      }
    },
    created() {
      this.initQuery();
      this.ApproveQuery();
    },
    methods: {

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
          status: '',
          opt_type: '',
          creator_name: '',
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
        this.ApproveQuery();
      },
      changeQuery() {
        this.query.page = 1;
        this.ApproveQuery();
      },
      resetQuery() {
        this.initQuery();
        this.$data.pickerValue = null;
        this.ApproveQuery();
        this.$refs['creator_name'].currentValue = '';
      },
      changePage(page) {
        this.$data.query.page = page;
        this.ApproveQuery();
      },
      changePageSize(size) {
        this.$data.query.page_size = size;
        this.ApproveQuery();
      },
      async ApproveQuery() {
        let res = await Http.get(Config.api.financeApproveQuery, this.query);
        if (res.code === 0) {
          this.$data.dataItem = Object.assign({}, this.$data.dataItem, res.data);
        } else {
          Message.warning(res.message);
        }
      },
      async handleShowDetail(item) {
        let res = await Http.get(Config.api.financeApproveDetail, { id: item.id });
        if (res.code === 0) {
          this.$data.dialog.detail = res.data;
          this.$data.dialog.isShow = true;
        } else {
          Message.warning(res.message);
        }
      },
      handleCloseDetail() {
        this.$data.dialog.isShow = false;
        this.$data.dialog.detail = { };
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
