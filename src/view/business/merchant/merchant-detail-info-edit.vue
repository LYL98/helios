<template>
  <el-form label-position="right" label-width="100px" style="width: 580px;" :model="detail" :rules="rules"
           ref="ruleForm">
    <el-form-item label="商户名称" prop="title">
      <el-input v-model="detail.title" :maxlength="10" placeholder="请输入商户名称"></el-input>
    </el-form-item>
    <el-form-item label="协议商户" class="required">
      <ul style="display: flex; align-items: flex-start; justify-content: space-between; height: 40px;">
        <li>
          <el-radio v-model="detail.is_post_pay" border size="small" :label="true">是</el-radio>
          <el-radio v-model="detail.is_post_pay" border size="small" :label="false">否</el-radio>
        </li>
        <li v-if="detail.is_post_pay === true">
          <el-form-item label="授信额度" label-width="80px" prop="credit_limit">
            <el-input v-model="detail.credit_limit" style="width: 200px;" placeholder="请输入授信额度">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="editMerchantCancel">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="merchantEdit">确认</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {Form, FormItem, Button, Input, MessageBox, Message, Dialog, Radio} from 'element-ui';
  import {Http, Config, DataHandle, Verification} from '@/util';

  export default {
    name: 'MerchantEdit',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-dialog': Dialog,
      'el-radio': Radio
    },
    props: {
      merchantDetail: {type: Object, required: false}, // 只有在编辑模式下才需要
      editMerchantSuccess: Function,
      editMerchantCancel: Function
    },
    data() {

      let {id, title, is_post_pay, credit_limit} = this.$props.merchantDetail;
      let detail = {
        id: id,
        title: title,
        is_post_pay: is_post_pay,
        credit_limit: is_post_pay ? DataHandle.returnPrice(credit_limit) : 10000, // 如果之前是授信用户，则获取授信额度；如果之前是非授信用户，则给一个初始值10000
      };
      let validCreditLimit = function (rules, value, callback) {
        if (!detail.is_post_pay) { // 如果不是协议用户，则不对该项做校验
          return callback();
        }
        if (!value) {
          return callback(new Error('授信额度不能为空'));
        }
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('授信额度必须为大于零的纯数字'));
        }
        if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
          return callback(new Error('授信额度最多只能输入两位小数'));
        }

        if (value > 1000000) {
          return callback(new Error('授信额度不能超过1000000'));
        }
        callback();
      };

      return {
        isSending: false,
        detail: detail,
        rules: {
          title: [
            {required: true, message: '商户名称不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          credit_limit: [
            {validator: validCreditLimit, trigger: 'change'}
          ],
        }
      }
    },
    methods: {

      //修改商户信息
      async merchantEdit() {
        let that = this;
        let {id, title, is_post_pay, credit_limit} = that.detail;
        credit_limit = is_post_pay ? DataHandle.handlePrice(credit_limit) : 0;

        that.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            that.isSending = true;
            let res = await Http.post(Config.api.merchantEdit, {id, title, is_post_pay, credit_limit});
            that.isSending = false;
            if (res.code === 0) {
              that.$refs['ruleForm'].resetFields();
              this.editMerchantSuccess();
              Message.success(`商户信息修改成功！`, '提示');
            } else {
              // this.editMerchantCancel();
              Message.warning(res.message);
            }
          }

        });

      }
    }
  }

</script>

<style lang="scss" scoped>
</style>
