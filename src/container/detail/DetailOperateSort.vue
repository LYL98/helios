<template>
  <detail-layout title="分配详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" type="info" disable-transitions>已分拣(待添加)</el-tag>
      </div>
      <el-row>
        <h6 class="subtitle">商品信息</h6>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配方式">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入场数">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入场时间">{{detail.created}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配人">{{detail.creator.realname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h6 class="subtitle">线路信息</h6>
    <div style="padding: 0 30px;">
      <el-table :data="detail.logs" :row-class-name="highlightRowClassName">
        <el-table-column prop="created" label="时间"></el-table-column>
        <el-table-column label="操作内容">
          <template slot-scope="scope">{{logTypes[scope.row.category]}}</template>
        </el-table-column>
        <el-table-column prop="modified_attrs" label="备注"></el-table-column>
        <el-table-column prop="operator_name" label="操作人"></el-table-column>
      </el-table>
    </div>
    <div class="bottom-btn">
      <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      <el-button size="medium" type="primary" @click.native="handleShowAddEdit('AddEditOperateSort', detail, 'edit')">修改分配方式</el-button>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateSort",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
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
        this.supOutDetail(data.id);
      },
      //获取明细列表
      async supOutDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supOutDetail, { id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
          this.supInStockDetail();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //获取明细列表
      async supInStockDetail(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supInStockDetail, { id: this.detail.id });
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
