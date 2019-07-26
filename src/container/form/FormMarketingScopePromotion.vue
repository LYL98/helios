<template>
  <el-form :model="editItem" style="width: 600px;" label-position="right" label-width="100px" ref="ruleForm"
           :rules="rules">
    <el-form-item label="促销类型" class="required">
      <el-radio-group v-model="editItem.promotion_type" class="required" prop="promotion_type"
                      @change="handleCutoverType">
        <el-radio border size="small" label="type_reduction">全场满减</el-radio>
        <el-radio border size="small" label="scope_discount">全场满折</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="活动主题" prop="topic">
      <el-input v-model="editItem.topic" :maxlength="15" placeholder="请输入活动主题"></el-input>
    </el-form-item>
    <el-form-item label="促销时间" prop="pickerValue" class="required" :rules="[{ validator: validPickerValue, trigger: 'blur' }]">
      <el-date-picker
        style="width: 100%;"
        v-model="editItem.pickerValue"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="changePicker"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="活动规则" class="required" :error="error.rules">
      <ul class="rules">
        <li v-for="(item, index) in editItem.rules" :key="'rule-' + index">
          <div style="display: flex;">
            <span style="margin-right: 10px;">订单满</span>
            <el-form-item
              :prop="'rules.' + index + '.full'"
              :rules="[
                { required: true, message: '满金额不能为空', trigger: 'change' },
                { validator: validFull, trigger: 'blur' }
              ]"
            >
              <div style="display: flex; align-items: center;">
                <el-input size="small" style="width: 140px;" v-model.trim="item.full">
                </el-input>
                <span style="margin-left: 10px;">元</span>
              </div>
            </el-form-item>
            <span style="margin-left: 30px; margin-right: 10px;">{{ editItem.promotion_type === 'type_reduction' ? '减' : '打' }}</span>
            <el-form-item
              :prop="'rules.' + index + '.reduction'"
              :rules="[
                { required: true, message: `${ editItem.promotion_type === 'type_reduction' ? '减金额' : '折扣' }不能为空`, trigger: 'change' },
                { validator: editItem.promotion_type === 'type_reduction' ? validReduction : validDiscount, trigger: 'blur' }
              ]"
            >
              <div style="display: flex; align-items: center;">
                <el-input size="small" style="width: 140px;" v-model.trim="item.reduction">
                </el-input>
                <span style="margin-left: 10px;">{{ editItem.promotion_type === 'type_reduction' ? '元' : '折' }}</span>
              </div>
            </el-form-item>
          </div>
          <i class="el-icon-close icon-button" v-if="index > 0" @click="handleRemoveRule(index)"></i>
        </li>
      </ul>
      <div class="rule-plus" v-if="editItem.rules.length < 3" @click="handleAddRule">
        <i class="el-icon-circle-plus icon-button" style="margin-left: -5px;"></i>
        <span>增加优惠阶梯</span>
      </div>
    </el-form-item>
    <el-form-item style="display: flex; justify-content: flex-end;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="sending" @click="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Table, TableColumn, DatePicker, Radio, RadioGroup, Input, Button, Message} from 'element-ui';
  import {SearchItem} from '@/container/search';
  import {Item} from '@/service';

  export default {
    name: "FormMarketingScopePromotion",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-date-picker': DatePicker,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-input': Input,
      'el-button': Button,
      'my-search-item': SearchItem
    },
    props: {
      item: {type: Object, required: true}, // 需要编辑的项
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    data() {
      let that = this;
      let item = Object.assign({}, this.$props.item);
      // let itemScopePromotionRepeat = async (value, callback) => {
      //   console.log("获取查询时间段", value);
      //   let res = await Item.scopePromotionRepeat({province_code: "01", time_start: value[0], time_end: value[1]});
      //   if (res.code === 0) {
      //     console.log("请求成功", res.data);
      //   } else {
      //     console.log("请求失败", res)
      //   }
      // };
      // let validPickerValue = function (rules, value, callback) {
      //   if (!value) {
      //     return callback(new Error('请选择活动开始和结束时间'));
      //   } else if (new Date().getTime() > new Date(value[1]).getTime()) {
      //     return callback(new Error('活动结束时间不能小于当前时间'));
      //   } else {
      //     itemScopePromotionRepeat(value, callback);
      //   }
      // };
      let validFull = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('满金额必须为大于零的纯数字'));
        }
        if (!!value && String(value).indexOf(".") > -1) {
          return callback(new Error('满金额必须为整数'));
        }
        if (!!value && value > 1000000) {
          return callback(new Error('满金额不能超过1000000'));
        }
        callback();
      };
      let validReduction = function (rules, value, callback) {
        let strList = rules.field.split(".");
        let index = Number(strList[1]);
        let full = Number(item.rules[index].full);
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('减金额必须为大于零的纯数字'));
        }
        if (!!value && String(value).indexOf(".") > -1) {
          return callback(new Error('减金额必须为整数'));
        }
        if (!!value && value > 1000000) {
          return callback(new Error('减金额不能超过1000000'));
        }
        if (full && Number(full) <= value) {
          return callback(new Error('减金额必须小于满金额'));
        }
        callback();
      };
      let validDiscount = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('折扣必须为大于零的纯数字'));
        }
        if (!!value && !/^[0-9]+([.]\d{1})?$/.test(value)) {
          return callback(new Error('折扣最多输入1位小数'));
        }
        if (!!value && value >= 10) {
          return callback(new Error('折扣不能大于等于10'));
        }
        callback();
      }
      return {
        province: this.$province,
        editItem: item,
        error: {
          rules: ''
        },
        rules: {
          promotion_type: [
            {required: true, message: '请选择促销的类型', trigger: 'change'}
          ],
          topic: [
            {required: true, message: '活动主题不能为空', trigger: 'change'},
            {max: 15, message: '请输入15个以内的字符', trigger: 'blur'}
          ],
          // pickerValue: [
          //   {validator: validPickerValue, trigger: 'blur'}
          // ]
        },
        validFull: validFull,
        validReduction: validReduction,
        validDiscount: validDiscount
      }
    },
    methods: {
      handleCutoverType(label) {
        // 切换活动规则时，初始化活动规则。
        this.$data.editItem.rules = [{full: null, reduction: null}];
        // 表单清空验证规则
        this.$data.error.rules = '';
        this.$refs['ruleForm'].resetFields();
      },
      //搜索日期
      changePicker(value) {
        if (value && value.length === 2) {
          this.$data.error.items = '';
          this.$data.editItem.time_start = value[0];
          this.$data.editItem.time_end = value[1];
        } else {
          this.$data.editItem.pickerValue = null;
          this.$data.editItem.time_start = '';
          this.$data.editItem.time_end = '';
        }
      },
      validPickerValue(rules, value, callback) {
        if (value) {
          if (value.length <= 1) {
            return callback(new Error('请选择活动开始和结束时间'));
          } else if (new Date().getTime() > new Date(value[1]).getTime()) {
            return callback(new Error('活动结束时间不能小于当前时间'));
          } else if (value[0] === value[1]) {
            return callback(new Error('活动开始和结束时间不能相等'));
          } else {
            this.itemScopePromotionRepeat(value, callback);
          }
        } else {
          return callback(new Error('请选择活动开始和结束时间'));
        }
      },

      async itemScopePromotionRepeat(value, callback) {
        let res = await Item.scopePromotionRepeat({province_code: this.province.code, time_start: value[0], time_end: value[1]});
        if (res.code === 0) {
          if (!res.data) {
            callback();
          } else {
            callback(new Error('当前时间段已经存在全场营销活动'));
          }
        } else {
          callback(new Error('查询全场营销活动信息失败，请稍后再试...'));
        }
      },

      handleRemoveItem(id) {
        this.editItem.item.selectedList = this.editItem.item.selectedList.filter(selected => selected.id !== id);
      }
      ,
      handleRemoveRule(index) {
        this.editItem.rules = this.editItem.rules.filter((item, i) => i !== index);
      }
      ,
      handleAddRule() {
        // 新增活动规则
        this.$data.editItem.rules.push({full: null, reduction: null});
      }
      ,
      handleSubmit() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$emit('change', this.$data.editItem);
            this.$props.submit();
          }
        })
      }
      ,
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-button {
    cursor: pointer;
    padding: 5px;
    font-size: 16px;
  }

  .rules {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      div {
        display: flex;
        align-items: center;
      }
    }

    li + li {
      margin-top: 20px;
    }
  }

  .rule-plus {
    margin-top: 20px;
    width: 120px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
</style>
