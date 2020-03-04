<template>
  <el-form style="width: 800px;" label-position="right" label-width="150px" ref="ruleForm">
    <el-form-item label="发放方式" :error="error.type" class="required">
      <el-radio-group v-model="editItem.type" @change="changeType">
        <el-radio border size="small" label="grade">商户等级</el-radio>
        <el-radio border size="small" label="city">县域</el-radio>
        <el-radio border size="small" label="merchant">指定商户</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="选择商户等级" v-if="editItem.type === 'grade'" :error="error.grade" class="required">
      <search-merchant-grade
        height="300px"
        v-model="editItem.grade_codes"
        @change="changeGrade"
      >
      </search-merchant-grade>
    </el-form-item>
    <el-form-item label="选择商户所在县域" v-if="editItem.type === 'grade'">
      <search-city
        height="300px"
        v-model="editItem.city_ids"
        :provinceCode="province.code"
        @change="changeCity"
      ></search-city>
    </el-form-item>

    <el-form-item label="选择指定县域" v-if="editItem.type === 'city'" :error="error.city" class="required">
      <search-city
        height="300px"
        v-model="editItem.city_ids"
        :provinceCode="province.code"
        @change="changeCity"
      ></search-city>
    </el-form-item>

    <el-form-item label="选择指定商户" v-if="editItem.type === 'merchant'" :error="error.merchant" class="required">
      <search-merchant
        height="300px"
        v-model="editItem.merchant_ids"
        :provinceCode="province.code"
        @change="changeMerchant"
      ></search-merchant>
    </el-form-item>
    <el-form-item style="display: flex; justify-content: flex-end;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="sending" @click="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Radio, RadioGroup, Dialog, Button, Message, MessageBox} from 'element-ui';
  import { SearchMerchantGrade, SearchCity, SearchMerchant } from '@/container/search';

  export default {
    name: "FormMarketingCouponSend",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-dialog': Dialog,
      'el-button': Button,
      'search-merchant': SearchMerchant,
      'search-merchant-grade': SearchMerchantGrade,
      'search-city': SearchCity,
    },
    props: {
      item: { type: Object, required: true },
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    data() {
      let item = Object.assign({}, this.$props.item);
      return {
        province: this.$province,
        editItem: item,
        error: {
          type: '',
          grade: '',
          city: '',
          merchant: ''
        }
      }
    },
    methods: {

      validForm() {
        let valid = true;
        switch (this.$data.editItem.type) {
          case 'grade':
            if (this.$data.editItem.grade_codes.length === 0) { this.$data.error.grade = '请选择发放的商户等级'; valid = false; }
            break;
          case 'city':
            if (this.$data.editItem.city_ids.length === 0) { this.$data.error.city = '请选择发放的县域'; valid = false; }
            break;
          case 'merchant':
            if (this.$data.editItem.merchant_ids.length === 0) { this.$data.error.merchant = '请指定发放的商户'; valid = false; }
            break;
          default:
            this.$data.error.type = '请选择发放方式';
            valid = false;
            break;
        }
        return valid;
      },

      changeType() {
        this.$data.error.type = '';
        this.$data.error.grade = '';
        this.$data.error.city = '';
        this.$data.error.merchant = '';

        this.$data.editItem.grade_codes = [];
        this.$data.editItem.city_ids = [];
        this.$data.editItem.merchant_ids = [];
      },

      changeGrade() {
        this.$data.error.grade = '';
      },

      changeCity() {
        this.$data.error.city = '';
      },

      changeMerchant() {
        this.$data.error.merchant = '';
      },

      handleSubmit() {

        if (!this.validForm()) return;

        let title = `确认将 "
          ${this.editItem.code} / ${this.editItem.title}
          " 发放给以下${ this.editItem.type === 'grade' ? '商户?' :  this.editItem.type === 'city' ? '县域?' : '商户?' }`;

        let items = [];
        let citys = [];

        switch (this.editItem.type) {
          case 'grade':
            items = this.editItem.grade_codes.map(item => item.title);
            citys = this.editItem.city_ids.map(item => item.title);
            break;
          case 'city':
            items = this.editItem.city_ids.map(item => item.title);
            break;
          case 'merchant':
            items = this.editItem.merchant_ids.map(item => item.title);
            break;
        }

        let description = items.join('、');

        // 为按商户等级发放增加县域的限定条件
        if (this.editItem.type === 'grade' && citys.length > 0) {
          description = citys.join('、') + '之下等级为' + description + '的商户';
        }

        MessageBox.confirm(description, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          this.$emit('change', this.$data.editItem);
          this.$props.submit();
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
