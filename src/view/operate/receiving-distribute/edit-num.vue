<template>
  <form-layout title="修改合格数量" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="调拨数量">
        <input-number size="medium" :value="detail.num" unit="件" disabled/>
      </el-form-item>
      <el-form-item label="到货数量" prop="num_arrive">
        <input-number size="medium" :min="0" v-model="detail.num_arrive" unit="件"/>
      </el-form-item>
      <el-form-item label="合格数量" prop="qualified_num">
        <input-number size="medium" :min="0" v-model="detail.qualified_num" unit="件"/>
      </el-form-item>
      <template v-if="isShowNo">
        <h6 class="subtitle">不合格商品处理</h6>
        <el-form-item label="处理数量">
          <input-number size="medium" disabled :value="detail.un_qa_num" unit="件"/>
        </el-form-item>
        <el-form-item label="处理类型" prop="un_qa_type">
          <select-option
            size="medium"
            placeholder="请选择处理类型"
            v-model="detail.un_qa_type"
            :options="supOptTypes"
          />
        </el-form-item>
        <!---
        <el-form-item label="备注" prop="qa_remark">
          <el-input v-model="detail.qa_remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
        </el-form-item>
        -->
      </template>
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
  computed: {
    //处理类型
    supOptTypes(){
      let d = Constant.SUP_OPT_TYPES('value_key');
      delete d['退货入库']; //删除退货入库
      delete d['退货给供应商']; //删除退货给供应商
      delete d['库内品控']; //删除库内品控
      return d;
    },
    //是否显示不合格处理
    isShowNo(){
      let { detail } = this;
      //到货数量小于或等于可到货数量 && 到货数量大于合格数量
      if(typeof detail.num_arrive === 'number' && typeof detail.qualified_num === 'number' &&
        detail.num_arrive > detail.qualified_num){
          detail.un_qa_num = detail.num_arrive - detail.qualified_num;
          detail.un_qa_type = '';
          this.$data.detail = detail;
        return true;
      }
      detail.un_qa_num = 0;
      detail.un_qa_type = '';
      this.$data.detail = detail;
      return false;
    }
  },
  data(){
    let initDetail = {
      num_arrive: 0,
      qualified_num: 0,
      un_qa_num: 0,
      un_qa_type: '',
      qa_remark: ''
    }
    //品控抽样、合格数量校验
    const validNumArrive = (rules, value, callback)=>{
      let { detail } = this;
      if (Number(value) > detail.num) {
        return callback(new Error('不能大于调拨数量'));
      }
      callback();
    }
    //品控抽样、合格数量校验
    const validNumQualified = (rules, value, callback)=>{
      let { detail } = this;
      if (Number(value) > detail.num_arrive) {
        return callback(new Error('不能大于到货数量'));
      }
      callback();
    }
    return{
      rules: {
        num_arrive: [
          { required: true, message: '请输入到货数量', trigger: 'change' },
          { validator: validNumArrive, trigger: 'blur' }
        ],
        qualified_num: [
          { required: true, message: '请输入数量', trigger: 'change' },
          { validator: validNumQualified, trigger: 'blur' }
        ],
        un_qa_type: { required: true, message: '请选择处理类型', trigger: 'change' },
        qa_remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
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
      let res = await Http.post(Config.api.supAcceptEditDistributeDetail, {
        id: detail.id,
        num_arrive: detail.num_arrive,
        qualified_num: detail.qualified_num,
        un_qa_num: detail.un_qa_num,
        un_qa_type: detail.un_qa_type,
        remark: detail.qa_remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已修改', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据
        let pc = this.getPageComponents('Detail');
        if(pc && pc.isShow) pc.supAcceptDistDetail();

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
