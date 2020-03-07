<template>
  <form-layout title="修改合格数量" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="合格数量" prop="num">
        <input-number size="medium" :min="detail.in_type === 'distribute' ? 0 : 1" v-model="detail.num" unit="件"/>
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
        <el-form-item label="处理金额" prop="un_qa_amount">
          <input-price size="medium" v-model="detail.un_qa_amount" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="detail.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice, SelectOption } from '@/common';

export default {
  name: "FormWarehouseQualityControlEditNum",
  mixins: [formMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-option': SelectOption
  },
  created() {
  },
  props: {
    fromPage: { type: String, default: 'QualityControl' }, //仓库品控 QualityControl，场地品控 Receiving
  },
  computed: {
    //处理类型
    supOptTypes(){
      let d = Constant.SUP_OPT_TYPES('value_key');
      delete d['退货入库']; //删除退货入库
      delete d['退货给供应商']; //删除退货给供应商
      return d;
    },
    //是否显示不合格处理
    isShowNo(){
      let { detail } = this;
      //到货数量小于或等于可到货数量 && 到货数量大于合格数量
      if(detail.in_type === 'distribute' &&
        typeof detail.num_arrive === 'number' && typeof detail.num === 'number' &&
        detail.num_arrive > detail.num){
          detail.un_qa_num = detail.num_arrive - detail.num;
          detail.un_qa_type = '';
          detail.un_qa_amount = '';
          this.$data.detail = detail;
        return true;
      }
      detail.un_qa_num = 0;
      detail.un_qa_type = '';
      detail.un_qa_amount = 0;
      this.$data.detail = detail;
      return false;
    }
  },
  data(){
    let initDetail = {
      un_qa_num: 0,
      un_qa_type: '',
      un_qa_amount: 0,
      remark: ''
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
        ],
        un_qa_type: { required: true, message: '请选择处理类型', trigger: 'change' },
        un_qa_amount: { required: true, message: '请输入处理金额', trigger: 'change' },
        remark: [
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
      let apis = {
        'in_stock': Config.api.supInStockEditNum,
        'accept': Config.api.supOutStockEditNum
      }
      let res = await Http.post(apis[detail.qa_event], {
        id: detail.id,
        num: detail.num,
        un_qa_num: detail.un_qa_num,
        un_qa_type: detail.un_qa_type,
        un_qa_amount: detail.un_qa_amount,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已修改', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据
        let pc = this.getPageComponents('DetailWarehouseQualityControlP');
        if(pc && pc.isShow) pc.fromSupplierOrderDetail();

        pc = this.getPageComponents('DetailWarehouseQualityControlD');
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
