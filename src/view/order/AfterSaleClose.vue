<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="处理完成" :visible="isShow" :before-close="cancel" width="580px">
      <el-form label-position="right" label-width="100px" style="width: 500px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="处理类型" prop="opt_type">
          <el-select v-model="editData.opt_type" placeholder="请选择" clearable>
            <el-option label="质量异常" value="quality"/>
            <el-option label="物流异常" value="delivery"/>
            <el-option label="运费退还" value="amount_delivery"/>
            <el-option label="少称" value="weight"/>
            <el-option label="与SKU描述不相符" value="not_match"></el-option>
            <el-option label="缺货/错货" value="num"></el-option>
            <el-option label="大单优惠" value="big_order_bonus"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否退款" class="required">
          <el-radio v-model="editData.isNeedRefund" :label="true" border size="small" @change="changeRadio">是</el-radio>
          <el-radio v-model="editData.isNeedRefund" :label="false" border size="small" @change="changeRadio">否</el-radio>
        </el-form-item>
        <!--<el-form-item label="最多可退款金额" v-if="editData.opt_type === 'amount_delivery' || editData.opt_type === 'amount_delivery'">-->
          <!--{{returnPrice(detail.amount_real)}} 元-->
        <!--</el-form-item>-->
        <el-form-item label="退款金额" prop="refund" v-if="editData.isNeedRefund">
          <el-input v-model.number="editData.refund">
            <template slot="append">最多可退款金额：{{returnPrice(detail.amount_real)}} 元</template>
          </el-input>
          <!--<span>最多可退款金额：{{returnPrice(detail.amount_real)}} 元</span>-->
        </el-form-item>
        <el-form-item label="处理描述" prop="opt_detail">
          <el-input v-model.trim="editData.opt_detail" type="textarea" :rows="3" resize="none"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click.native="cancel">关 闭</el-button>
          <el-button type="primary" @click.native="submit">确认提交</el-button>
        </el-form-item>
      </el-form>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--</span>-->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Select, Option, Radio, Input, Dialog } from "element-ui";
import { Config, DataHandle, Constant, Verification } from '@/util';

export default {
  name: "AfterSaleClose",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-select': Select,
    'el-option': Option,
    'el-radio': Radio,
    'el-input': Input,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'orderIsShowAfterSaleClose',
    detail: 'orderAfterSaleDetail'
  }),
  created() {
    this.initEditDate();
  },
  data(){
    return{
      tencentPath: Config.tencentPath,
      orderStatus: Constant.ORDER_STATUS,
      priceChange: Constant.PRICE_CHANGE,
      afterSaleResult: Constant.AFTER_SALE_RESULT,
      editData: {
        isNeedRefund: false,
        opt_detail: '',
        opt_type: '',
        refund: 0
      },
      rules: {
        opt_type: [
          { required: true, message: '请选择处理类型', trigger: 'change' }
        ],
        opt_detail: [
          { max: 200, message: '处理描述不能超过200个字符', trigger: 'blur' }
        ],
        refund: []
      }
    }
  },
  methods: {
    //返回金额
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },
    //返回支付类型
    returnPayType(weixin, balance){
      return DataHandle.returnPayType(weixin, balance);
    },

    initEditDate() {
      this.editData = {
        isNeedRefund: false,
        opt_detail: '',
        opt_type: '',
        refund: 0
      }
    },

    //取消
    cancel(){
      let that = this;
      that.initEditDate();
      that.$refs['ruleForm'].resetFields();
      that.orderShowHideAfterSaleClose({ isShow: false });
    },
    //选择处理结果
    changeRadio(){
      let that = this;
      let { editData, detail } = that;
      if(editData.isNeedRefund){
        var validatePrice = (rule, value, callback) => {
          if(value > that.returnPrice(detail.amount_real)){
            callback(new Error('退款金额不能大于订单商品金额'));
          }else{
            callback();
          }
        };
        let r = [
          { required: true, pattern: Verification.testStrs.isPrice, message: '请输入正确的金额', trigger: 'change' },
          { validator: validatePrice, trigger: 'change' },
        ];
        that.$data.rules.refund = r;
      }else{
        that.$data.rules.refund = [];
      }
    },
    //提交审核结果
    submit(){
      let that = this;
      let { detail, editData } = that;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.orderAfterSaleUpdate({
            data: {
              aftersale_id: detail.id,
              opt_detail: editData.opt_detail,
              opt_type: editData.opt_type,
              refund: that.handlePrice(editData.refund)
            },
            callback(){
              that.cancel();
              that.$attrs.callback();//回调, 自于AfterSaleDetail Component，用于刷新售后详情的数据。
              that.orderGetDetail(detail.order_id); // 由于订单详情中也有对售后结果的引用，所以在此处需要再次加载订单详情。
              that.initEditDate();
              that.$refs['ruleForm'].resetFields();
            }
          });
        }
      });
    },
    ...mapActions(['orderShowHideAfterSaleClose', 'orderAfterSaleUpdate', 'orderGetDetail'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
