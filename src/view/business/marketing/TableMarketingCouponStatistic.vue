<template>
  <div>
    <div class="wp-query">
      <select-option
        buttonWidth="60"
        :options="{'全部': '', '未使用': 0, '已使用': 1}"
        v-model="query.is_used"
        @change="handleQuery"
        size="small"
      />
      <div style="display: flex; align-items: center; margin-left: 20px;">
        <el-input
          size="small"
          clearable
          style="width: 180px;"
          placeholder="输入优惠券编号/名称"
          v-model="query.condition"
          @keyup.enter.native="handleQuery"
          @clear="handleQuery"
          ref="condition"
        ></el-input>
        <el-input
          size="small"
          clearable
          style="width: 180px; margin-left: 2px;"
          placeholder="输入商户名称"
          v-model="query.merchants_title"
          @keyup.enter.native="handleQuery"
          @clear="handleQuery"
          ref="merchants_title"
        ></el-input>
        <el-button size="small" type="primary" style="margin-left: 4px;" icon="el-icon-search" @click="handleQuery"></el-button>
        <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="resetQuery">重置</el-button>
      </div>
    </div>
    <el-table
      :data="dataItem.items"
      :row-class-name="highlightRowClassName"
      :highlight-current-row="true"
    >
      <el-table-column
        type="index"
        :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号"
        :index="indexMethod"
        align="center"
      ></el-table-column>
      <el-table-column label="发放日期" prop="created" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.created }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="编号/名称" prop="coupon_code">
        <template slot-scope="scope">
          <a href="javascript:void(0);" class="title" @click="handleShowCoupon(scope.row.coupon_id)">
            {{ scope.row.coupon_code }} / {{ scope.row.coupon_title }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="发放人" prop="operator_name" width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.operator_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商户" prop="merchant_title" width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.merchant_title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" prop="is_used" width="100">
        <template slot-scope="scope">
          {{ scope.row.is_used ? '已使用' : '未使用' }}
        </template>
      </el-table-column>
      <el-table-column label="所用订单编号" prop="order_code" width="130">
        <template slot-scope="scope">
          <div>
            {{ scope.row.order_code }}
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
        :total="dataItem.num"
        :page-size="query.page_size"
        :current-page="query.page"
      />
    </div>
  </div>
</template>

<script>
  import { Input, Button, Table, TableColumn, Pagination, Message } from 'element-ui';
  import { SelectOption } from '@/common';
  import { Http, Config, Constant } from '@/util';
  export default {
    name: "TableMarketingCouponStatistic",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'select-option': SelectOption
    },
    props: {
      showItem: { type: Function, required: true }
    },
    data() {
      return {
        province: this.$province,
        query: {},
        dataItem: {
          items: [],
          num: 0
        }
      }
    },
    created() {
      this.initQuery();
      this.queryLog();
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
      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          condition: '',
          merchants_title: '',
          is_used: '',
          page: 1,
          page_size: 10
        })
      },
      handleQuery() {
        this.query.page = 1;
        this.queryLog();
      },
      resetQuery() {
        this.initQuery();
        this.queryLog();
        this.$refs['condition'].currentValue = '';
        this.$refs['merchants_title'].currentValue = '';
      },
      changePage(page) {
        this.$data.query.page = page;
        this.queryLog();
      },
      changePageSize(size) {
        this.$data.query.page_size = size;
        this.queryLog();
      },
      async queryLog() {
        let res = await Http.get(Config.api.itemCouponDistributeStatistic, this.query);
        if (res.code === 0) {
          this.$data.dataItem = Object.assign({}, this.$data.dataItem, res.data);
        } else {
          Message.warning(res.message);
        }
      },
      handleShowCoupon(id) {
        this.$props.showItem(id);
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
