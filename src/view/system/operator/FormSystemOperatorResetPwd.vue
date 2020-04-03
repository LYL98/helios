<template>
  <el-dialog :close-on-click-modal="false" title="重置密码" :visible="isShow" width="540px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" style="width: 400px;" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="密码" prop="password">
        <el-input v-model="detail.password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import md5 from 'md5';

export default {
  name: "FormSystemOperatorResetPwd",
  mixins: [formMixin],
  components: {
  },
  data(){
    return{
      initDetail: {
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
    //显示form(重写)
    showForm(data){
      if(data){
        this.$data.detail = {
          password: '',
          id: data.id
        }
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.operatorPwdReset, {
        id: detail.id,
        password: md5(detail.password)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '密码已重置', type: 'success'});
        this.handleCancel(); //隐藏
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
