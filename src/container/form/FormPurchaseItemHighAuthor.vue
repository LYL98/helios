<template>
  <el-form style="width: 600px;" label-position="right" label-width="100px" ref="ruleForm" :rules="rules"
           :model="editItem">
    <el-form-item label="选择供应商" prop="supplier_id" class="required">
      <my-select-supplier :provinceCode="province.code" style="width: 100%" v-model="editItem.supplier_id" :clearable="false"></my-select-supplier>
    </el-form-item>
    <el-form-item label="采购日期" prop="purchase_date" class="required">
      <el-date-picker type="date" value-format="yyyy-MM-dd" style="width: 100%" v-model="editItem.purchase_date" placeholder="请选择采购日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="采购总额" prop="total_price" class="required">
      <el-input v-model.trim="editItem.total_price" placeholder="输入采购总额">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="采购件数" prop="number" class="required">
      <el-input v-model.trim="editItem.number" placeholder="请输入采购件数">
        <template slot="append">件</template>
      </el-input>
    </el-form-item>
    <el-form-item label="重量总计" class="required" :error="error.weight">
      <el-input v-model.trim="editItem.weight" placeholder="请输入重量总计" :disabled="editItem.sale_unit === '件'" @input="changeWeight">
        <template slot="append">斤</template>
      </el-input>
    </el-form-item>
    <!-- status: 审核状态 仓管待审(init)/财务待审(first_checked)/审核通过(second_checked)/驳回(declined) -->
    <el-form-item label="审核状态" prop="status">
      <el-select placeholder="选择审核状态" v-model="editItem.status" style="width: 100%">
        <el-option
          v-for="(item, key) in approveStatus"
          :key="key"
          :label="item"
          :value="key"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否含框">
      {{ editItem.frame && editItem.frame.code ? `含 ( ${returnPrice(editItem.frame.price)} 元 / 件 )` : '不含' }}
    </el-form-item>
    <el-form-item label="单价" prop="unit_price" :error="error.unit_price">
      {{ computedUnitPrice }} 元 / {{ editItem.sale_unit }}
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
  import { mapGetters } from 'vuex';
  import { Form, FormItem, Input, Radio, RadioGroup, DatePicker, Select, Option, Button, Message } from 'element-ui';
  import { SearchItem, SearchSupplier } from '@/container/search';
  import { SelectSupplier } from '@/container';
  import { Base } from '@/service';
  import { DataHandle } from '@/util';
  export default {
    name: "FormPurchaseItemHighAuthor",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'el-button': Button,
      'my-search-item': SearchItem,
      'my-search-supplier': SearchSupplier,
      'my-select-supplier': SelectSupplier,
    },
    props: {
      item: { type: Object, required: true }, // 需要编辑的项
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type:Boolean, required: true}
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    computed: {
      ...mapGetters({
        province: 'globalProvince'
      }),
      computedUnitPrice: {
        get() {
          let total = this.editItem.total_price;

          if (this.editItem.frame && this.editItem.frame.code) {
            // 如果含框，则采购总金额 需要扣掉框的价格
            total = total - DataHandle.returnPrice(this.editItem.frame.price * this.editItem.number);
          }
          // 如果是按件计价的 总金额 / 数量；如果是按斤计价的 总金额 / 重量
          if (this.editItem.sale_unit === '件') {

            this.editItem.unit_price = this.editItem.number && this.editItem.number > 0
              ? DataHandle.returnPrice(DataHandle.handlePrice(total) / this.editItem.number)
              : 0;

          } else {

            this.editItem.unit_price = this.editItem.weight && this.editItem.weight > 0
              ? DataHandle.returnPrice(DataHandle.handlePrice(total) / this.editItem.weight)
              : 0;

          }

          if (this.editItem.unit_price <= 0) {
            this.$data.error.unit_price = '单价必须大于0';
          } else {
            this.$data.error.unit_price = '';
          }

          return this.editItem.unit_price;
        }
      }
    },
    data() {
      let item = Object.assign({}, this.$props.item);
      let validSupplier = function(rules, value, callback) {
        if (!!value) {
          callback();
        } else {
          callback(new Error('请选择供应商'));
        }
      };
      let validTotalPrice = function(rules, value, callback) {
        if (!value && value !== 0) {
          return callback(new Error('采购总额不能为空'));
        }
        if (value <= 0 || isNaN(value)) {
          return callback(new Error('采购总额为大于零的纯数字'));
        }
        if (!/^[0-9]+([.]\d{0,2})?$/.test(value)) {
          return callback(new Error('采购总额最多只能输入两位小数'));
        }
        if (value > 1000000) {
          return callback(new Error('采购总额不能超过1000000'));
        }
        callback();
      };
      let validNumber = function(rules, value, callback) {
        if (!value && value !== 0) {
          return callback(new Error('采购件数不能为空'));
        }
        if (value <= 0 || isNaN(value)) {
          return callback(new Error('采购件数为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('采购件数不能为小数'));
        }
        if (value > 100000) {
          return callback(new Error('采购件数不能超过100000'));
        }
        callback();
      };
      let validWeight = function(rules, value, callback) {
        if (!value && value !== 0) {
          return callback(new Error('重量总计不能为空'));
        }
        if (value <= 0 || isNaN(value)) {
          return callback(new Error('重量总计为大于零的纯数字'));
        }
        if (!/^[0-9]+([.]\d{0,1})?$/.test(value)) {
          return callback(new Error('重量总计最多只能输入一位小数'));
        }
        if (value > 100000) {
          return callback(new Error('重量总计不能超过100000'));
        }
        callback();
      };
      let validUnitPrice = function(rules, value, callback) {
        if (value <= 0) {
          return callback(new Error('单价必须大于0'));
        }
        callback();
      }

      let rules = {
        supplier_id: [
          { validator: validSupplier, trigger: 'change' }
        ],
        purchase_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
        ],
        total_price: [
          { validator: validTotalPrice, trigger: 'change' }
        ],
        number: [
          { validator: validNumber, trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
        ]
      }

      //  init', 'first_checked', 'second_checked', 'first_declined', 'second_declined'

      return {
        editItem: item,
        error: {
          unit_price: '',
          weight: ''
        },
        rules: rules,
        approveStatus: {
          init: '仓管待审',
          first_checked: '仓管审核通过',
          first_declined: '仓管驳回',
          second_checked: '财务审核通过',
          second_declined: '财务驳回'
        }
      }
    },
    created() {
      this.setFramePrice();
    },
    methods: {
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      async setFramePrice() {
        let res = await Base.baseFrameList();
        if (res.code === 0) {
          res.data.some(item => {
            if (item.code === this.$data.editItem.frame_code) {
              this.$data.editItem.frame.code = item.code;
              this.$data.editItem.frame.price = item.price;
              return true;
            }
          })
        } else {
          Message.warning(res.message);
        }
      },
      handleSubmit() {
        if (!this.$data.error.unit_price & this.validWeight()) {
          this.$refs['ruleForm'].validate(volid => {
            if (volid) {
              // 向父组件提交修改好的item
              this.$props.submit(this.$data.editItem);
            }
          })
        }

      },
      changeWeight(v) {
        if (this.validWeight()) {
          this.$data.error.weight = '';
        }
      },
      validWeight() {
        if (this.$data.editItem.sale_unit === '件') {
          return true;
        }
        let value = this.$data.editItem.weight;
        if (!value && value !== 0) {
          this.$data.error.weight = '重量总计不能为空';
          return false;
        }
        if (value <= 0 || isNaN(value)) {
          this.$data.error.weight = '重量总计必须为大于零的纯数字';
          return false;
        }
        if (!/^[0-9]+([.]\d{0,1})?$/.test(value)) {
          this.$data.error.weight = '重量总计最多只能输入一位小数';
          return false;
        }
        if (value > 100000) {
          this.$data.error.weight = '重量总计不能超过100000';
          return false;
        }
        return true;
      },
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style scoped>

</style>
