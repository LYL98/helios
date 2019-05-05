<template>
  <el-form ref="ruleForm" :model="addEditData" :rules="rules" label-position="right" label-width="100px"
           style="width: 560px;">
    <el-form-item label="门店图片" prop="images">
      <my-upload-img v-model="addEditData.images" module="merchant" :limit="6" @change="changeImages"></my-upload-img>
    </el-form-item>
    <el-form-item label="门店名称" prop="title">
      <el-input v-model="addEditData.title" :maxlength="10" placeholder="请输入门店名称"></el-input>
    </el-form-item>
    <el-form-item label="所在仓" prop="province" class="required">
      <my-select-province style="width: 150px;" :value="addEditData.province_code"
                          :disabled="true"/>
      <my-select-city style="width: 200px;margin-left: 5px" v-model="addEditData.city_code" :provinceCode="addEditData.province_code"
                      @change="changeCity" :disabled="isEditStore" placeholder="请选择所在仓"/>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="收货人" prop="linkman">
          <el-input v-model="addEditData.linkman" :maxlength="10" placeholder="请输入收货人"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addEditData.phone" :maxlength="11" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="收货地址" prop="address">
      <el-input v-model="addEditData.address" :maxlength="30" placeholder="请输入收货地址"></el-input>
    </el-form-item>
    <el-form-item style="text-align: right;">
    <el-button @click="editStoreCancel">取消</el-button>
    <el-button type="primary" :loading="isSending" @click="submitEdit">确认</el-button>
  </el-form-item>

  </el-form>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {
    Table,
    TableColumn,
    MessageBox,
    Message,
    Row,
    Col,
    Button,
    Dialog,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Radio,
    RadioGroup,
  } from 'element-ui';
  import {Config, Constant, DataHandle, Method, Verification} from '@/util';
  import {Merchant} from '@/service';
  import {SelectProvince, SelectCity, UploadImg} from '@/common';

  export default {
    name: "StoreAddEdit",
    components: {
      'mt-button': Button,
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-select': Select,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'my-select-province': SelectProvince,
      'my-select-city': SelectCity,
      'my-upload-img': UploadImg
    },
    props: {
      isEditStore: Boolean,
      merchant_id: [String, Number],
      store_id: [String, Number],
      editStoreSuccess: Function,
      editStoreCancel: Function
    },
    computed: mapGetters({
      province: 'globalProvince'
    }),
    created() {
      let that = this;
      // 获取门店id
      if (this.isEditStore) { // 如果是编辑模式，则加载门店信息
        let q = that.$route.query;
        let store_id = that.store_id;
        if (q.id || store_id) {
          that.$data.id = q.id || store_id;
          that.storeDetail();
        }
      } else {
        that.addEditData.province_code = that.province.code;
      }
    },
    data() {
      let {merchant_id} = this;
      let validImages = function (rules, value, callback) {
        if (value.length && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传门店图片'));
        }
      }
      return {
        tencentPath: Config.tencentPath,
        isSending: false,
        id: 0,
        upData: {},
        addEditData: {
          title: '',
          images: [],
          province_code: '',
          zone_code: '',
          city_code: '',
          address: '',
          linkman: '',
          phone: '',
          merchant_id: merchant_id,
        },
        selectProvinceData: {},
        selectZoneData: {},
        selectCityData: {},
        rules: {
          images: [
            {validator: validImages, trigger: 'change'},
            {required: true, message: '请上传门店图片', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '门店名称不能为空', trigger: 'change'},
            {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择所在仓', trigger: 'blur'}
          ],
          linkman: [
            { required: true, message: '收货人不能为空', trigger: 'change' },
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '联系方式不能为空', trigger: 'change' },
            { pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/, message: '请输入11位手机号码', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '收货地址不能为空', trigger: 'change' },
            { max: 30, message: '请输入30个以内的字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      /**
       * 根据门店的id 获取门店详情，用于编辑门店信息时使用。
       */
      async storeDetail() {
        let that = this;
        let {id} = that;
        let res = await Merchant.storeDetail({
          id: id
        });
        if (res.code === 0) {
          let rd = res.data;
          that.$data.addEditData = rd;
        } else {
          Message.warning(res.message);
        }
      },

      /**
       * 在用户切换选择城市时，触发。
       */
      changeCity() {
        if (arguments[0] !== "") {
          this.$refs['ruleForm'].clearValidate(['province']);
        }
      },

      changeImages() {
        this.$refs['ruleForm'].validateField('images');
      },

      //修改门店
      async submitEdit() {
        let that = this;
        let {addEditData, id} = that; // 此处的id 表示 store_id

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
            let res = await Merchant[id ? 'storeEdit' : 'storeAdd'](addEditData);
            that.isSending = false;
            if (res.code === 0) {
              let rd = res.data;
              this.editStoreSuccess();
              Message.success(`门店${id ? '修改' : '添加'}成功!`);
            } else {
              this.editStoreCancel();
              Message.warning(res.message);
            }
          }

        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .required {
    color: #ff4850;
  }

  .title {
    margin: 5px 0 10px 10px;
  }
</style>
