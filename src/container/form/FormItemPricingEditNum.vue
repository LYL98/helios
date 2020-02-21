<template>
  <form-layout title="增加供应商库存" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="供应商名称">{{detail.title}}</el-form-item>
      <el-form-item label="当前库存">
        <input-number size="medium" disabled :value="detail.bidding.num" unit="件"/>
      </el-form-item>
      <el-form-item label="增加库存" prop="add_num">
        <input-number size="medium" :min="1" v-model="detail.add_num" unit="件"/>
      </el-form-item>
      <el-form-item label="增加后库存">
        <input-number size="medium" disabled :value="detail.add_num ? detail.bidding.num + detail.add_num : detail.bidding.num" unit="件"/>
      </el-form-item>
    </el-form>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "FormlItemPricingEditNum",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber
  },
  data(){
    let initDetail = {
      bidding: {},
      add_num: ''
    }
    return{
      rules: {
        add_num: { required: true, message: '请输入增加库存数量', trigger: 'change' }
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemPriceEditNum, {
        id: detail.id,
        num: detail.add_num
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '库存修改成功', type: 'success'});
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailItemPricing');
        pc.itemPriceDetail(pc.detail);

        //刷新列表
        pc = this.getPageComponents('TableItemPricing');
        pc.getData(pc.query);

        this.handleCancel(); //隐藏
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
