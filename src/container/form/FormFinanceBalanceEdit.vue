<template>
  <el-form label-position="right" label-width="100px" style="width: 600px;" :model="editItem" :rules="rules" ref="ruleForm">
    <el-form-item label="商户名称" class="required">
      <el-input type="text" :placeholder="editItem.title" disabled></el-input>
    </el-form-item>
    <el-form-item label="账户余额" class="required">
      <my-to-price :amount="editItem.balance" />
    </el-form-item>
    <el-form-item label="类型" class="required">
      <el-radio v-model="editItem.change_type" border size="small" @change="toggerType" :label="1">充值</el-radio>
      <el-radio v-model="editItem.change_type" border size="small" @change="toggerType" :label="-1">扣款</el-radio>
    </el-form-item>
    <el-form-item label="充值类型" prop="reason" v-if="editItem.change_type == 1">
      <el-select v-model="editItem.reason" style="width: 260px;" placeholder="请选择充值类型" clearable>
        <el-option v-for="(item, key) in rechargeReason" :key="key" :label="item" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="金额" class="required" prop="amount">
      <el-input
        v-model="editItem.amount"
        style="width: 260px;"
      >
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="editItem.remark" type="textarea" :rows="3" resize="none" placeholder="请输入备注..."></el-input>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="sending" @click="handleSubmit">提交财务审核</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Select, Option, Input, InputNumber, Radio, Button, Message, MessageBox} from 'element-ui';
  import { ToPrice } from '@/common';
  import {DataHandle, Constant, Verification} from '@/util';

  export default {
    name: 'FormFinanceBalanceEdit',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-select': Select,
      'el-option': Option,
      'el-input': Input,
      'el-input-number': InputNumber,
      'el-radio': Radio,
      'el-button': Button,
      'my-to-price': ToPrice
    },
    props: {
      item: { type: Object, required: true }, // 需要编辑的项
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    data() {

      let item = Object.assign({}, this.$props.item);

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

        if (item.change_type == -1 && (DataHandle.handlePrice(value) > item.balance)) {
          return callback(new Error('扣款金额不能超过账户余额'));
        }
        callback();
      };

      return {
        editItem: item,
        rechargeReason: Constant.MERCHANT_BALANCE_RECHARGE_REASON,

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

      toggerType() {
        this.$data.editItem.reason = '';
        // 校验金额是否满足条件
        // this.$refs['ruleForm'].validateField(['amount']);
      },

      handleSubmit() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$props.submit(this.$data.editItem);
          }
        })
      },
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
