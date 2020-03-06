<template>
  <el-form
    class="custom-form"
    label-position="right"
    label-width="120px"
    :model="formData"
    ref="ruleForm"
  >
    <el-form-item
      label="职务"
      required
      prop="post"
      :rules="[{ required: true, message: '请选择职务类型', trigger: 'change' }]"
    >
      <el-radio-group size="medium" v-model="formData.post">
        <el-radio border label="deliver">司机</el-radio>
        <el-radio border label="sorter">装车员</el-radio>
        <el-radio border label="local_distributor">配送员</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="姓名"
      required
      prop="realname"
      :rules="[{ required: true, message: '姓名不能为空', trigger: 'change' }]"
    >
      <el-input placeholder="请输入姓名" v-model="formData.realname"></el-input>
    </el-form-item>
    <el-form-item
      label="车型"
      required
      prop="driver_car_type"
      v-if="formData.post === 'deliver'"
      :rules="[{ required: true, message: '车型不能为空', trigger: 'change' }]"
    >
      <el-input placeholder="请输入车型" v-model="formData.driver_car_type"></el-input>
    </el-form-item>
    <el-form-item
      label="车牌"
      required
      prop="driver_car_num"
      v-if="formData.post === 'deliver'"
      :rules="[{ required: true, message: '车牌不能为空', trigger: 'change' }]"
    >
      <el-input placeholder="请输入车牌" v-model="formData.driver_car_num"></el-input>
    </el-form-item>
    <el-form-item
      label="账号手机号"
      required
      prop="phone"
      :rules="[
        { required: true, message: '账号手机号不能为空', trigger: 'change' },
        { pattern: Verification.testStrs.checkMobile, message: '请输入11位的手机号', trigger: 'blur' }
      ]"
    >
      <el-input placeholder="请输入账号手机号" :maxlength="11" v-model="formData.phone"></el-input>
    </el-form-item>
    <el-form-item
      v-if="type === 'add'"
      label="密码"
      required
      prop="password"
      :rules="[{ required: true, message: '密码不能为空', trigger: 'change' }]"
    >
      <el-input placeholder="请输入密码" type="password" autocomplete="new-password" v-model="formData.password"></el-input>
    </el-form-item>
    <div class="display-flex justify-content-end">
      <el-button size="medium" @click.native="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="handleSubmit">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
  import { Form, FormItem, RadioGroup, Radio, Input, Button } from 'element-ui';
  import { Http, Config, Verification } from '@/util';
  import md5 from 'md5';
  export default {
    name: 'deliver-edit',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-input': Input,
      'el-button': Button
    },
    props: {
      type: { type: String, default: 'add' },
      item: { type: Object, default: {} },
    },
    data() {
      return {
        Verification: Verification,
        formData: {
          id: undefined, // id
          post: 'deliver', // deliver(司机) sorter(装车员) local_distributor(落地配送员)(必填)
          realname: '', //人员名称(必填)
          driver_car_type: '', //车型
          driver_car_num: '', //车牌
          phone: '', //电话号码(人员账号)(必填)
          password: '', // 密码(必填)
          avatar: '', // 头像
          remark: '', // 备注
        },
      };
    },
    created() {
      if (this.$props.type === 'modify') {
        this.$data.formData = this.$props.item;
      }
    },
    methods: {
      handleCancel() {
        this.$emit('cancel');
      },
      handleSubmit() {
        this.$refs['ruleForm'].validate().then(volid => {
          let formData = {...this.$data.formData};
          if (this.$props.type === 'add') {
            formData.password = md5(formData.password);
          }
          if (formData.post !== 'deliver') {
            formData.driver_car_type = '';
            formData.driver_car_num = '';
          }
          const API = this.$props.type === 'add' ? Config.api.operateDeliverAdd : Config.api.operateDeliverEdit;
          Http.post(API, formData).then(res => {
            if (res.code === 0) {
              this.$message({message: `${this.$props.type === 'add' ? '新增' : '修改'}成功`, type: 'success'});
              this.$emit('submit');
            } else {
              this.$message({message: res.message, type: 'error'});
            }
          })
        })
      }
    }
  };
</script>

<style scoped>
  .display-flex {
    display: flex;
  }
  .justify-content-end {
    justify-content: flex-end;
  }
</style>
