<template>
  <el-form label-position="right" label-width="100px" style="width: 740px;" :model="detail" :rules="rules" ref="ruleForm">

    <my-form-area label="商户信息">
      <el-form-item label="商户名称" prop="merchant_title">
        <el-input v-model="detail.merchant_title" :maxlength="10" placeholder="请输入商户名称" style="width: 260px;"/>
      </el-form-item>
      <el-form-item label="协议商户" class="required">
        <ul style="display: flex;">
          <li>
            <el-radio v-model="detail.is_post_pay" border size="small" :label="true">是</el-radio>
            <el-radio v-model="detail.is_post_pay" border size="small" :label="false">否</el-radio>
          </li>
          <li v-if="detail.is_post_pay === true">
            <el-form-item label="授信额度" prop="credit_limit">
              <el-input v-model="detail.credit_limit" style="width: 260px;" placeholder="请输入授信额度">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form-item>
    </my-form-area>

    <my-form-area label="门店信息">
      <el-form-item label="门店图片" prop="images">
        <my-upload-img :limit="6" module="merchant" v-model="detail.images" @change="changeImages"></my-upload-img>
      </el-form-item>
      <div style="display: flex; justify-content: space-between;">
        <el-form-item label="门店名称" prop="store_title">
          <el-input v-model="detail.store_title" :maxlength="10" style="width: 260px;" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="所在仓" prop="province">
          <my-select-province style="width: 110px;" :value="province.code" :disabled="true"/>
          <my-select-city style="width: 140px; margin-left: 6px;" v-model="detail.city_code" :provinceCode="province.code"
                          placeholder="请选择所在仓" @change="changCity"/>
        </el-form-item>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <el-form-item label="收货人" prop="linkman">
          <el-input v-model="detail.linkman" :maxlength="10" placeholder="请输入收货人" style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="store_phone">
          <el-input v-model="detail.store_phone" :maxlength="11" placeholder="请输入联系方式" style="width: 260px;"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="收货地址" prop="address">
        <el-input v-model="detail.address" :maxlength="30" placeholder="请输入收货地址"></el-input>
      </el-form-item>
      <!--<el-form-item label="是否团购" prop="store_gb_included">-->
        <!--<el-radio-group v-model="detail.store_gb_included">-->
          <!--<el-radio border size="small" :label="true">是</el-radio>-->
          <!--<el-radio border size="small" :label="false">否</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
    </my-form-area>

    <my-form-area label="用户信息" v-if="!this.isModify">
      <el-form-item label="上传头像">
        <my-upload-img :limit="1" module="merchant" v-model="detail.avatar"></my-upload-img>
      </el-form-item>
      <div style="display: flex; justify-content: space-between;">
        <el-form-item label="登录手机" prop="login_phone">
          <el-input v-model="detail.login_phone" :maxlength="11" placeholder="请输入登录手机" style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="detail.realname" :maxlength="10" placeholder="请输入姓名" autocomplete='new-password' style="width: 260px;"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="detail.password" :maxlength="15" type="password" autocomplete='new-password' placeholder="请输入登录密码" style="width: 260px;"></el-input>
      </el-form-item>
    </my-form-area>
    <el-form-item style="text-align: right;">
      <el-button @click="editMerchantCancel">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="merchantEdit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {Form, FormItem, Button, Input, MessageBox, Message, Dialog, Radio, RadioGroup, DatePicker} from "element-ui";
  import {FormArea, SelectProvince, SelectCity, UploadImg} from '@/common';
  import {DataHandle, Verification} from '@/util';
  import {Merchant} from '@/service';
  import md5 from 'md5';

  export default {
    name: 'MerchantAdd',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-dialog': Dialog,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-date-picker': DatePicker,
      'my-select-province': SelectProvince,
      'my-select-city': SelectCity,
      'my-upload-img': UploadImg,
      'my-form-area': FormArea
    },
    props: {
      merchantDetail: {type: Object, required: false}, // 只有在编辑模式下才需要
      editMerchantSuccess: Function,
      editMerchantCancel: Function
    },
    computed: mapGetters({
      province: 'globalProvince',
      merchant_id: 'merchant_id'
    }),
    // 判断是否是编辑模式？
    created() {
      let that = this;
      that.$data.detail.province_code = that.province.code;
    },
    data() {

      let detail = {
        images: [],
        avatar: [],
        is_post_pay: false,
        credit_limit: 10000,
        gender: 1
      };

      let validImages = function (rules, value, callback) {
        if (value.length && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传门店图片'));
        }
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
        isModify: false,
        isSending: false,
        id: 0,
        detail: detail,
        upData: {},
        upDataAvatar: {},
        rules: {
          images: [
            {validator: validImages, trigger: 'change'},
            {required: true, message: '请上传门店图片', trigger: 'blur'}
          ],
          merchant_title: [
            {required: true, message: '商户名称不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          credit_limit: [
            {validator: validCreditLimit, trigger: 'change'}
          ],
          store_title: [
            {required: true, message: '门店名称不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择所在仓', trigger: 'blur'}
          ],
          linkman: [
            {required: true, message: '收货人不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          store_phone: [
            {required: true, message: '联系方式不能为空', trigger: 'change'},
            {pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/, message: '请输入11位手机号码', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '收货地址不能为空', trigger: 'change'},
            {max: 30, message: '请输入30个以内的字符', trigger: 'blur'}
          ],
          realname: [
            {required: true, message: '姓名不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          login_phone: [
            {required: true, message: '登录手机不能为空', trigger: 'change'},
            {pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/, message: '请输入11位手机号码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '登录密码不能为空', trigger: 'change'},
            {min: 6, max: 15, message: '请输入6-15位的非中文字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {

      changCity() {
        if (arguments[0] !== "") {
          this.$refs['ruleForm'].clearValidate(['province']);
        }
      },

      changeImages() {
        this.$refs['ruleForm'].validateField('images');
      },

      //新增商户
      async merchantEdit() {
        let that = this;
        let {isModify, detail, id} = that;

        that.$refs['ruleForm'].validate(async (valid, failProps) => {
          // 如果没有通过校验？
          if (!valid) {
            // 判断是否只有 provice 规则出现问题。
            let result = Object.keys(failProps);
            if (result.length === 1) {
              if (result.includes('province') && detail.city_code && detail.city_code !== '') { // 只有province 存在问题
                that.$refs['ruleForm'].clearValidate(['province']);
                valid = true;
              }
            } else if (result.length > 1) { // 其他存在问题
              if (result.includes('province') && detail.city_code && detail.city_code !== '') { // 包含 province
                that.$refs['ruleForm'].clearValidate(['province']);
                return;
              } else {
                return;
              }
            }
          }

          if (valid) {

            that.isSending = true;

            if (!isModify) {
              detail = {
                ...detail,
                password: md5(detail.password),  // 新增模式下，对用户的登录密码进行md5处理
                avatar: detail.avatar.length === 0 ? '' : detail.avatar[0],  // 如果用户没有上传头像，则向后端发送 '' 否则发送一个字符串
                credit_limit: detail.is_post_pay ? DataHandle.handlePrice(detail.credit_limit) : 0
              }
            }
            // 组件清空结束日期后，设置结束日期为 空string
            if (!detail.sign_end_date) {
              detail.sign_end_date = ''
            }
            if (!detail.sign_start_date) {
              detail.sign_start_date = ''
            }
            let res = await Merchant[id ? 'merchantEdit' : 'merchantAdd'](detail);
            that.isSending = false;
            if (res.code === 0) {
              let rd = res.data;
              that.$refs['ruleForm'].resetFields();
              this.editMerchantSuccess();
              Message.success(`商户创建成功`, '提示');
              //如果是新增模式，则清空组件中用户添加的缓存。
              if (!isModify) {
                that.$data.detail = {
                  images: [],
                  avatar: [],
                  is_post_pay: false,
                  credit_limit: 10000,
                  gender: 1,
                  province_code: that.province.code
                };
              }
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
