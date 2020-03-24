<template>
  <div style="margin-top: 60px;">
    <el-form class="custom-form" size="mini" label-position="right" :disabled="!isEdit" label-width="110px" :model="detail" :rules="rules" ref="ruleForm" style="width: 560px;">
      <h6 class="subtitle">品牌信息</h6>
      <el-form-item label="品牌名" prop="brand_name">
        <el-input size="medium" v-model="detail.brand_name" placeholder="请输入15位以内的字符" :maxLength="15"></el-input>
      </el-form-item>
      <el-form-item label="投诉电话" prop="complaint_hotline">
        <el-input size="medium" v-model="detail.complaint_hotline" type="tel" :maxLength="11" placeholder="请输入11位手机号"></el-input>
      </el-form-item>
      <el-form-item label="客服微信" prop="qr_codes">
        <my-upload-img ref="upload2" v-model="detail.qr_codes" @change="changeBrandQr" module="qr_code" :limit="1" :disabled="!isEdit"></my-upload-img>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <template v-if="isEdit">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </template>
      <template v-else>
        <el-button size="medium" @click.native="isEdit = true">修 改</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Verification, Constant } from '@/util';
import { UploadImg } from '@/component';

export default {
  name: 'Brand',
  mixins: [addEditMixin],
  components: {
    'my-upload-img': UploadImg,
  },
  created(){
    this.systemBrandGet();
  },
  data(){
    let validQrImages = function (rules, value, callback) {
      if (value.length && value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传图片'));
      }
    };
    return {
      isEdit: false,
      detail: {
        brand_name: '',
        complaint_hotline: '',
        qr_code: '',
        qr_codes: []
      },
      rules: {
        brand_name: [
          { required: true, message: '品牌名不能为空', trigger: 'change' }
        ],
        complaint_hotline: [
          {required: true, message: '投诉电话不能为空'},
          {pattern: Verification.testStrs.checkMobile, message: '手机号码格式不正确', trigger: 'change'}
        ],
        qr_codes: [
          {validator: validQrImages, trigger: 'change'},
          {required: true, message: '请上传图片', trigger: 'change'}
        ],
      },
    }
  },
  methods: {
    //修改二维码
    changeBrandQr() {
      this.$refs['ruleForm'].validateField('qr_code');
    },
    //取消
    handleCancel(){
      this.systemBrandGet();
      this.$data.isEdit = false;
    },
    //获取品牌信息
    async systemBrandGet() {
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.BrandInfo, {});
      this.$loading({isShow: false});
      if (res.code === 0) {
        let rd = res.data;
        rd.qr_codes = rd.qr_code.split();
        this.$data.detail = rd;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //设置品牌信息
    async addEditData() {
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.BrandInfo, {
        ...detail,
        qr_code: detail.qr_codes.join()
      });
      this.$loading({isShow: false});
      if (res.code === 0) {
        this.$message({message: '品牌信息设置成功', type: 'success'});
        this.$data.isEdit = false;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

