<template>
  <el-form
    class="custom-form"
    label-position="right"
    label-width="120px"
    :model="formData"
    ref="ruleForm"
  >
    <el-form-item
      label="新密码"
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
  import { Form, FormItem, Input, Button } from 'element-ui';
  import { Http, Config } from '@/util';
  import md5 from 'md5';
  export default {
    name: 'reset-password',
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button
    },
    props: {
      item: { type: Object, default: {} },
    },
    data() {
      return {
        formData: {
          id: 0,
          password: '', // 密码(必填)
        },
      };
    },
    created() {
      this.$data.formData.id = this.$props.item.id;
    },
    methods: {
      handleCancel() {
        this.$emit('cancel');
      },
      handleSubmit() {
        this.$refs['ruleForm'].validate().then(volid => {
          let formData = {...this.$data.formData};
          if (!formData.id) return;
          formData.password = md5(formData.password);
          Http.post(Config.api.operateDeliverResetPassword, formData).then(res => {
            if (res.code === 0) {
              this.$message({message: '密码重置成功', type: 'success'});
              this.$emit('cancel');
            } else {
              this.$message({message: res.message, type: 'error'});
            }
          });
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
