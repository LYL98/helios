<template>
  <detail-layout title="入库详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <el-row>
        <h6 class="subtitle">商品信息</h6>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品过期时间">{{detail.due_date || '-'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存过期时间">{{detail.stock_due_date || '-'}}</el-form-item>
        </el-col>
      </el-row>

      <h6 class="subtitle">入库信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库">{{detail.storehouse.title}}/{{detail.warehouse.title}}/{{detail.tray.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库人">{{detail.creator.realname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventoryMoveCheck",
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
      //返回盘点类型
      returnCheckType(){
        let { detail } = this;
        if(detail.num_after - detail.num_before > 0){
          return '盘盈';
        }
        if(detail.num_after - detail.num_before < 0){
          return '盘亏';
        }
        return '正常';
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.supCheckDetail(data.id);
      },
      //获取详情
      async supCheckDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supCheckDetail, { id });
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
  @import "@/share/scss/detail.scss";
</style>
