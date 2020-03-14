<template>
  <div class="system-role-add-edit">
    <el-dialog :close-on-click-modal="false" title="修改角色" :visible="isShow" width="540px" :before-close="cancelAddEdit">
      <!--isShow防止渲染问题-->
      <el-form v-if="isShow" label-position="right" label-width="120px" style="width: 400px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="权限级别" class="is-required">
          <el-radio v-model="detail.role_type" v-for="(value, key) in roleAuthLevel" :label="key" :key="key" @change="changeRoleType">{{value}}</el-radio>
        </el-form-item>
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入角色名称" :maxLength="10"></el-input>
        </el-form-item>
        <el-form-item label="继承角色">
          <el-select v-model="selectRoleVal" placeholder="请选择现有角色" clearable filterable @change="selectRole" style="width: 100%;">
            <template v-for="(item, index) in dataItem">
              <el-option :key="item.id" :label="item.title" :value="index" v-if="item.role_type === detail.role_type"></el-option>
            </template>
          </el-select>
          <div style="color: #7f1305;">注：可快速复制现有角色的功能</div>
        </el-form-item>
        <el-form-item label="超级管理员" v-if="detail.role_type === 'global'" class="is-required">
          <el-radio v-model="detail.is_super_admin" :label="true">是</el-radio>
          <el-radio v-model="detail.is_super_admin" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAddEdit">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, MessageBox, Dialog, Radio, Select, Option } from "element-ui";
import { Config, Constant, Http } from '@/util';

export default {
  name: "RoleAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-radio': Radio,
    'el-select': Select,
    'el-option': Option
  },
  data(){
    return{
      isShow: false,
      selectRoleVal: '',
      roleAuthLevel: Constant.ROLE_AUTH_LEVEL(),
      dataItem: [],
      detail: {
        is_super_admin: false
      },
      rules: {
        title: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //显示
    showAddEdit(dataItem, roleDetail){
      this.$data.dataItem = dataItem;
      this.$data.detail = JSON.parse(JSON.stringify({
        ...roleDetail,
        role_type: roleDetail.role_type || 'global'
      }));
      this.$data.selectRoleVal = '';
      this.$data.isShow = true;
    },
    //取消
    cancelAddEdit(e, res){
      this.$data.isShow = false;
      this.$attrs.callback(res);//回调
    },
    //选择角色
    selectRole(index){
      let { detail, dataItem } = this;
      if(index === ''){
        detail.is_super_admin = false;
        detail.permission_codes = [];
      }else{
        detail.is_super_admin = dataItem[index].is_super_admin;
        detail.permission_codes = dataItem[index].permission_codes;
      }
      this.$data.detail = detail;
    },
    //选择类别
    changeRoleType(){
      this.$data.detail.is_super_admin = false;
      this.$data.selectRoleVal = '';
    },
    //确认提交
    submitAddEdit(e){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          (async ()=>{
            let { detail } = this;
            this.$loading({isShow: true});
            let res = await Http.post(detail.id ? Config.api.roleEdit : Config.api.roleAdd, detail);
            this.$loading({isShow: false});
            if(res.code === 0){
              this.cancelAddEdit(e, res.data);
              this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
