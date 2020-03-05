<template>
  <el-form
    class="custom-form"
    label-position="right"
    label-width="120px"
    :model="formData"
    ref="ruleForm"
  >
    <el-form-item label="职务" required>
      <el-radio-group size="medium">
        <el-radio border>司机</el-radio>
        <el-radio border>装车员</el-radio>
        <el-radio border>配送员</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="姓名" required>
      <el-input placeholder="请输入姓名"></el-input>
    </el-form-item>
    <el-form-item label="车牌" required>
      <el-input placeholder="请输入车牌"></el-input>
    </el-form-item>
    <el-form-item label="车型" required>
      <el-input placeholder="请输入车型"></el-input>
    </el-form-item>
    <el-form-item label="账号手机号" required>
      <el-input placeholder="请输入账号手机号" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="密码" required>
      <el-input placeholder="请输入密码" autocomplete="new-password"></el-input>
    </el-form-item>
    <div class="display-flex justify-content-end">
      <el-button size="medium" @click.native="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="handleSubmit">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
  import { Form, FormItem, RadioGroup, Radio, Input, Button } from 'element-ui';
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
        formData: {

        }
      }
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
        this.$emit('submit');
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
