<template>
  <detail-layout title="账期详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="margin: 16px;">
      <el-col :span="8">
        账单时间：{{detail.begin_term}}&nbsp;至&nbsp;{{detail.end_term}}
      </el-col>
      <el-col :span="6">
        账单金额：&yen;&nbsp;{{returnPrice(detail.bill_amount)}}
      </el-col>
      <el-col :span="6">
        结款日期：{{detail.bill_date || '-'}}
      </el-col>
      <el-col :span="2">
        <el-tag size="small" :type="statusType[detail.status]" disable-transitions>{{status[detail.status]}}</el-tag>
      </el-col>
      <el-col :span="2">
        <el-tag style="cursor: pointer;" size="small" effect="dark" type="primary" @click.native="handleExport">导出详情</el-tag>
      </el-col>
    </el-row>
    <div class="" style="border-bottom: 8px solid #eee; margin: 0 16px 16px;"></div>
    <div style="padding: 0 16px;">
      <el-table :data="detail.bill_details" width="100%" :row-class-name="highlightRowClassName">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column label="流水类型" min-width="100">
          <template slot-scope="scope">{{billReason[scope.row.bill_reason]}}</template>
        </el-table-column>
        <el-table-column label="采购价" min-width="100">
          <template slot-scope="scope">
            <div class="amount" v-if="scope.row.bill_reason === 'local_buy'">
              <div v-if="!!scope.row.item_price_buy">&yen;{{returnPrice(scope.row.item_price_buy)}}</div>
              <div v-else>-</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="销售价" min-width="100">
          <template slot-scope="scope">
            <div class="amount" v-if="scope.row.bill_reason === 'local_buy'">
              <div v-if="!!scope.row.item_price_sale">&yen;{{returnPrice(scope.row.item_price_sale)}}</div>
              <div v-else>-</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.bill_reason === 'local_buy' && !!scope.row.item_num">
              {{ scope.row.item_num }}件
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="100">
          <template slot-scope="scope">
            <div class="amount">
              <div v-if="scope.row.bill_amount === 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
              <div class="up" v-else-if="scope.row.bill_amount > 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
              <div class="down" v-else>&yen;{{returnPrice(Math.abs(scope.row.bill_amount))}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="120">
          <template slot-scope="scope">
            {{scope.row.creator.realname || '系统'}}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="200"/>
        <el-table-column label="时间" prop="created" min-width="150"/>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailHeadBalanceLog",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        bill_details: []
      }
      return {
        status: Constant.S_STATEMENT_STATUS(),
        statusType: Constant.S_STATEMENT_STATUS_TYPE,
        detail: this.copyJson(initDetail),
        initDetail: initDetail,
        billReason: Constant.SUPPLIER_BILL_REASON()
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.detail = [];
        this.financeSupBillDetail(data.id);
      },
      //获取详情列表
      async financeSupBillDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.financeSupBillDetail, { id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          this.$data.detail = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },

      async handleExport() {
        //判断是否可导出
        this.$loading({ isShow: true });
        let res = await Http.get(Config.api.financeSupBillDetailExportCheck, { id: this.$data.detail.id });
        this.$loading({ isShow: false });
        if(res.code === 0){
          let queryStr = `${Config.api.financeSupBillDetailExport}?id=${this.$data.detail.id}`;
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
</style>
