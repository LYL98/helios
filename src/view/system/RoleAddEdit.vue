<template>
  <div class="system-role-add-edit">
    <el-dialog :close-on-click-modal="false" title="编辑角色" :visible="isShow" width="540px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="120px" style="width: 400px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="继承角色">
          <el-select v-model="selectRoleVal" placeholder="请选择现有角色" clearable filterable @change="selectRole" style="width: 100%;">
            <el-option v-for="(item, index) in dataItem" :key="item.id" :label="item.title" :value="index"></el-option>
          </el-select>
          <div style="color: #7f1305;">注：可快速复制现有角色的功能</div>
        </el-form-item>
        <el-form-item label="超级管理员">
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
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Input, MessageBox, Dialog, Radio, Select, Option } from 'element-ui';
import { Config, Constant } from '@/util';

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
  computed: mapGetters({
    isShow: 'systemRoleShowAddEdit',
    roleDetail: 'systemRoleDetail',
    dataItem: 'systemRoleListDataItem',
  }),
  data(){
    return{
      selectRoleVal: '',
      detail: {
        is_super_admin: false
      },
      rules: {
        title: [
          { required: true, message: '角色名称不能为空', trigger: 'change' },
          { max: 10, message: '角色名称不能超过10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //取消
    cancelAddEdit(e, res){
      this.systemRoleShowHideAddEidt(false);
      this.$attrs.callback(res);//回调
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //选择角色
    selectRole(index){
      let { detail, dataItem } = this;
      if(index === ''){
        detail.is_super_admin = false;
        detail.permission_ids = [];
      }else{
        detail.is_super_admin = dataItem[index].is_super_admin;
        detail.permission_ids = dataItem[index].permission_ids;
      }
      this.$data.detail = detail;
    },
    //确认提交
    submitAddEdit(e){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.systemRoleListAddEdit({
            data: that.$data.detail,
            callback: (res)=>{
              that.cancelAddEdit(e, res);
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['systemRoleShowHideAddEidt', 'systemRoleListAddEdit'])
  },
  watch:{
    roleDetail: {
      deep: true,
      handler: function (a, b) {
        this.detail = JSON.parse( JSON.stringify( a ) );
        this.selectRoleVal = '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
