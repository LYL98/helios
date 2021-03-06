<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="处理完成" :visible="isShow" :before-close="cancel" width="580px">
      <el-form label-position="right" label-width="100px" style="width: 500px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="处理类型" prop="opt_type">
          <el-select v-model="editData.opt_type" placeholder="请选择" clearable>
            <el-option v-for="(key, item) in afterSaleOptType" :key="key" :value="key" :label="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="处理件数" prop="num">
          <input-number v-model="editData.num" style="width: 190px;" unit="件"/>
        </el-form-item>
        <el-form-item label="是否退货" class="required">
          <el-radio v-model="editData.if_restore" :label="true" border size="small">是</el-radio>
          <el-radio v-model="editData.if_restore" :label="false" border size="small">否</el-radio>
        </el-form-item>
        <el-form-item label="是否退款" class="required">
          <el-radio v-model="editData.if_refund" :label="true" border size="small">是</el-radio>
          <el-radio v-model="editData.if_refund" :label="false" border size="small">否</el-radio>
        </el-form-item>
        <el-form-item label="退款金额" prop="refund" v-if="editData.if_refund">
          <input-price v-model="editData.refund" :min="0.01" :max="returnPrice(detail.amount_real)" :unit="`最多可退款金额：${returnPrice(detail.amount_real)} 元`"/>
        </el-form-item>
        <el-form-item label="处理描述" prop="opt_detail">
          <el-input v-model.trim="editData.opt_detail" type="textarea" :rows="3" resize="none"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click.native="cancel">取 消</el-button>
          <el-button type="primary" @click.native="submit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, DataHandle, Constant, Verification } from '@/util';
import { InputPrice, InputNumber } from '@/common';

export default {
  name: "FormOrderAfterSaleClose",
  mixins: [formMixin],
  components: {
    'input-price': InputPrice,
    'input-number': InputNumber
  },
  created() {
    this.initEditDate();
  },
  data(){
    
    return{
      isShow: false,
      detail: {},
      orderStatus: Constant.ORDER_STATUS,
      priceChange: Constant.PRICE_CHANGE,
      afterSaleResult: Constant.AFTER_SALE_RESULT,
      editData: {
        if_refund: false,
        opt_detail: '',
        opt_type: '',
        refund: '',
        num: ''
      },
      rules: {
        opt_type: [
          { required: true, message: '请选择处理类型', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入处理件数', trigger: 'change' },
          { type: 'integer', min: 0, max: 10, message: '件数不能大于10件', trigger: 'change' }
        ],
        opt_detail: [
          { max: 200, message: '处理描述不能超过200个字符', trigger: 'blur' }
        ],
        refund: [
          { required: true, message: '请输入金额', trigger: 'change' },
        ]
      }
    }
  },
  computed: {
    afterSaleOptType(){
      let d = Constant.AFTER_SALE_OPT_TYPE('value_key');
      delete d['缺货/错货']; //不显示缺货/错货（已拆开）
      return d;
    }
  },
  methods: {
    //返回支付类型
    returnPayType(weixin, balance){
      return DataHandle.returnPayType(weixin, balance);
    },

    initEditDate() {
      this.editData = {
        if_restore: false,
        if_refund: false,
        opt_detail: '',
        opt_type: '',
        num: '',
        refund: ''
      }
    },

    //取消
    cancel(){
      this.initEditDate();
      this.$refs['ruleForm'].resetFields();
      this.orderShowHideAfterSaleClose();
    },
    //提交结果
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.orderAfterSaleUpdate();
        }
      });
    },
    //提交
    async orderAfterSaleUpdate(){
      let { detail, editData } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.afterSaleUpdate, {
        aftersale_id: detail.id,
        opt_detail: editData.opt_detail,
        opt_type: editData.opt_type,
        if_restore: editData.if_restore,
        if_refund: editData.if_refund,
        refund: editData.if_refund ? editData.refund : 0,
        num: editData.num,
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.cancel();
        let pc = this.getPageComponents('DetailOrderAfterSale');
        if(pc) pc.orderAfterSaleDetail(detail.id);
        this.initEditDate();
        this.$refs['ruleForm'].resetFields();
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //关闭显示
    orderShowHideAfterSaleClose(data){
      if(data){
        this.$data.editData.refund = data.max_refund_amount;
        this.$data.detail = data;
        this.$data.rules.num[1].max = data.count_real;
        this.$data.rules.num[1].message = `件数不能大于${data.count_real}件`;
        this.$data.isShow = true;
      }else{
        this.$data.isShow = false;
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
