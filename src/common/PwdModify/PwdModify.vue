<template>
  <el-dialog title="修改密码" :visible="isShow" width="540px" :before-close="cancelEdit">
    <el-form label-position="right" label-width="120px" style="width: 400px;" :model="editData" :rules="rules" ref="ruleForm">
      <el-form-item label="原密码" prop="password_ori">
        <el-input v-model="editData.password_ori" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="editData.new_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="password">
        <el-input v-model="editData.password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="cancelEdit">取 消</el-button>
      <el-button type="primary" @click.native="submitEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Form, FormItem, Button, Input, MessageBox, Notification, Dialog } from 'element-ui';
import { System } from '@/service';
import md5 from 'md5';

export default {
  name: "PwdModify",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value !== this.editData.new_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isShow: false,
      editData: {},
      rules: {
        password_ori: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        new_password: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        password: [
            { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //显示输入法
    show(){
      this.$data.isShow = true;
    },
    //取消
    cancelEdit(){
      this.$data.isShow = false;
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //确认提交
    submitEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.operatorPwdModify();
        } else {
          return false;
        }
      });
    },
    //修改密码
    async operatorPwdModify(){
      let that = this;
      let { editData } = that;
      let res = await System.operatorPwdModify({
        password_ori: md5(editData.password_ori),
        password: md5(editData.password)
      });
      if(res.code === 0){
        Notification.success({
          title: '提示',
          message: '密码修改成功',
          offset: 50
        });
        that.$data.isShow = false;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
