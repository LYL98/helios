<template>
  <el-dialog title="退筐变更记录" :visible.sync="isShow" width="1100px" append-to-body :before-close="handleCancel">
    <div class="container">
      <div class="wp-query">
        <select-city
          size="small"
          clearable
          style="width: 180px;"
          v-model="query.city_id"
          :provinceCode="query.province_code"
          @change="selectMerchantByCondition"
        />

        <el-select
          size="small"
          v-model="query.reason"
          placeholder="修改类型"
          clearable
          style="width: 180px; margin-left: 20px;"
          @change="selectMerchantByCondition"
        >
          <el-option v-for="(item, key) in refundReason" :key="key" :label="item" :value="key"></el-option>
        </el-select>

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

        <div style="display: flex; align-items: center; margin-left: 20px;">
          <el-input
            size="small"
            placeholder="门店名称或电话"
            v-model="query.store_title"
            style="width: 180px;"
            clearable
            @keyup.enter.native="selectMerchantByCondition"
            @clear="selectMerchantByCondition"
            ref="store_title"
          />
          <el-button size="small" type="primary" @click="selectMerchantByCondition" icon="el-icon-search" style="margin-left: 4px;"></el-button>
          <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="clearQueryCondition">重置</el-button>
        </div>

      </div>
      <el-table
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
      >
        <el-table-column prop="created" label="时间" width="180">
          <template slot-scope="scope">
            <div>
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="store_title" label="门店">
          <template slot-scope="scope">
            <div>
              {{ scope.row.store_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="frame_num" label="筐数变动" width="110">
          <template slot-scope="scope">
            <div v-if="scope.row.frame_num == scope.row.frame_num_old">-</div>
            <div v-else :class="(scope.row.frame_num > scope.row.frame_num_old ? ' red' : scope.row.frame_num < scope.row.frame_num_old ? ' green' : '')">
              {{ scope.row.frame_num > scope.row.frame_num_old ? '+' : '-'}}{{ Math.abs(scope.row.frame_num - scope.row.frame_num_old) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="frame_amount" label="金额变动" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.frame_amount == scope.row.frame_amount_old">-</div>
            <div v-else :class="(scope.row.frame_amount > scope.row.frame_amount_old ? ' red' : scope.row.frame_amount < scope.row.frame_amount_old ? ' green' : '')">
              {{ scope.row.frame_amount > scope.row.frame_amount_old ? '+￥' : '-￥'}}{{ returnPrice(Math.abs(scope.row.frame_amount - scope.row.frame_amount_old)) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="修改类型" width="110">
          <template slot-scope="scope">
            <div>
              {{ refundReason[scope.row.reason] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="220">
          <template slot-scope="scope">
            <div>
              {{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" label="修改人" width="120">
          <template slot-scope="scope">
            <div>
              {{ refundReason[scope.row.operator_name] }}
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
  </el-dialog>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { SelectCity } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';

  export default {
    name: "DetailMerchantRefundLog",
    mixins: [detailMixin],
    components: {
      'select-city': SelectCity,
    },
    props: {
      closeDialog: Function
    },
    data() {
      let initQuery = {
        province_code: '',
        city_id: '',
        store_title: '',
        reason: '',
        begin_date: '',
        end_date: '',
        page: 1,
        page_size: 10
      }
      let initDataItem = {
        items: [],
        num: 0
      }
      return {
        pickerValue: null,
        initDetail: {},
        initQuery: initQuery,
        query: Object.assign({}, initQuery),
        initDataItem: initDataItem,
        dataItem: JSON.parse(JSON.stringify(initDataItem)),
        refundReason: Constant.MERCHANT_REFUND_REASON,
        fixDateOptions: Constant.FIX_DATE_RANGE
      }
    },
    created() {
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.query = Object.assign({}, this.initQuery);
        this.listQuery();
      },

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      changePageSize(pageSize) {
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.listQuery();
      },
      changePage(page) {
        this.query.page = page;
        this.listQuery();
      },
      // 退筐日志查询
      async listQuery() {
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.merchantRefundLogQuery, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
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
        this.listQuery();
      },

      selectMerchantByCondition() {
        this.$data.query.page = 1;
        this.listQuery();
      },

      clearQueryCondition() {
        this.$data.query = Object.assign({}, this.initQuery);
        this.$refs['store_title'].currentValue = '';
        this.listQuery();
      },

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
  .red {
    color: #ff3724;
  }

  .green {
    color: #00d600;
  }
</style>
