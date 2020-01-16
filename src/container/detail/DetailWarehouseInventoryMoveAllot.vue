<template>
  <detail-layout title="调拨详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
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
          <el-form-item label="库库数量">{{detail.pre_num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>

      <h6 class="subtitle">调拨信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="调出仓库">
            <div v-for="(item, index) in detail.dist_outs" :key="index">{{item.src_storehouse.title}}/{{item.src_warehouse.title}}/{{item.src_tray.code}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="调入仓库">{{detail.tar_storehouse.title}}/临时库</el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人">{{detail.creator.realname}}</el-form-item>
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
        dist_outs: [],
        tar_storehouse: {},
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.supDistributeRecordDetail(data.id);
      },
      //获取明细列表
      async supDistributeRecordDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeRecordDetail, { id });
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
