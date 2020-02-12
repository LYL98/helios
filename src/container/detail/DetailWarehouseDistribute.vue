<template>
  <detail-layout title="调拨单详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" :type="inventoryStatusType[detail.status]" disable-transitions>
          {{inventoryStatus[detail.status]}}
        </el-tag>
      </div>
      <el-row>
        <h6 class="subtitle">调拨信息</h6>
        <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调出仓">{{detail.src_storehouse_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入仓">{{detail.tar_storehouse_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计到货">{{detail.estimate_arrive_at}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="司机姓名">{{detail.driver_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号">{{detail.driver_phone}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌">{{detail.driver_car_num}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型">{{detail.driver_car_type}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="费用">&yen;{{returnPrice(detail.fee)}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h6 class="subtitle">入库单信息</h6>
    <div style="padding: 0 16px;">
      <el-table :data="detail.in_stocks" width="100%">
        <el-table-column label="入库单号" prop="code"/>
        <el-table-column label="入库数量" prop="num"/>
        <el-table-column label="入库时间" prop="created"/>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">{{inventoryStatus[scope.row.status]}}</template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseDistribute",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        in_stocks: [],
        relate_order: {},
        creator: {}
      }
      return {
        inventoryStatus: Constant.INVENTORY_STATUS(),
        inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.supDistributeDetail(data.id);
      },
      //获取明细列表
      async supDistributeDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeDetail, { id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
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
