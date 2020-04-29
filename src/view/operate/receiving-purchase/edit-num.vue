<template>
  <form-layout title="修改合格数量" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="到货数量">
        <input-number size="medium" :value="detail.num_arrive" unit="件" disabled/>
      </el-form-item>
      <el-form-item label="合格数量" prop="num">
        <input-number size="medium" :min="0" v-model="detail.num" unit="件"/>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice, SelectOption } from '@/common';

export default {
  name: "FormEditNum",
  mixins: [formMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-option': SelectOption
  },
  created() {
  },
  data(){
    let initDetail = {
      num: ''
    }
    //品控抽样、合格数量校验
    const validNum = (rules, value, callback)=>{
      let { detail } = this;
      if (Number(value) > detail.num_arrive) {
        return callback(new Error('不能大于到货数量'));
      }
      callback();
    }
    return{
      rules: {
        num: [
          { required: true, message: '请输入数量', trigger: 'change' },
          { validator: validNum, trigger: 'blur' }
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
      let res = await Http.post(Config.api.supOutStockEditNum, {
        id: detail.id,
        num: detail.num
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已修改', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据
        let pc = this.getPageComponents('Detail');
        if(pc && pc.isShow) pc.fromSupplierOrderDetail();

        pc = this.getPageComponents('Table');
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
