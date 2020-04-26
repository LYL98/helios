<template>
  <el-form label-position="right" label-width="100px" :model="formData" ref="ruleForm">
    <el-form-area label="商户信息">
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="商户名称"
            prop="merchant_title"
            :rules="[
              {required: true, message: '商户名称不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.merchant_title" :maxlength="10" placeholder="请输入商户名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="协议商户" class="required">
            <ul style="display: flex;">
              <li class="w-200">
                <el-radio v-model="formData.is_post_pay" border size="small" :label="true">是</el-radio>
                <el-radio v-model="formData.is_post_pay" border size="small" :label="false">否</el-radio>
              </li>
              <li v-if="formData.is_post_pay === true">
                <el-form-item label="授信额度" prop="credit_limit" :rules="[{validator: validCreditLimit, trigger: 'change'}]">
                  <el-input v-model="formData.credit_limit" placeholder="请输入授信额度" class="w-200">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>

    <el-form-area label="门店信息">
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="门店图片"
            prop="images"
            :rules="[
              {validator: validImages, trigger: 'change'},
              {required: true, message: '请上传门店图片', trigger: 'blur'}
            ]"
          >
            <el-upload-img :limit="6" module="merchant" v-model="formData.images" @change="changeImages" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="门店名称"
            prop="store_title"
            :rules="[
              {required: true, message: '门店名称不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.store_title" :maxlength="10" placeholder="请输入门店名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户经理" prop="store_csm_id">
            <el-select :disabled="!formData.city_id" v-model="formData.store_csm_id" filterable placeholder="请选择门店客户经理"
                       style="width: 100%">
              <el-option v-for="d in salesmanList" :key="d.id" :label="d.title" :value="d.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="县域"
            prop="province"
            :rules="[{required: true, message: '请选择县域', trigger: 'blur'}]"
          >
            <div style="display: flex;">
              <el-select-province
                style="width: 200px;"
                v-model="formData.province_code"
                @change="changProvince"
                isAuth
                @sync="syncProvince"
              />
              <el-select-city
                style="margin-left: 5px; flex-grow: 1;"
                v-model="formData.city_id"
                :provinceCode="formData.province_code"
                placeholder="请选择县域"
                @change="changCity"
                :disabled="formData.province_code === ''"
                @sync="syncCity"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="地理位置"
            prop="geo"
            :rules="[{ required: true, validator: validLocation, trigger: 'change' }]"
          >
            <el-location-picker v-model="formData.geo" @change="changeGeo" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="20">
          <el-form-item
            label="收货地址"
            prop="address"
            :rules="[
              {required: true, message: '收货地址不能为空', trigger: 'change'},
              {max: 30, message: '请输入30个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.address" :maxlength="30" placeholder="请输入收货地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="收货人"
            prop="linkman"
            :rules="[
              {required: true, message: '收货人不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.linkman" :maxlength="10" placeholder="请输入收货人" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="联系方式"
            prop="store_phone"
            :rules="[
              {required: true, message: '联系方式不能为空', trigger: 'change'},
              {pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.store_phone" :maxlength="11" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form-area>

    <el-form-area label="用户信息">
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="上传头像">
            <el-upload-img :limit="1" module="merchant" v-model="formData.avatar" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            label="登录手机"
            prop="login_phone"
            :rules="[
              {required: true, message: '登录手机不能为空', trigger: 'change'},
              {pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.login_phone" :maxlength="11" placeholder="请输入登录手机" />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item
            label="姓名"
            prop="realname"
            :rules="[
              {required: true, message: '姓名不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.realname" :maxlength="10" placeholder="请输入姓名" autocomplete='new-password' />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form-area>
    <el-form-item class="mt-20">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Button, Input, Radio, RadioGroup, Select, Option} from "element-ui";
  import {FormArea, SelectProvince, SelectCity, LocationPicker} from '@/common';
  import {UploadImg} from '@/component';
  import {Http, Config, DataHandle, Verification} from '@/util';

  export default {
    name: "merchant-edit",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-select': Select,
      'el-option': Option,
      'el-form-area': FormArea,
      'el-location-picker': LocationPicker,
      'el-upload-img': UploadImg,
      'el-select-province': SelectProvince,
      'el-select-city': SelectCity,
    },
    props: {
      type: {type: String, default: ''},
      item: {type: Object, default: () => ({})},
    },
    data() {

      return {
        loading: false,
        formData: {
          // 商户字段 ，在 新增商户 和 激活潜在客户时 ，需要存在
          merchant_title: '',
          is_post_pay: false,
          credit_limit: 10000,

          // 门店字段
          images: [], // 图片
          store_title: '', // 门店名称
          store_csm_id: '', // 客户经理
          province_code: '',
          city_id: '',
          geo: {lng: '', lat: '', province_title: '', city_title: '', poi: ''},
          address: '',

          avatar: [],
          login_phone: '',
          realname: ''
        },

        salesmanList: []


      }
    },
    created() {
      this.Verification = Verification;

      if (this.$props.type === 'modify') {
        this.$data.formData = {...this.$props.item};
      }
    },
    methods: {

      syncProvince(province) {
        this.$set(this.$data.formData.geo, 'province_title', province.title);
        this.$set(this.$data.formData.geo, 'city_title', '');
      },

      syncCity(city) {
        this.$set(this.$data.formData.geo, 'city_title', city.title);

        // 在city 切换时，重置 salesman 列表查询。
        if (city.code) {
          this.initSalesmanList();
        }
      },

      changeGeo() {
        this.$refs['ruleForm'].validateField('geo');
      },

      //选择区域
      changProvince() {
        this.$data.formData.city_id = '';
        this.$data.formData.geo.lng = '';
        this.$data.formData.geo.lat = '';
        this.$data.formData.geo.city_title = '';
        this.$data.formData.geo.poi = '';

        this.$data.salesmanList = [];
        this.$data.formData.store_csm_id = '';
      },
      //选择县域
      changCity() {
        this.$data.formData.geo.lng = '';
        this.$data.formData.geo.lat = '';
        this.$data.formData.geo.poi = '';

        this.$data.salesmanList = [];
        this.$data.formData.store_csm_id = '';

        // 当city 选择后，清除掉 province 的校验信息
        if (arguments[0] !== "") {
          this.$refs['ruleForm'].clearValidate(['province']);
        }
      },


      changeImages() {
        this.$refs['ruleForm'].validateField('images');
      },

      async initSalesmanList() {
        let res = await Http.get(Config.api.operatorList, {city_id: this.$data.formData.city_id});
        if (res.code === 0) {
          let rd = res.data || [];
          this.$data.salesmanList = rd.map(item => ({
            id: item.id,
            title: item.realname
          }));
        } else {
          this.$messageBox.alert(res.message, '提示');
        }
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          // this.$data.loading = true;
          // let formData = {...this.$data.formData};
          //
          // const API = this.$props.type === 'add'
          //   ? Config.api.itemSupDistributePlanAdd
          //   : Config.api.itemSupDistributePlanModify;
          //
          // let res = await Http.post(API, formData);
          // this.$data.loading = false;
          // if (res.code === 0) {
          //   this.$message({message: `${this.$props.type === 'add' ? '新增' : '编辑'}成功`, type: 'success'});
          //   this.$emit('submit');
          // } else {
          //   this.$message({title: '提示', message: res.message, type: 'error'});
          // }

        });
      },

      onCancel() {
        this.$emit('cancel');
      },

      validCreditLimit (rules, value, callback) {
        if (!this.$data.formData.is_post_pay) { // 如果不是协议用户，则不对该项做校验
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
      },

      validImages (rules, value, callback) {
        if (Array.isArray(value) && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传门店图片'));
        }
      },

      validLocation (rules, value, callback) {
        if (!value.lng && !value.lat) {
          return callback(new Error('地理位置不能为空'));
        }
        callback();
      },

    }
  }
</script>

<style lang="scss" scoped>
  .mt-20 {
    margin-top: 20px;
  }

  .w-200 {
    width: 200px;
    min-width: 200px;
  }
</style>
