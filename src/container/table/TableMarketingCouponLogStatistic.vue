<template>
  <div>
    <div class="wp-query">
      <el-input size="small" style="width: 300px;" placeholder="输入优惠券编号或名称查询" v-model="query.condition" @keyup.enter.native="handleQuery"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleQuery"></el-button>
      <el-button size="small" type="primary" @click="resetQuery">重置</el-button>
    </div>
    <el-table :data="listItem.items" :row-class-name="highlightRowClassName" :highlight-current-row="true">
      <el-table-column label="发放时间" prop="created" width="100"></el-table-column>
      <el-table-column label="编号" prop="coupon_code" width="130"></el-table-column>
      <el-table-column label="名称" prop="coupon_title" width="200"></el-table-column>
      <el-table-column label="发放方式" prop="dis_type" width="100">
        <template slot-scope="scope">{{ disType[scope.row.dis_type] }}</template>
      </el-table-column>
      <el-table-column label="发放记录">
        <template slot-scope="scope">
          {{ scope.row.dis_type === 'type_grade'
              ? scope.row.grades && scope.row.grades.map(item => item.title).join('、')
                : scope.row.dis_type === 'type_city'
                  ? scope.row.cities && scope.row.cities.map(item => item.title).join('、')
                    : scope.row.dis_type === 'type_merchant'
                      ? scope.row.merchants && scope.row.merchants.map(item => item.title).join('、')
                      : '—'
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator_name" width="100"></el-table-column>
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
  import { Input, Button, Table, TableColumn, Pagination, Message } from 'element-ui';
  import { Http, Config, Constant } from '@/util';
  export default {
    name: "TableMarketingCouponLogStatistic",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination
    },
    data() {
      return {
        province: this.$province,
        query: { },
        listItem: {
          items: [],
          num: 0
        },
        disType: Constant.ITEM_COUPON_DIS_TYPE
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
      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          condition: '',
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
        let res = await Http.get(Config.api.itemCouponDistributeLog, this.query);
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
    padding: 0 10px 15px;
    border-bottom: 1px solid #f3f4f6;
  }
  .table-footer {
    padding: 12px 10px 0;
    display: flex;
    justify-content: flex-end;
  }

</style>
