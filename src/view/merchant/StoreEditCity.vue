<template>
  <el-form ref="ruleForm" :model="addEditData" :rules="rules" label-position="right" label-width="100px"
           style="width: 560px;">
    <el-form-item label="门店名称" prop="title">
      <el-input v-model="addEditData.title" placeholder="长度在20个中文字符以内" disabled></el-input>
    </el-form-item>
    <el-form-item label="所在仓" prop="province" class="required">
      <my-select-province style="width: 150px;" :value="addEditData.province_code" disabled/>
      <my-select-city style="width: 200px;" v-model="addEditData.city_code" :provinceCode="addEditData.province_code" @change="changeCity"/>
    </el-form-item>

    <el-form-item style="text-align: right;">
      <el-button @click="editCityCancel">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="submitEdit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { Form, FormItem, Input, Button, Message } from 'element-ui';
  import { SelectProvince, SelectCity } from '@/common';
  import { Http, Config } from '@/util';

  export default {
    name: "StoreEditCity",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
      'my-select-province': SelectProvince,
      'my-select-city': SelectCity
    },
    props: {
      store_id: [String, Number],
      editCitySuccess: Function,
      editCityCancel: Function
    },
    data() {
      return {
        province: this.$province,
        rules: {
          province: [
            {required: true, message: '请选择所在城市', trigger: 'blur'}
          ]
        },
        isSending: false,
        addEditData: {
          title: '',
          province_code: '',
          city_code: ''
        }
      }
    },
    created() {
      this.addEditData.province_code = this.province.code;
      this.storeDetail();
    },
    methods: {
      async storeDetail() {
        let that = this;
        let {store_id} = that;
        let res = await Http.get(Config.api.storeDetail, {
          id: store_id
        });
        if (res.code === 0) {
          let rd = res.data;
          that.$data.addEditData = rd;
        } else {
          Message.warning(res.message);
        }
      },

      changeCity() {
        if (arguments[0] !== "") {
          this.$refs['ruleForm'].clearValidate(['province']);
        }
      },


      submitEdit() {

        let that = this;
        let {addEditData, store_id} = that;

        that.$refs['ruleForm'].validate(async (valid, failProps) => {

          // 如果是 province 未验证通过？判断是否有值

          // 如果没有通过校验？
          if (!valid) {
            // 判断是否只有 provice 规则出现问题。
            let result = Object.keys(failProps);
            if (result.length === 1) {
              if (result.includes('province') && addEditData.city_code && addEditData.city_code !== '') { // 只有province 存在问题
                that.$refs['ruleForm'].clearValidate(['province']);
                valid = true;
              }
            } else if (result.length > 1) { // 其他存在问题
              if (result.includes('province') && addEditData.city_code && addEditData.city_code !== '') { // 包含 province
                that.$refs['ruleForm'].clearValidate(['province']);
                return;
              } else {
                return;
              }
            }
          }

          if (valid) {
            that.isSending = true;
            let res = await Merchant['storeEditCity']({
              id: store_id,
              province_code: addEditData.province_code,
              city_code: addEditData.city_code
            });
            that.isSending = false;
            if (res.code === 0) {
              let rd = res.data;
              that.editCitySuccess();
              Message.success(`门店所在仓修改成功!`);
            } else {
              that.editCityCancel();
              Message.warning(res.message);
            }
          }

        });

      }
    }
  }
</script>

<style scoped>

</style>
