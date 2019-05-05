<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" title="重置密码" :visible="isShow" width="540px" :before-close="cancelReset">
      <el-form label-position="right" label-width="120px" style="width: 400px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="密码" prop="password">
          <el-input v-model="editData.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelReset">取 消</el-button>
        <el-button type="primary" @click.native="submitReset">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Input, MessageBox, Dialog } from "element-ui";
import md5 from 'md5';

export default {
  name: "userResetPassword",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'systemOperatorIsShowResetPwd',
    detail: 'systemOperatorDetail'
  }),
  data(){
    return{
      editData: {
        password: ''
      },
      rules: {
        password: [
            { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //取消
    cancelReset(){
      this.systemOperatorShowHideResetPwd(false);
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //确认提交
    submitReset(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { editData, detail } = that;
          that.systemOperatorResetPwd({
            data: {
              id: detail.id,
              password: md5(editData.password)
            },
            callback: (res)=>{
              that.cancelReset();
              that.$data.editData.password = '';
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['systemOperatorShowHideResetPwd', 'systemOperatorResetPwd'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
