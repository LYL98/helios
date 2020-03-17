<template>
  <el-form ref="ruleForm" :model="addData" :rules="rules" label-position="right" label-width="100px" style="width: 560px;">
    <el-form-item label="上传头像" prop="avatar">
      <my-upload-img v-model="addData.avatar" module="merchant" :limit="1" ></my-upload-img>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="addData.realname" :maxlength="10" placeholder="请输入姓名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="登录手机" prop="phone">
          <el-input v-model="addData.phone" :maxlength="11" autocomplete='new-password' placeholder="请输入登录手机"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="登录密码" prop="password">
      <el-input v-model="addData.password" type="password" autocomplete='new-password' :maxlength="15" placeholder="请输入登录密码"></el-input>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="editMemberCancel">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="submitEdit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Table, TableColumn, Message, MessageBox, Button, Dialog, Form, FormItem, Input, Radio, Col, Row } from 'element-ui';
import { Http, Config, Constant, DataHandle, Method, Verification } from '@/util';
import { UploadImg } from '@/component';
import md5 from 'md5';

export default {
  name: "MemberAddEdit",
  components: {
    'mt-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-col': Col,
    'el-row': Row,
    'my-upload-img': UploadImg
  },
  props: {
    merchant_id: [String, Number],
    editMemberSuccess: Function,
    editMemberCancel: Function
  },
  created() {
    let that = this;
  },

  data() {
    let { merchant_id } = this;

    let validAvatar = function(rules, value, callback) {
      if (value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传用户头像'));
      }
    }
    return {
      isSending: false,
      upData: {},
      addData: {
        realname: '',
        password: '',
        phone: '',
        avatar: [],
        merchant_id: merchant_id,
      },
      rules: {
        avatar: [
          { validator: validAvatar, trigger: 'change' },
          { required: true, message: '请上传用户头像', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '姓名不能为空', trigger: 'change' },
          { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '登录手机不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.checkMobile, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'change' },
          { min: 6, max: 15, message: '请输入6-15位的非中文字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //选择性别
    selectGender(num){
      let { addData } = this;
      addData.gender = num;
      this.$data.addData = addData;
    },
    // 新增用户
    async submitEdit(){
      let that = this;

      that.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let { addData, query } = that;
          that.isSending = true;
          let res = await Http.post(Config.api.memberAdd, {
            ...addData,
            password: md5(addData.password),
            avatar: addData.avatar.length === 0 ? '' : addData.avatar[0]
          });
          that.isSending = false;
          if(res.code === 0){
            let rd = res.data;
            // 执行关闭dialog的回调函数
            this.editMemberSuccess();
            Message.success('用户添加成功!');
          }else{
            // this.editMemberCancel();
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
  .el-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .required {
    color: #ff4850;
  }

  .radio, .label{
    padding: 12px 0 2px;
    span{
      display: inline-block;
      padding: 2px 5px;
      margin: 0 5px 10px;
      border: 1px dashed #999;
      border-radius: 3px;
    }
    span.active{
      color: #fff;
      background: $--color-primary;
      border: 1px solid $--color-primary;
    }
  }
  .radio{
    span{
      border: 0;
    }
  }
</style>
