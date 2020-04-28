<template>
  <div>
    <el-dialog title="处理完成" :visible="isShow" :before-close="cancel" width="580px">
      <el-form label-position="right" label-width="100px" style="width: 500px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="退款金额" prop="handle_second_refund_amount">
          <input-price v-model="editData.handle_second_refund_amount" :min="0.01" :max="returnPrice(detail.amount_real)" :unit="`最多可退款金额：${returnPrice(detail.amount_real)} 元`"/>
        </el-form-item>
        <el-form-item label="处理描述" prop="handle_second_remark">
          <el-input v-model.trim="editData.handle_second_remark" type="textarea" :rows="3" resize="none"></el-input>
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
import { Http, Config } from '@/util';
import { InputPrice } from '@/common';

export default {
  name: "Allocate",
  mixins: [formMixin],
  components: {
    'input-price': InputPrice
  },
  created() {
    this.initEditDate();
  },
  data(){
    return{
      isShow: false,
      detail: {},
      editData: {
        id: '',
        handle_second_refund_amount: '',
        handle_second_remark: ''
      },
      rules: {
        handle_second_refund_amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
        ],
        handle_second_remark: [
          { required: true, message: '请输入处理描述', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    initEditDate() {
      this.editData = {
        id: '',
        handle_second_refund_amount: '',
        handle_second_remark: ''
      }
    },

    //取消
    cancel(){
      this.initEditDate();
      this.$refs['ruleForm'].resetFields();
      this.orderShowHideHandleSecond();
    },
    //提交结果
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.aftersaleHandleSecondTime();
        }
      });
    },
    //提交
    async aftersaleHandleSecondTime(){
      let { editData } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.aftersaleHandleSecondTime, editData);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.cancel();
        this.$attrs.callback();//回调
        this.$refs['ruleForm'].resetFields();
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //关闭显示
    async orderShowHideHandleSecond(detail){
      if(detail){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.post(Config.api.afterSaleDetail, { id: detail.id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.editData.id = detail.id;
          this.$data.isShow = true;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
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
