<template>
  <form-layout title="修改入库数量" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="入库数量" prop="num">
        <input-number size="medium" v-model="detail.num" unit="件"/>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "FormWarehouseQualityControlEditNum",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
  },
  data(){
    let initDetail = {}
    return{
      rules: {
        num: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ]
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail)
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supInStockEditNum, {
        id: detail.id,
        num: detail.num
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已修改', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据
        let pc = this.getPageComponents('DetailWarehouseQualityControlG');
        if(pc && pc.isShow) pc.supplierGPurchaseDetail();

        pc = this.getPageComponents('DetailWarehouseQualityControlL');
        if(pc && pc.isShow) pc.supplierLocalPurchaseDetail();

        pc = this.getPageComponents('DetailWarehouseQualityControlA');
        if(pc && pc.isShow) pc.supDistributeDetail();

        pc = this.getPageComponents('TableWarehouseQualityControl');
        if(pc) pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
