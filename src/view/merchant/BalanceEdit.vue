<template>
  <el-form label-position="right" label-width="100px" style="width: 560px;" :model="dataItem" :rules="rules" ref="ruleForm">
    <el-form-item label="商户名称" class="required">
      <el-input type="text" :placeholder="merchant_title" disabled></el-input>
    </el-form-item>
    <el-form-item label="类型" class="required">
      <el-radio v-model="dataItem.change_type" @change="toggerType" :label="1">充值</el-radio>
      <el-radio v-model="dataItem.change_type" @change="toggerType" :label="-1">扣款</el-radio>
    </el-form-item>
    <el-form-item label="充值类型" prop="reason" v-if="dataItem.change_type == 1">
      <el-select v-model="dataItem.reason" style="width: 260px;" placeholder="请选择充值类型" clearable>
        <el-option v-for="(item, key) in rechargeReason" :key="key" :label="item" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="金额" class="required" prop="amount">
      <el-input
        v-model="dataItem.amount"
        style="width: 260px;"
      >
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataItem.remark" type="textarea" :rows="3" resize="none" placeholder="请输入备注..."></el-input>
    </el-form-item>
    <el-form-item style="padding: 20px 20px 0px 260px;">
      <el-button @click="cancelBalanceEdit">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="submitEdit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Select, Option, Input, InputNumber, Radio, Button, Message, MessageBox} from 'element-ui';
  import {Http, Config, DataHandle, Constant, Verification } from '@/util';

  export default {
    name: 'BalanceEdit',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-select': Select,
      'el-option': Option,
      'el-input': Input,
      'el-input-number': InputNumber,
      'el-radio': Radio,
      'el-button': Button
    },
    props: {
      merchant_title: String,
      cancelBalanceEdit: Function,
      confirmBalanceEdit: Function
    },
    data() {

      let validAmount = (rules, value, callback) => {

        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('金额必须为大于零的纯数字'));
        }

        if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
          return callback(new Error('金额最多只能输入两位小数'));
        }

        if (value > 1000000) {
          return callback(new Error('金额不能超过1000000'));
        }
        callback();
      };

      return {
        merchant_id: 'merchant_id', //
        rechargeReason: Constant.MERCHANT_BALANCE_RECHARGE_REASON,
        isLostReason: '',
        isError: '',
        isSending: false,
        dataItem: {
          change_type: 1, // 1 充值(默认) ；-1 扣款
          reason: '',
          amount: '',
          remark: '' //备注
        },
        rules: {
          reason: [
            { required: true, message: '请选择充值类型', trigger: 'change' }
          ],
          amount: [
            { required: true, message: '金额不能为空', trigger: 'change' },
            { validator: validAmount, trigger: 'blur' }
          ],
          remark: [
            { max: 200, message: '不能超过200个字符，请重新编辑', tirgger: 'change' }
          ]
        }
      }
    },
    methods: {

      handlePrice(value) {
        return DataHandle.handlePrice(value);
      },
      returnPrice(value) {
        return DataHandle.returnPrice(value);
      },

      toggerType() {
        this.dataItem.reason = '';
      },

      async submitEdit() {
        let that = this;
        let {dataItem, confirmBalanceEdit, merchant_id} = that;

        that.$refs['ruleForm'].validate(async valid => {
          if (valid) {
            that.isSending = true;
            // dataItem = {...dataItem, amount: this.handlePrice(dataItem.amount), id: merchant_id};
            let data = {
              id: merchant_id,
              change_type: dataItem.change_type,
              reason: dataItem.change_type == 1 ? dataItem.reason : 'manual_other',
              amount: that.handlePrice(dataItem.amount),
              remark: dataItem.remark
            }
            let res = await Http.post(Config.api.merchantBalanceEdit, data);
            that.isSending = false;

            if (res.code === 0) {
              confirmBalanceEdit(res.data);
              let messageTitle = dataItem.change_type == 1 ? '充值' : '扣款';
              Message.success(`${messageTitle}成功！当前余额：${this.returnPrice(res.data.balance)}`);
            } else {
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
