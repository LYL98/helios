<template>
  <el-form :model="editItem" style="width: 600px;" label-position="right" label-width="100px" ref="ruleForm" :rules="rules">
    <el-form-item label="类型">
      <el-radio-group size="small" v-model="editItem.status">
        <el-radio border label="checked">审核通过</el-radio>
        <el-radio border label="declined">驳回</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="audit_remark">
      <el-input
        v-model="editItem.audit_remark"
        type="textarea"
        :rows="3"
        resize="none"
        placeholder="请输入备注..."
      ></el-input>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="sending" @click="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { Form, FormItem, Radio, RadioGroup, Input, Button } from 'element-ui';
  export default {
    name: "FormFinanceApproveEdit",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-input': Input,
      'el-button': Button
    },
    props: {
      item: { type: Object, required: true },
      submit: { type: Function, required: true },
      close: { type: Function, required: true },
      sending: {type:Boolean, required: true}
    },
    data() {
      let editItem = Object.assign({}, this.$props.item);
      return {
        editItem: editItem,
        rules: {
          audit_remark: [
            { max: 200, message: '不能超过200个字符，请重新编辑', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$props.submit(this.$data.editItem);
          }
        });
      },
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style scoped>

</style>
