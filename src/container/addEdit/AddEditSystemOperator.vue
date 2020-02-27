<template>
  <div>
    <add-edit-layout :title="returnPageTitles('运营人员')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <!--isShow解决渲染问题-->
      <el-form v-if="isShow" class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realname">
              <el-input v-model="detail.realname" size="medium" placeholder="请输入10位以内字符" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="employee_no">
              <el-input v-model="detail.employee_no" size="medium" :maxlength="10" placeholder="请输入10位以内字符"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号"  prop="phone">
              <el-input v-model="detail.phone" size="medium" :maxlength="11" placeholder="请输入11位的手机号" autocomplete="new-password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" v-show="!detail.id" prop="password">
              <el-input v-model="detail.password" size="medium" type="password" placeholder="区分英文大小写，可输入数字与特殊符号限定为6-15个字符" autocomplete="new-password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
         <el-form-item label="上传头像">
          <my-avatar style="height:64px;" :avatar="true" ref="upload" :limit="size" module="system" v-model="detail.avatar"></my-avatar>
        </el-form-item>
        <el-form-item label="职务">
          <el-radio v-model="detail.post" @change="handleChange" label="">无</el-radio>
          <el-radio v-model="detail.post" @change="handleChange" v-for="(value, key) in operatorPost" :key="key" :label="key">{{value}}</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-transfer v-model="detail.role_ids" :data="roleList" :titles="['未选角色','已选角色']"></el-transfer>
        </el-form-item>

        <!--司机-->
        <el-row v-if="detail.post === 'deliver'">
          <el-col :span="12">
            <el-form-item label="车牌" prop="driver_car_num">
              <el-input v-model="detail.driver_car_num" size="medium" :maxlength="10" placeholder="请输入10位以内字符"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="driver_car_type">
              <el-input v-model="detail.driver_car_type" size="medium" :maxlength="20" placeholder="请输入20位以内字符"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="权限级别">
          <el-radio v-for="(item, key) in dataLevel" :disabled="detail.data_level != 1 && (current.length>0 && key != current)" :key="key" v-model="detail.data_level" :label="key" @change="changeDataLevel">{{item}}</el-radio>
        </el-form-item>
        <!--如果级别 == 3、4、5 片区、县市、线路-->
        <el-form-item label="选择省份" prop="province_code" v-if="detail.data_level == '3' || detail.data_level === '4' || detail.data_level === '5'">
          <my-select-province size="medium" v-model="detail.province_code" @change="changeProvince" />
        </el-form-item>
        <!--省份列表（多选） 如果级别 == 2-->
        <el-form-item label="省份列表" prop="data_value" v-if="detail.data_level == '2'">
          <my-select-province-multi size="medium" v-model="detail.data_value"/>
        </el-form-item>

        <!--片区列表（多选） 如果级别 == 3-->
        <el-form-item label="片区列表" prop="data_value" v-else-if="detail.data_level == '3'">
          <my-select-zone-multi :provinceCode="detail.province_code" v-model="detail.data_value"/>
        </el-form-item>

        <!--县市列表（多选） 如果级别 == 4-->
        <el-form-item label="县域列表" prop="data_value" v-else-if="detail.data_level == '4'">
          <my-select-city-multi :provinceCode="detail.province_code" v-model="detail.data_value" isClearDisabledData />
        </el-form-item>

        <!--线路列表（多选） 如果级别 == 5-->
        <el-form-item label="线路列表" prop="data_value" v-else-if="detail.data_level == '5'">
          <my-select-line-multi :provinceCode="detail.province_code" v-model="detail.data_value"/>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" placeholder="请输入200位以内字符" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-btn">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Config, Constant, Verification, Http } from '@/util';
import { SelectProvince, SelectProvinceMulti, SelectZoneMulti, SelectCityMulti, SelectLineMulti, Avatar } from '@/common';
import md5 from 'md5';

export default {
  name: "AddEditSystemOperator",
  mixins: [addEditMixin],
  components: {
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
  data(){
    let initDetail = {
      data_level: '1',
      data_value: [],
      role_ids: [],
      post: '',
      avatar: [],
      driver_car_num: '',
      driver_car_type: ''
    }
    return{
      operatorPost: Constant.OPERATOR_POST(),
      dataLevel: Constant.OPERATOR_DATA_LEVEL,
      roleList: [],
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
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
        driver_car_num: [
          { required: true, message: '车牌不能为空', trigger: 'change' }
        ],
        driver_car_type: [
          { required: true, message: '车型不能为空', trigger: 'change' }
        ],
        data_value: []
      }
    }
  },
  methods: {
    //改变权限等级
    changeDataLevel(v) {
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
      Http.get(Config.api.roleList, {}).then(res=>{
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
      }else if(e == 'deliver') {
        this.detail.data_level = '5'
        this.current = '5'
      }else{
        this.detail.data_level = '1'
      }
      this.changeDataLevel(this.detail.data_level)
    },
    //显示新增修改(重写)
    showAddEdit(data, type){
      this.$data.pageType = type;
      let d = {};
      if(data){
        d = this.copyJson(data);
        d.avatar= [];
        if(data.avatar && typeof data.avatar == 'string'){
          d.avatar = [data.avatar];
        }
      }else{
        d = this.copyJson(this.initDetail);
      }
      this.judgeAddRules(data);
      this.$data.detail = d;
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      if(!detail.id){
        detail.password = md5(detail.password);
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'operatorEdit' : 'operatorAdd'], {
        ...detail,
        avatar: Array.isArray(detail.avatar) ? detail.avatar.join('') : detail.avatar
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableSystemOperator');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
