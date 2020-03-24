<template>
  <sub-menu>
  <div style="background-color: #fff; padding: 16px 20px;">
    <div :style="{ overflowY: 'auto', overflowX: 'auto', height: viewWindowHeight - 100 + 'px'}">
      <el-form label-position="right" label-width="160px" style="width: 700px;" :model="ruleForm" :rules="rules"
               ref="ruleForm">
        <el-form-item label="品牌名配置:" prop="brand_name">
          <el-input v-model="ruleForm.brand_name" placeholder="请输入15位以内的字符" :max="8"></el-input>
        </el-form-item>
        <el-form-item label="上传品牌icon:" prop="brand_icon">
          <my-upload-img ref="upload" v-model="ruleForm.brand_icon" module="brand_icon" @change="changeBrandIcon"
                         :limit="1"></my-upload-img>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
      <el-form label-position="right" label-width="160px" style="width: 700px;" :model="ruleFormQR" :rules="rules"
               ref="ruleFormQR">
        <el-form-item label="投诉电话:" prop="complaint_hotline">
          <el-input v-model="ruleFormQR.complaint_hotline" type="tel" :maxlength="11" placeholder="请输入11位手机号"></el-input>
        </el-form-item>
        <el-form-item label="上传客服微信二维码:" prop="qr_code">
          <my-upload-img ref="upload2" v-model="ruleFormQR.qr_code" @change="changeBrandQr" module="qr_code"
                         :limit="1"></my-upload-img>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleFormQR')">取 消</el-button>
          <el-button type="primary" @click="submit('ruleFormQR')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  </sub-menu>
</template>
<script>
  import {Form, FormItem, Button, Input, Message, Upload, MessageBox} from 'element-ui';
  import { Http, Config, Verification } from '@/util';
  import { UploadImg } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Main",
    mixins: [mainMixin],
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-upload': Upload,
      'my-upload-img': UploadImg,
    },
    data() {
      let validImages = function (rules, value, callback) {
        if (value.length && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传图片'));
        }
      };
      let validQrImages = function (rules, value, callback) {
        if (value.length && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传图片'));
        }
      };
      let validName = function (rules, value, callback) {
        if (value.length && value.length <= 8) {
          callback();
        } else if (value.length && value.length > 8) {
          callback(new Error('品牌名称不能大于8个字'));
        } else {
          callback(new Error('品牌名不能为空'));
        }
      }
      return {
        brand: {},
        brandService: {},
        ruleForm: {
          brand_name: '',
          brand_icon: [],
        },
        ruleFormQR: {
          complaint_hotline: '',
          qr_code: []
        },
        rules: {
          brand_name: [
            // {validator: validName, trigger: 'blur'},
            {required: true, message: '品牌名不能为空', trigger: 'change'},
            { max: 15, message: '品牌名不能超过15个字符', trigger: 'blur' },
          ],
          brand_icon: [
            {validator: validImages, trigger: 'change'},
            {required: true, message: '请上传图片', trigger: 'change'}
          ],
          complaint_hotline: [
            {required: true, message: '投诉电话不能为空'},
            {pattern: Verification.testStrs.checkMobile, message: '手机号码格式不正确', trigger: 'change'}
          ],
          qr_code: [
            {validator: validQrImages, trigger: 'change'},
            {required: true, message: '请上传图片', trigger: 'change'}
          ],
        },
      }
    },
    watch: {
      brand: {
        deep: true,
        handler: function (c, b) {
          let a = c || b;
          this.ruleForm = JSON.parse(JSON.stringify(a));
          this.ruleForm.brand_icon = this.ruleForm.brand_icon.split();
        }
      },
      brandService: {
        deep: true,
        handler: function (c, b) {
          let a = c || b;
          this.ruleFormQR = JSON.parse(JSON.stringify(a));
          this.ruleFormQR.qr_code = this.ruleFormQR.qr_code.split();
        }
      },
    },
    created: function () {
      documentTitle("设置 - 品牌信息配置");
      this.systemBrand({data: 'get'});
      this.systemBrandService({data: 'get'});
    },
    methods: {
      //获取品牌信息
      async systemBrand({data, callback}){
        this.$loading({isShow: true, isWhole: true});
        let res = data == 'get' ? await Http.get(Config.api.BrandInfo, {}) : await Http.post(Config.api.BrandInfo, data);
        this.$loading({isShow: false});
        if (res.code === 0) {
          if(data !='get')this.$message({title: '提示', message: res.message, type: 'success'});
          this.$data.brand = res.data;
          typeof callback === 'function' && callback(res.data);
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //服务
      async systemBrandService({data, callback}){
        this.$loading({isShow: true, isWhole: true});
        let res = data == 'get' ? await Http.get(Config.api.CustomerService, {}) : await Http.post(Config.api.CustomerService, data)
        this.$loading({isShow: false});
        if (res.code === 0) {
          if(data !='get') this.$message({title: '提示', message: res.message, type: 'success'});
          this.$data.brandService = res.data;
          typeof callback === 'function' && callback(res.data);
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      changeBrandIcon() {
        this.$refs['ruleForm'].validateField('brand_icon');
      },
      changeBrandQr() {
        this.$refs['ruleFormQR'].validateField('qr_code');
      },
      submit(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName == 'ruleForm') {
              let data = JSON.parse(JSON.stringify(that.ruleForm));
              data.brand_icon = data.brand_icon.join()
              this.systemBrand({
                data: data, callback: (res) => {
                  that.systemBrand({data: 'get'});
                }
              });
            } else {
              let data = JSON.parse(JSON.stringify(that.ruleFormQR));
              data.qr_code = data.qr_code.join()
              this.systemBrandService({
                data: data, callback: (res) => {
                  that.systemBrandService({data: 'get'});
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        if (formName == 'ruleForm') {
          this.systemBrand({data: 'get'});
        } else {
          this.systemBrandService({data: 'get'});
        }
      },

    }
  }
</script>
<style scoped>
  .el-form {
    padding: 10px 40px;
  }

  .footer {
    padding: 0 40px;
  }

  .el-input {
    width: 50%;
  }
</style>
