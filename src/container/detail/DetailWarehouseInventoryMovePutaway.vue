<template>
  <detail-layout title="上架详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <el-row>
        <h6 class="subtitle">商品信息</h6>
        <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量">{{detail.stock_num}}件</el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item label="入库时间">{{detail.created}}</el-form-item>
        </el-col>-->
      </el-row>
      
      <h6 class="subtitle">上架信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上架托盘">{{detail.storehouse.title}}/{{detail.warehouse.title}}/{{detail.tray.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架人">{{detail.creator.realname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventoryMoveMove",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        storehouse: {},
        warehouse: {},
        tray: {},
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
