<template>
  <detail-layout title="入库单详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
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
          <el-form-item label="调出仓">{{false && detail.src_store_house.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入仓">{{false && detail.src_store_house.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
        </el-col>
      </el-row>

      <h6 class="subtitle">入库单信息</h6>
      <div style="padding: 0 16px;">
        <el-table :data="detail.items" width="100%">
          <el-table-column label="入库单号" prop="code"/>
          <el-table-column label="入库数量" prop="num"/>
          <el-table-column label="入库时间" prop="date"/>
          <el-table-column label="状态" min-width="60">
            <template slot-scope="scope">{{scope.row.num}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
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
        src_store_house: {},
        trays: [],
        relate_order: {},
        creator: {}
      }
      return {
        inventoryType: Constant.INVENTORY_TYPES(),
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
