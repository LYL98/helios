<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}运营人员`" :visible="isShow" width="720px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <!-- <el-form-item label="用户" v-show="detail.id">
          <div>{{detail.realname}}&nbsp;<span v-show="detail.phone">({{detail.phone}})</span></div>
        </el-form-item> -->
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="detail.realname" placeholder="请输入10位以内字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号"  prop="phone">
          <el-input v-model="detail.phone" :maxlength="11" placeholder="请输入11位的手机号" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-show="!detail.id" prop="password">
          <el-input v-model="detail.password" type="password" placeholder="区分英文大小写，可输入数字与特殊符号限定为6-15个字符" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="employee_no">
          <el-input v-model="detail.employee_no" :maxlength="10" placeholder="请输入10位以内字符"></el-input>
        </el-form-item>
         <el-form-item label="上传头像">
          <my-avatar style="height:64px;"  :avatar="true" ref="upload" :limit="size" module="system" v-model="detail.avatar"></my-avatar>
        </el-form-item>
        <el-form-item label="职务">
          <el-radio v-model="detail.post" @change="handleChange" label="">无</el-radio>
          <el-radio v-model="detail.post" @change="handleChange" label="salesman">业务员</el-radio>
          <el-radio v-model="detail.post" @change="handleChange" label="buyer">采购员</el-radio>
          <el-radio v-model="detail.post" @change="handleChange" label="distributor">配送员</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-transfer v-model="detail.role_ids" :data="roleList" :titles="['未选角色','已选角色']"></el-transfer>
        </el-form-item>
        <el-form-item label="权限级别">
          <el-radio v-for="(item, key) in dataLevel" :disabled="detail.data_level != 1 && (current.length>0 && key != current)" :key="key" v-model="detail.data_level" :label="key" @change="changeDataLevel">{{item}}</el-radio>
        </el-form-item>
        <!--如果级别 == 3、4、5 片区、县市、线路-->
        <el-form-item label="选择省份" prop="province_code" v-if="detail.data_level == '3' || detail.data_level === '4' || detail.data_level === '5'">
          <my-select-province v-model="detail.province_code" @change="changeProvince" />
        </el-form-item>
        <!--省份列表（多选） 如果级别 == 2-->
        <el-form-item label="省份列表" prop="data_value" v-if="detail.data_level == '2'">
          <my-select-province-multi v-model="detail.data_value"/>
        </el-form-item>

        <!--片区列表（多选） 如果级别 == 3-->
        <el-form-item label="片区列表" prop="data_value" v-else-if="detail.data_level == '3'">
          <my-select-zone-multi :provinceCode="detail.province_code" v-model="detail.data_value"/>
        </el-form-item>

        <!--县市列表（多选） 如果级别 == 4-->
        <el-form-item label="县域列表" prop="data_value" v-else-if="detail.data_level == '4'">
          <my-select-city-multi :provinceCode="detail.province_code" v-model="detail.data_value" />
        </el-form-item>

        <!--线路列表（多选） 如果级别 == 5-->
        <el-form-item label="线路列表" prop="data_value" v-else-if="detail.data_level == '5'">
          <my-select-line-multi :provinceCode="detail.province_code" v-model="detail.data_value"/>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" placeholder="请输入200位以内字符" :maxlength="200"></el-input>
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
import { Form, FormItem, Button, Input, MessageBox, Dialog, Radio, Transfer } from 'element-ui';
import { Config, Constant, Verification } from '@/util';
import { System } from '@/service';
import { SelectProvince, SelectProvinceMulti, SelectZoneMulti, SelectCityMulti, SelectLineMulti,Avatar } from '@/common';
import md5 from 'md5';

export default {
  name: "userAddEditManage",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-radio': Radio,
    'el-transfer': Transfer,
    'my-select-province': SelectProvince,
    'my-select-city-multi': SelectCityMulti,
    'my-select-province-multi': SelectProvinceMulti,
    'my-select-zone-multi': SelectZoneMulti,
    'my-select-line-multi': SelectLineMulti,
    'my-avatar': Avatar
  },
  created(){
    this.getRoleList();
  },
  computed: mapGetters({
    isShow: 'systemOperatorIsShowAddEdit',
    systemOperatorDetail: 'systemOperatorDetail'
  }),
  data(){
    let that = this;
    return{
      province: this.$province,
      dataLevel: Constant.OPERATOR_DATA_LEVEL,
      roleList: [],
      detail: {
        data_level: '1',
        data_value: [],
        role_ids: [],
        post: '',
        avatar:[]
      },
      size:1,
      current:'',
      rules: {
        employee_no: [
          {max: 10, message: '工号不能超过10个字符', trigger: 'blur'}
        ],
        realname: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { pattern: Verification.testStrs.checkMobile, message: '请输入11位的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        role_ids: [
          { type: 'array', required: true, message: '请选择角色', trigger: 'blur' }
        ],
        data_value: []
      }
    }
  },
  methods: {
    //改变权限等级
    changeDataLevel(v){
      this.leveChange(v)
    },
    leveChange(v) {
       if(v === '1' || v === '2'){
        this.$delete(this.detail, 'province_code');
      }
      this.$set(this.detail, 'data_value', []);
      this.judgeAddRules(this.detail);
    },
    //省份改变
    changeProvince(v){
      if (v !== this.detail.province_code) {
        this.detail.data_value = [];
        this.$set(this.detail, 'province_code', v);
      }
    },
    //取消
    cancelAddEdit(){
      this.systemOperatorShowHideAddEdit({ isShow: false });
      setTimeout(()=>{
        this.$refs.upload.parentHandleclick()
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //判断添加校验
    judgeAddRules(detail){
      if(detail && detail.data_level !== '1'){
        this.rules.data_value = [{ type: 'array', required: true, message: '请选择数据列表', trigger: 'click' }];
      }else{
        this.rules.data_value = [];
      }

      if(detail && detail.id){
        this.rules.password = [];
      }else{
        this.rules.password = [{ required: true, message: '请输入密码', trigger: 'change' }];
      }
    },
    //获取角色列表
    getRoleList(){
      let that = this;
      System.roleList().then(res=>{
        if(!res.code){
          let rd = res.data;
          let d = [];
          for(let i = 0; i < rd.length; i++){
            d.push({
              label: rd[i].title,
              key: rd[i].id,
            });
          }
          that.$data.roleList = d;
        }
      });
    },
    handleChange(e) {
      this.current = ''
      if(e == 'salesman') {
        this.detail.data_level = '4'
        this.current = '4'
      }else if(e == 'buyer') {
        this.detail.data_level = '2'
        this.current = '2'

      }else if(e == 'distributor') {
        this.detail.data_level = '5'
        this.current = '5'
      }else{
        this.detail.data_level = '1'
      }
      this.leveChange(this.detail.data_level)
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          if(!detail.id){
            detail.password = md5(detail.password);
          }
          detail.avatar = Array.isArray(detail.avatar) ? detail.avatar.join('') : detail.avatar
          that.systemOperatorAddEdit({
            data: detail,
            callback: (res)=>{
              let c = that.$attrs.callback;
              typeof c === 'function' && c();
              that.cancelAddEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['systemOperatorShowHideAddEdit', 'systemOperatorAddEdit'])
  },
  watch:{
    systemOperatorDetail: {
      deep: true,
      handler: function (a, b) {
        this.detail = JSON.parse( JSON.stringify( a ) );
        this.detail.avatar= [];
        if(a.avatar && typeof a.avatar == 'string'){
          this.detail.avatar = [a.avatar];
        }
        this.judgeAddRules(a);
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
