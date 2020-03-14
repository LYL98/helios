<template>
  <detail-layout title="账期详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="margin: 16px;">
      <el-col :span="8">
        账单时间：{{detail.begin_term}}&nbsp;至&nbsp;{{detail.end_term}}
      </el-col>
      <el-col :span="14">
        账单金额：&yen;&nbsp;{{returnPrice(detail.bill_amount)}}
      </el-col>
      <el-col :span="2">
        <el-tag size="small" :type="statusType[detail.status]" disable-transitions>{{status[detail.status]}}</el-tag>
      </el-col>
    </el-row>
    <div class="" style="border-bottom: 8px solid #eee; margin: 0 16px 16px;"></div>
    <div style="padding: 0 16px;">
      <el-table :data="detail.bill_details" width="100%" :row-class-name="highlightRowClassName">
        <el-table-column type="index" min-width="100" label="序号"></el-table-column>
        <el-table-column label="变动类型" min-width="260">
          <template slot-scope="scope">{{billReason[scope.row.bill_reason]}}</template>
        </el-table-column>
        <el-table-column label="金额" min-width="200">
          <template slot-scope="scope">
            <div class="amount">
              <div v-if="scope.row.bill_amount === 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
              <div class="up" v-else-if="scope.row.bill_amount > 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
              <div class="down" v-else>&yen;{{returnPrice(Math.abs(scope.row.bill_amount))}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="200">
          <template slot-scope="scope">
            {{scope.row.creator.realname || '系统'}}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="200"/>
        <el-table-column label="时间" prop="created" min-width="200"/>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
