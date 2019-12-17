<template>
  <detail-layout title="账期详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="margin: 16px;">账单日期：{{detail.begin_term}}&nbsp;至&nbsp;{{detail.end_term}}</div>
    <div style="padding: 0 16px;">
      <el-table :data="detail.bill_details" width="100%" :row-class-name="highlightRowClassName">
        <el-table-column type="index" min-width="100" label="序号"></el-table-column>
        <el-table-column label="变动类型" min-width="260">
          <template slot-scope="scope">{{billReason[scope.row.bill_reason]}}</template>
        </el-table-column>
        <el-table-column label="金额" min-width="200">
          <template slot-scope="scope">
            <div class="amount">
              <div class="up" v-if="scope.row.bill_amount > 0">&yen;{{returnPrice(scope.row.bill_amount)}}</div>
              <div class="down" v-else>&yen;{{returnPrice(Math.abs(scope.row.bill_amount))}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="200">
          <template slot-scope="scope">
            {{scope.row.creater.realname || '系统'}}
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
        detail: this.copyJson(initDetail),
        initDetail: initDetail,
        billReason: {
          'local_buy': '货款', //地采采购
          'manual_chg': '其它', //财务人员手动修改
          'after_sale': '售后', //售后处理
          'distribution': '货款' //统采划拨单
        }
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
  .amount{
    >.up{
      color: #F8931D;
      &::before{
        content: '+';
      }
    }
    >.down{
        color: #76C627;
        &::before{
          content: '-';
        }
    }
  }
</style>
