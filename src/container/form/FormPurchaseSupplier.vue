<template>
  <el-form style="width: 620px;" label-position="right" label-width="110px" ref="ruleForm" :rules="rules"
           :model="editItem">
    <el-form-item label="供应商编码" prop="code">
      <el-input v-model.trim="editItem.code" :maxlength="12" placeholder="请输入供应商编码"></el-input>
    </el-form-item>
    <el-form-item label="供应商名称" prop="name">
      <el-input v-model.trim="editItem.name" :maxlength="10" placeholder="请输入供应商名称"></el-input>
    </el-form-item>
    <el-form-item label="档口号" prop="supplier_code">
      <el-input v-model.trim="editItem.supplier_code" :maxlength="30" placeholder="请输入档口号"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="contact">
      <el-input v-model.trim="editItem.contact" :maxlength="10" placeholder="请输入联系人"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone">
      <el-input v-model.trim="editItem.phone" :maxlength="11" placeholder="请输入联系方式"></el-input>
    </el-form-item>
    <el-form-item label="开户行" prop="bank_name">
      <el-input v-model.trim="editItem.bank_name" :maxlength="10" placeholder="请输入开户行"></el-input>
      <!--<el-autocomplete-->
        <!--style="width: 100%;"-->
        <!--clearable-->
        <!--v-model.trim="editItem.bank_name"-->
        <!--:fetch-suggestions="bankSearch"-->
        <!--@select="bankSelect"-->
        <!--placeholder="请选择输入开户行"-->
      <!--&gt;</el-autocomplete>-->
    </el-form-item>
    <el-form-item label="账户名称" prop="bank_account_owner">
      <el-input v-model.trim="editItem.bank_account_owner" :maxlength="10" placeholder="请输入账户名称"></el-input>
    </el-form-item>
    <el-form-item label="银行账户号" prop="bank_account" class="required">
      <el-input v-model.trim="bankAccountFormat" :maxlength="31" placeholder="请输入银行账户号"></el-input>
    </el-form-item>
    <el-form-item label="账号类型" prop="pay_type">
      <el-radio-group v-model="editItem.pay_type">
        <el-radio class="radio" label="cash">现付</el-radio>
        <el-radio class="radio" label="week">周结（每周五）</el-radio>
        <el-radio class="radio" label="half_month">半月结（每月20号、5号）</el-radio>
        <el-radio class="radio" label="month">月结（每月5号）</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <div style="display: flex; justify-content: flex-end;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="sending" @click.prevent="handleSubmit">确认</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>

  /**
   * 表单的编辑流程：
   * 1、判断 新增 还是 编辑 模式？获取初始化数据（自身构建）
   * 2、copy一份数据出来，对数据进行编辑
   * 3、验证数据
   * 4、提交数据
   */

  import {mapGetters} from 'vuex';
  import {Form, FormItem, Input, Autocomplete, Radio, RadioGroup, Button} from 'element-ui';
  import { Http, Config, Verification } from '@/util';

  export default {
    name: "FormPurchaseSupplier",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-autocomplete': Autocomplete,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-button': Button
    },
    props: {
      item: { type: Object, required: true }, // 需要编辑的项
      isModify: { type: Boolean, default: false }, // 是否为编辑模式
      submit: { type: Function, required: true },
      close: { type: Function, required: true },
      sending: { type: Boolean, required: true }
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    computed: {
      bankAccountFormat: {
        get() {
          // 在银行账号显示时候 进行format 处理
          return this.$data.editItem.bank_account.replace(/(\d{4})(?=\d)/g, "$1 ");
        },
        set(v) {
          // 对银行账号进行 去除中间空格处理
          this.$data.editItem.bank_account = v.split(' ').join('');
        }
      }
    },
    data() {

      let item = Object.assign({}, this.$props.item);
      let codeInModify = this.$props.item.code;
      let isModify = this.$props.isModify;

      let validCode = function(rules, value, callback) {

        // 如果是编辑模式，并且code没有发生变动，则直接通过验证
        if (isModify && value === codeInModify) {
          return callback();
        }
        if (!Verification.isNumber(value)) {
          return callback(new Error('请输入12位以内的数字'));
        }
        Http.get(Config.api.baseSupplierList, { code: value })
          .then(res => {
            if (res.data && res.data.length > 0) {
              return callback(new Error('供应商编码重复,请重新输入'));
            } else {
              callback();
            }
          })
          .catch(error => {
            callback();
          })

      }

      let validBankAccount = function(rules, value, callback) {
        if (isNaN(value)) {
          return callback(new Error('请输入25位以内的数字'));
        }
        if (value.length <= 25) {
          callback();
        } else {
          callback(new Error('请输入25位以内的数字'));
        }
      };
      return {
        editItem: item, // 编辑表单的值
        rules: {
          code: [
            { required: true, message: '供应商编码不能为空', trigger: 'change' },
            { validator: validCode, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '供应商名称不能为空', trigger: 'change' },
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
          ],
          supplier_code: [
            { required: true, message: '档口号不能为空', trigger: 'change' },
            { max: 30, message: '请输入30个以内的字符', trigger: 'blur' }
          ],
          contact: [
            { required: true, message: '联系人不能为空', trigger: 'change' },
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '联系方式不能为空', trigger: 'change' },
            { pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur' }
          ],
          bank_name: [
            { required: true, message: '开户行不能为空', trigger: 'change' },
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
          ],
          bank_account_owner: [
            {required: true, message: '账户名称不能为空', trigger: 'change'},
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
          ],
          bank_account: [
            {required: true, message: '银行账户号不能为空', trigger: 'change'},
            { validator: validBankAccount, trigger: 'blur' }
          ],
          pay_type: [
            {required: true, message: '请选择账号类型', trigger: 'change'}
          ]
        }
      }
    },
    methods: {

      bankSearch(queryString, cb) {
        let restaurants = [
          { value: '中国工商银行' },
          { value: '中国建设银行' },
          { value: '中国银行' },
          { value: '中国农业银行' },
          { value: '中国邮政储蓄' },
          { value: '招商银行' },
          { value: '平安银行' },
          { value: '中信银行' },
          { value: '交通银行' },
          { value: '光大银行' },
          { value: '兴业银行' }
        ];
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },

      bankSelect(item) {
        // 获取选中项的值。
      },
      
      handleSubmit() {
        this.$refs['ruleForm'].validate(volid => {
          if (volid) {
            // 向父组件提交修改好的item
            this.$emit('change', this.$data.editItem);
            this.$props.submit();
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
  .radio {
    display: block;
    padding: 10px 0;
    margin-left: 0px;
  }
</style>
