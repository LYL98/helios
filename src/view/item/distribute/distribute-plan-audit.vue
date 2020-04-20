<template>
  <el-form label-position="right" label-width="110px" :model="formData" ref="ruleForm">
    <el-form-item label="类型">
      <el-radio-group size="small" v-model="formData.audit_status">
        <el-radio border label="audit_success">审核通过</el-radio>
        <el-radio border label="audit_fail">作废</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="formData.remark"
        type="textarea"
        :rows="4"
        resize="none"
        :maxlength="200"
        placeholder="请输入200位以内的字符"
        style="width: 360px;"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, RadioGroup, Radio, Input, Button} from "element-ui";
  import { Http, Config } from '@/util';
  export default {
    name: "distribute-plan-audit",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-input': Input,
      'el-button': Button
    },
    props: {
      item: { type: Object, default: () => ({}) },
    },
    data() {
      return {
        loading: false,
        formData: {
        }
      }
    },
    created() {
      this.$data.formData = {
        ids: [this.$props.item.id],
        audit_status: 'audit_success',
        remark: ''
      }
    },
    methods: {

      async onSubmit() {
        let formData = {...this.$data.formData};
        this.$data.loading = true;
        let res = await Http.post(Config.api.itemSupDistributePlanAudit, formData);
        this.$data.loading = false;
        if(res.code === 0){
          this.$message({ title: '提示', message: '调拨计划审核成功', type: 'success'});
          this.$emit('submit');
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      onCancel() {
        this.$emit('cancel');
      }
    }
  }
</script>

<style scoped>

</style>
