<template>
  <detail-layout title="品控信息详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px">
      <h6 class="subtitle">品控信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="到货数量">{{detail.num_arrive}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品控数量">{{detail.qa_num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库数量">{{detail.num}}件</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保质期">{{detail.shelf_life}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存期">{{detail.stock_life}}</el-form-item>
        </el-col>
      </el-row>

      <template v-if="detail.un_qa_type">
        <h6 class="subtitle">不合格商品处理</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理数量">{{returnUnit(detail.un_qa_num, '件', '-')}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理类型">{{supOptTypes}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理金额">{{detail.un_qa_amount ? '￥' + returnPrice(detail.un_qa_amount) : '-'}}</el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-form-item label="备注">{{detail.remark}}</el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="品控人">{{detail.creator.realname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品控时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseQualityControlG",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    computed: {
      //处理类型
      supOptTypes(){
        let d = Constant.SUP_OPT_TYPES();
        if(this.detail.un_qa_type){
          return d[this.detail.un_qa_type];
        }
        return '-';
      },
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
