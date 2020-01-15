<template>
  <detail-layout title="入库单详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <!--统采、地采-->
      <el-row v-if="judgeOrs(detail.in_type, ['global_pur', 'local_pur'])">
        <h6 class="subtitle">采购信息</h6>
        <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="采购单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购日期">{{detail.relate_order.order_date || detail.relate_order.purchase_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
        </el-col>
      </el-row>

      <!--调拨-->
      <el-row v-else-if="detail.in_type === 'distribute'">
        <h6 class="subtitle">调拨信息</h6>
        <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调出仓">{{detail.relate_order.src_store_house && detail.relate_order.src_store_house.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可售日期">{{detail.relate_order.available_date}}</el-form-item>
        </el-col>
      </el-row>

      <h6 class="subtitle">入库信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库类型">{{inventoryType[detail.in_type]}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="生产日期">{{detail.produce_date}}</el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in detail.trays" :key="index">
        <el-col :span="12">
          <el-form-item label="入库">
            {{item.storehouse.title}}/{{item.warehouse.title}}/{{item.tray.title}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库数量">{{item.num}}件</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人">{{detail.creator.realname || '系统'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventoryMoveAllot",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        trays: [],
        relate_order: {
          src_store_house: {},
        },
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
        this.supInStockDetail(data.id);
      },
      //获取明细列表
      async supInStockDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supInStockDetail, { id });
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
