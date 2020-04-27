<template>
  <el-form label-position="right" size="small" label-width="120px" :model="formData" ref="ruleForm">
    <el-form-area label="商户信息" v-if="module === 'merchant'">
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
            <ul class="d-flex">
              <li class="w-200">
                <el-radio v-model="formData.is_post_pay" border size="mini" :label="true">是</el-radio>
                <el-radio v-model="formData.is_post_pay" border size="mini" :label="false">否</el-radio>
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
            class="required"
            label="门店图片"
            prop="images"
            :rules="[{validator: validImages, trigger: 'change'}]"
          >
            <el-upload-img :limit="6" module="merchant" v-model="formData.images" @change="changeImages" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item
            v-if="module === 'merchant'"
            label="门店名称"
            prop="store_title"
            :rules="[
              {required: true, message: '门店名称不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.store_title" :maxlength="10" placeholder="请输入门店名称"></el-input>
          </el-form-item>
          <el-form-item
            v-if="module !== 'merchant'"
            label="门店名称"
            prop="title"
            :rules="[
              {required: true, message: '门店名称不能为空', trigger: 'change'},
              {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.title" :maxlength="10" placeholder="请输入门店名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            class="required"
            label="县域"
            prop="province_code"
            :rules="[{validator: validProvince, trigger: 'change'}]"
          >
            <!--  在编辑门店时，不能修改县域  -->
            <div class="d-flex">
              <el-select-province
                :disabled="module === 'store' && type === 'modify'"
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
                :disabled="(module === 'store' && type === 'modify') || formData.province_code === ''"
                @sync="syncCity"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="客户经理" prop="store_csm_id" v-if="module === 'merchant'">
            <el-select
              :disabled="!formData.city_id"
              v-model="formData.store_csm_id"
              filterable
              placeholder="请选择门店客户经理"
              style="width: 100%"
            >
              <el-option v-for="d in salesmanList" :key="d.id" :label="d.title" :value="d.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="客户经理" prop="csm_id" v-if="module !== 'merchant'">
            <el-select
              :disabled="!formData.city_id"
              v-model="formData.csm_id"
              filterable
              placeholder="请选择门店客户经理"
              style="width: 100%"
            >
              <el-option v-for="d in salesmanList" :key="d.id" :label="d.title" :value="d.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            class="required"
            label="地理位置"
            prop="geo"
            :rules="[{ validator: validLocation, trigger: 'change' }]"
          >
            <el-location-picker size="small" v-model="formData.geo" @change="changeGeo" style="width: 100%"/>
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
            v-if="module === 'merchant'"
            label="联系方式"
            prop="store_phone"
            :rules="[
              {required: true, message: '联系方式不能为空', trigger: 'change'},
              {pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.store_phone" :maxlength="11" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item
            v-if="module !== 'merchant'"
            label="联系方式"
            prop="phone"
            :rules="[
              {required: true, message: '联系方式不能为空', trigger: 'change'},
              {pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur'}
            ]"
          >
            <el-input v-model="formData.phone" :maxlength="11" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form-area>


    <el-form-area label="其他信息">
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="门店类型">
            <el-select style="width: 100%" value="">
              <el-option label="精品水果店" value="精品水果店"/>
              <el-option label="商超系统" value="商超系统"/>
              <el-option label="便利系统" value="便利系统"/>
              <el-option label="大众水果店" value="大众水果店"/>
              <el-option label="微商" value="微商"/>
              <el-option label="员工内部账号" value="员工内部账号"/>
              <el-option label="其他" value="其他"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="经营面积">
            <el-select style="width: 100%" value="">
              <el-option label="<50平米" value="<50平米"/>
              <el-option label="50-100平米" value="50-100平米"/>
              <el-option label=">100平米" value=">100平米"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="KP性别">
            <el-radio value="男" border size="mini" label="男">男</el-radio>
            <el-radio value="男" border size="mini" label="女">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="KP年龄">
            <el-select style="width: 100%" value="">
              <el-option label="70前" value="70前"/>
              <el-option label="70后" value="70后"/>
              <el-option label="80后" value="80后"/>
              <el-option label="90后" value="90后"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="其他采购渠道">
            <el-select style="width: 100%" value="">
              <el-option label="互联网服务商" value="互联网服务商"/>
              <el-option label="县级批发商" value="县级批发商"/>
              <el-option label="市级批发市场" value="市级批发市场"/>
              <el-option label="省级批发市场" value="省级批发市场"/>
              <el-option label="连锁店总部统一配送" value="连锁店总部统一配送"/>
              <el-option label="其他" value="其他"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="经营年限">
            <el-select style="width: 100%" value="">
              <el-option label="<1年" value="<1年"/>
              <el-option label="1-2年" value="1-2年"/>
              <el-option label="3-5年" value="3-5年"/>
              <el-option label="5年以上" value="5年以上"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="一体化收银机">
            <el-radio value="男" border size="mini" label="是">是</el-radio>
            <el-radio value="男" border size="mini" label="否">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="线上销售工具">
            <el-select style="width: 100%" value="">
              <el-option label="无" value="无"/>
              <el-option label="朋友圈+微信群" value="朋友圈+微信群"/>
              <el-option label="外卖平台" value="外卖平台"/>
              <el-option label="社区团购" value="社区团购"/>
              <el-option label="其他电商平台" value="其他电商平台"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="22">
          <el-form-item label="经营品类">
            <el-checkbox-group :value="['零食坚果', '奶制品', '米面粮油']" size="mini">
              <el-checkbox label="零食坚果" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="酒水饮料" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="奶制品" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="蔬菜" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="鲜肉" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="冻品" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="米面粮油" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="干货调料" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="鸡蛋" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="小百货" border style="margin-left: 0; width: 100px"/>
              <el-checkbox label="水果" border style="margin-left: 0; width: 100px"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>

    <el-form-area label="用户信息" v-if="module === 'merchant'">
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
  import {Form, FormItem, Row, Col, Button, Input, Radio, RadioGroup, Select, Option, CheckboxGroup, Checkbox} from "element-ui";
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
      'el-checkbox-group': CheckboxGroup,
      'el-checkbox': Checkbox,
      'el-form-area': FormArea,
      'el-location-picker': LocationPicker,
      'el-upload-img': UploadImg,
      'el-select-province': SelectProvince,
      'el-select-city': SelectCity,
    },
    props: {
      module: { type: String, default: 'merchant' }, // 调用该表单的模块： merchant | intended | store
      type: {type: String, default: ''}, // 调用类型： add ｜ modify ｜ detail
      item: {type: Object, default: () => ({})},
      merchant_id: { type: Number, default: 0 }, // 当门店编辑时，需要指定merchant_id
    },
    data() {

      return {
        loading: false,
        formData: {
          merchant_id: 0, // 在store 编辑模式下需要用到的字段

          // 商户字段 ，在 新增商户 和 激活潜在客户时 ，需要存在
          merchant_title: '',
          is_post_pay: false,
          credit_limit: 10000,

          // 门店字段
          images: [], // 图片
          store_title: '', // 门店名称 在编辑 商户的表单中
          title: '', // 门店名称 在编辑门店的表单中
          store_csm_id: '', // 客户经理 在编辑商户的表单中
          csm_id: '', // 客户经理，在编辑门店的表单中
          province_code: '',
          city_id: '',
          geo: {lng: '', lat: '', province_title: '', city_title: '', poi: ''},
          address: '',
          linkman: '',
          shore_phone: '', // 门店联系电话 在编辑 商户的表单中
          phone: '', // 门店联系电话 在编辑 门店的表单中

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

      if (this.$props.module === 'store') {
        this.$data.formData.merchant_id = this.$props.merchant_id;
        console.log('this.$data.formData.merchant_id： ', this.$data.formData.merchant_id);
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
        this.$data.formData.csm_id = '';
      },
      //选择县域
      changCity() {
        this.$data.formData.geo.lng = '';
        this.$data.formData.geo.lat = '';
        this.$data.formData.geo.poi = '';

        this.$data.salesmanList = [];
        this.$data.formData.store_csm_id = '';
        this.$data.formData.csm_id = '';

        console.log('this.$data.city: ', this.$data.formData.city_id);

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

          switch (this.$props.module) {
            case 'merchant':
              this.merchantEdit();
              break;
            case 'store':
              this.storeEdit();
              break;
            case 'intended':
              break;
          }

        });
      },

      onCancel() {
        this.$emit('cancel');
      },

      async merchantEdit() {

        let formData = {...this.$data.formData};
        formData.store_csm_id = Number(formData.store_csm_id);
        formData.credit_limit =  formData.is_post_pay ? DataHandle.handlePrice(formData.credit_limit) : 0;
        formData.avatar = Array.isArray(formData.avatar) && formData.avatar.length >= 1 ? formData.avatar[0] : '';

        this.$data.loading = true;
        let res = await Http.post(Config.api[this.$props.type === 'add' ? 'merchantAdd' : 'merchantEdit'], data);
        this.$data.loading = false;

        if (res.code === 0) {
          this.$message({message: `${this.$props.type === 'add' ? '商户创建' : '商户激活'}成功`, type: 'success'});
          this.$emit('submit');
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }

      },

      async storeEdit() {
        let formData = {...this.$data.formData};
        formData.csm_id = Number(formData.csm_id);

        this.$data.loading = true;
        let res = await Http.post(Config.api[this.$props.type === 'add' ? 'storeAdd' : 'storeEdit'], formData);
        this.$data.loading = false;

        if (res.code === 0) {
          this.$message({message: `${this.$props.type === 'add' ? '门店创建' : '门店编辑'}成功`, type: 'success'});
          this.$emit('submit');
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
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

      // 要求 province_code 和 city_id 都存在
      validProvince(rules, value, callback) {
        if (!!value && !!this.$data.formData.city_id) {
          return callback();
        }
        callback(new Error('请选择县域'));
      },

      validLocation (rules, value, callback) {
        if (!!value.lng && !!value.lat) {
          return callback();
        }
        callback(new Error('地理位置不能为空'));
      },

      validImages (rules, value, callback) {
        if (Array.isArray(value) && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传门店图片'));
        }
      },

    }
  }
</script>

<style lang="scss" scoped>

  .d-flex {
    display: flex;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .w-200 {
    width: 200px;
    min-width: 200px;
  }
</style>
