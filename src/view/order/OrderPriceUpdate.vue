<template>
  <div>
    <el-dialog title="订单价格修改" :visible="isShow" :before-close="cancel">
      <el-form label-position="right" label-width="100px" style="width: 420px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="订单原价">
          &yen; {{returnPrice(detail.amount_order)}}
        </el-form-item>
        <el-form-item label="新价格" prop="new_amount">
          <el-input v-model.number="editData.new_amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editData.remark" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="submitNoticeAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, MessageBox, Dialog, RadioGroup, Radio } from 'element-ui';
import { Config, DataHandle, Constant, Verification } from '@/util';

export default {
  name: "OrderPriceUpdate",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-radio-group': RadioGroup,
    'el-radio': Radio
  },
  data(){
    return{
      isShow: 'orderIsShowPriceUpdate', //
      detail: 'orderDataDetail', //
      editData: {
        new_amount: '',
        remark: ''
      },
      rules: {
        new_amount: [
          { required: true, message: '请输入新的价格', trigger: 'change' },
          { type: 'number', message: '请输入正确的金额', trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 100, message: '备注不能大于100个字符', trigger: 'blur' }
        ]
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
    //取消
    cancel(){
      this.$refs['ruleForm'].resetFields();
      this.orderShowHidePriceUpdate({ isShow: false });
    },
    //确认提交
    submitNoticeAddEdit(){
      let that = this;
      let { detail, editData } = that;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.orderPriceUpdate({
            data: {
              id: detail.id,
              new_amount: that.handlePrice(editData.new_amount),
              remark: editData.remark
            },
            callback(){
              that.$attrs.callback();//回调
              that.cancel();
            }
          });
        }
      });
    },
    ...mapActions(['orderShowHidePriceUpdate', 'orderPriceUpdate'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
