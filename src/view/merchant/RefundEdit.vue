<template>
  <el-form :model="editStore" label-position="right" label-width="100px" :rules="rules" ref="ruleForm" style="width: 520px;">
    <el-form-item label="门店">
      <el-input :value="title" disabled/>
    </el-form-item>
    <el-form-item label="修改类型">
      <el-radio v-model="editStore.radio" border size="small" @change="changeType" label="1">增加</el-radio>
      <el-radio v-model="editStore.radio" border size="small" @change="changeType" label="2">减少</el-radio>
    </el-form-item>
    <el-form-item label="剩余框数">
      <ul class="edit-number">
        <li>{{ frame_num }}个</li>
        <li class="edit">
          <el-form-item prop="frame_num">
            <el-input
              style="margin-left: 10px; width: 260px;"
              v-model="editStore.frame_num"
            >
              <template slot="prepend">{{editStore.radio === '1' ? '+' : '-'}}</template>
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="剩余金额">
      <ul class="edit-number">
        <li>{{ returnPrice(frame_amount) }}元</li>
        <li class="edit">
          <el-form-item prop="frame_amount">
            <el-input
              style="margin-left: 10px; width: 260px;"
              v-model="editStore.frame_amount"
            >
              <template slot="prepend">{{editStore.radio === '1' ? '+' : '-'}}</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="editStore.remark" type="textarea" :rows="3" resize="none" placeholder="请输入备注..."/>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click.prevent="handleCloseDialog">取消</el-button>
      <el-button type="primary" :loading="isSending" @click.prevent="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Input, InputNumber, Radio, Button, Form, FormItem, Message} from 'element-ui';
  import {Constant, DataHandle} from '@/util';
  import {Merchant} from '@/service';

  export default {
    name: "RefundEdit",
    components: {
      'el-input': Input,
      'el-input-number': InputNumber,
      'el-radio': Radio,
      'el-button': Button,
      'el-form': Form,
      'el-form-item': FormItem
    },
    props: {
      store: {type: Object, required: true},
      closeDialog: Function,
      callback: Function
    },
    data() {

      let validFrameNum = (rules, value, callback) => {
        if (this.$data.editStore.radio != '1') { // 表示减

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('减少的框数必须为大于零的纯数字'));
          }

          if (!!value && String(value).indexOf(".") > -1) {
            return callback(new Error('减少的框数不能为小数'));
          }

          if (value > 100000) {
            return callback(new Error('减少的框数不能大于100000'));
          }

          if (Number(value) > this.$data.frame_num) {
            return callback(new Error('减少的框数不能大于剩余框数'));
          }
        } else {

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('增加的框数必须为大于零的纯数字'));
          }

          if (!!value && String(value).indexOf(".") > -1) {
            return callback(new Error('增加的框数不能为小数'));
          }

          if (value > 100000) {
            return callback(new Error('增加的框数不能大于100000'));
          }

        }
        callback();
      };

      let validFrameAmount = (rules, value, callback) => {
        if (this.$data.editStore.radio != '1') { // 表示减

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('减少的金额必须为大于零的纯数字'));
          }

          if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
            return callback(new Error('减少的金额最多只能输入两位小数'));
          }

          if (value > 1000000) {
            return callback(new Error('减少的金额不能大于1000000'));
          }

          if (this.handlePrice(value) > this.$data.frame_amount) {
            return callback(new Error('减少的金额不能大于剩余金额'));
          }

        } else {

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('增加的金额必须为大于零的纯数字'));
          }

          if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
            return callback(new Error('增加的金额最多只能输入两位小数'));
          }

          if (value > 1000000) {
            return callback(new Error('增加的金额不能大于1000000'));
          }
        }
        callback();

      };

      return {
        title: '',
        frame_num: 0,
        frame_amount: 0,
        editStore: {
          radio: '1',
          frame_num: '',
          frame_amount: '',
          remark: ''
        },
        isSending: false,
        rules: {
          frame_num: [
            { validator: validFrameNum, trigger: 'change' }
          ],
          frame_amount: [
            { validator: validFrameAmount, trigger: 'change' }
          ],
          remark: [
            { max: 200, message: '不能超过200个字符，请重新编辑', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      let {id, frame_num, frame_amount, title} = this.$props.store;
      this.$data.title = title;
      this.$data.frame_num = frame_num;
      this.$data.frame_amount = frame_amount;
      this.$data.editStore = Object.assign({}, this.$data.editStore, { store_id: id });
    },
    methods: {
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      handlePrice(price) {
        return DataHandle.handlePrice(price);
      },
      handleCloseDialog() {
        this.$props.closeDialog();
      },

      changeType() {
        this.$data.editStore.frame_num = '';
        this.$data.editStore.frame_amount = '';
      },

      handleSubmit() {

        // 如果验证不通过，则返回。
        if ( !this.validFiled() ) {
          return;
        }

        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.refundEdit();
          }
        })

      },

      validFiled() {

        if (!this.$data.editStore.frame_num && !this.$data.editStore.frame_amount) {
          Message.warning('退框数量 和 退框金额 不能同时为0。');
          return false;
        }

        return true;
      },

      async refundEdit() {
        this.$data.isSending = true;
        let {store_id, radio, frame_num, frame_amount, remark} = this.$data.editStore;
        frame_num = Number(frame_num) || 0; // 如果没有输入框数，则设置默认值为0
        frame_amount = this.handlePrice(frame_amount);
        let res = await Merchant.refundEdit({
          store_id,
          frame_num: radio !== '1' ? -frame_num : frame_num,
          frame_amount: radio !== '1' ? -frame_amount : frame_amount,
          remark
        });
        if (res.code === 0) {
          Message.success('门店退框信息修改成功！');
          this.$data.isSending = false;
          this.$props.callback();
          this.$props.closeDialog();
        } else {
          this.$data.isSending = false;
          Message.warning(res.message);
        }
      }
    },

  }
</script>

<style lang="scss" scoped>
  .edit-number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .edit {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
