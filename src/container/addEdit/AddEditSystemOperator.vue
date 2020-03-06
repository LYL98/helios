<template>
  <div>
    <add-edit-layout :title="returnPageTitles('运营人员')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <!--isShow解决渲染问题-->
      <el-form v-if="isShow" class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限级别" required prop="opt_type">
              <el-radio-group value="上海" size="medium" v-model="detail.opt_type" @change="handleChangeOptType">
                <el-radio label="global" border>全国</el-radio>
                <el-radio label="local" border>区域</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="detail.opt_type === 'local'">
            <el-form-item
              label="区域"
              required
              prop="province_code"
              :rules="[
                { required: true, message: '区域不能为空', trigger: 'change' }
              ]"
            >
              <my-select-province size="medium" v-model="detail.province_code" @change="changeProvince" />
            </el-form-item>
          </el-col>
        </el-row>
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
            <el-form-item
              label="密码"
              v-if="!detail.id"
              prop="password"
              :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
            >
              <el-input v-model="detail.password" size="medium" type="password" placeholder="区分英文大小写，可输入数字与特殊符号限定为6-15个字符" autocomplete="new-password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

         <el-form-item label="上传头像">
          <my-avatar style="height:64px;" :avatar="true" ref="upload" :limit="size" module="system" v-model="detail.avatar"></my-avatar>
        </el-form-item>
        <el-form-item label="职务">
          <el-radio v-model="detail.post" @change="handleChangePost" v-for="(value, key) in operatorPost" :key="key" :label="key">{{value}}</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-transfer v-model="detail.role_ids" :data="roles" :titles="['未选角色','已选角色']" @change="handleChangeRole"></el-transfer>
        </el-form-item>

        <el-form-item
          label="权限级别"
          v-if="detail.opt_type === 'local' && detail.province_code && ['salesman', 'other'].includes(detail.post)"
          required
        >
          <el-radio-group v-model="detail.data_level" @change="handleChangeDataLevel">
            <el-radio label="2" v-if="detail.post === 'other'">区域</el-radio>
            <el-radio label="3">片区</el-radio>
            <el-radio label="4">县域</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--片区列表（多选） 如果级别 == 3-->
        <el-form-item
          label="片区列表"
          prop="data_value"
          v-if="detail.opt_type === 'local' && detail.province_code && detail.data_level == '3'"
          :rules="[{ type: 'array', required: true, message: '请选择数据列表', trigger: 'blur' }]"
        >
          <my-select-zone-multi :provinceCode="detail.province_code" v-model="detail.data_value" @change="handleChangeDataValue"/>
        </el-form-item>

        <!--县市列表（多选） 如果级别 == 4-->
        <el-form-item
          label="县域列表"
          prop="data_value"
          v-if="detail.opt_type === 'local' && detail.province_code && detail.data_level == '4'"
          :rules="[{ type: 'array', required: true, message: '请选择数据列表', trigger: 'blur' }]"
        >
          <my-select-city-multi :provinceCode="detail.province_code" v-model="detail.data_value" isClearDisabledData @change="handleChangeDataValue"/>
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
import { Radio } from 'element-ui';
import addEditMixin from './add.edit.mixin';
import { Config, Constant, Verification, Http } from '@/util';
import { SelectProvince, SelectProvinceMulti, SelectZoneMulti, SelectCityMulti, SelectLineMulti, Avatar } from '@/common';
import md5 from 'md5';

export default {
  name: "AddEditSystemOperator",
  mixins: [addEditMixin],
  components: {
    'el-radio': Radio,
    'my-select-province': SelectProvince,
    'my-select-city-multi': SelectCityMulti,
    'my-select-province-multi': SelectProvinceMulti,
    'my-select-zone-multi': SelectZoneMulti,
    'my-select-line-multi': SelectLineMulti,
    'my-avatar': Avatar
  },
  created() {
    this.getRoleList();
  },
  data() {
    let initDetail = {
      opt_type: this.$myInfo.opt_type || 'global', // global | local，根据当前登录人员来判断
      province_code: '', // 区域
      realname: '', // 姓名
      employee_no: '', // 工号
      phone: '', // 手机号
      password: '', // 密码
      avatar: [], // 头像
      post: 'buyer', // 职务 buyer(商品) salesman(业务) supply(供应链) other(其他)
      role_ids: [],
      data_level: '1', // 数据权限 1:总部 2:区域 3:片区 4:县域
      data_value: [], //  数据权限范围 1:空白 2:province_codes 3:zone_ids 4:city_ids
      remark: ''
    }
    return {
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
        role_ids: [
          { type: 'array', required: true, message: '请选择角色', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    roles() {
      return this.$data.roleList.filter(item => item.role_type === this.detail.opt_type);
    }
  },
  methods: {
    handleChangeOptType(opt_type) {
      switch (opt_type) {
        case 'global':
          this.$data.detail.province_code = '';
          this.$data.detail.data_level = '1', // 数据权限 1:总部 2:区域 3:片区 4:县域
          this.$data.detail.data_value = [];
          break;
        case 'local':
          this.handleChangePost(this.$data.detail.post);
          break;
      }
    },
    //省份改变
    changeProvince() {
      this.handleChangePost(this.$data.detail.post);
    },
    handleChangePost(post) {
      if (!this.$data.detail.province_code) return;
      switch (post) {
        case 'buyer':
          this.$data.detail.data_level = '2';
          this.$data.detail.data_value = [this.$data.detail.province_code];
          break;
        case 'salesman':
          this.$data.detail.data_level = '3';
          this.$data.detail.data_value = [];
          break;
        case 'supply':
          this.$data.detail.data_level = '2';
          this.$data.detail.data_value = [this.$data.detail.province_code];
          break;
        case 'other':
          this.$data.detail.data_level = '2';
          this.$data.detail.data_value = [this.$data.detail.province_code];
          break;
      }
    },
    handleChangeDataLevel(level) {
      if (level === '2') {
        this.$data.detail.data_value = [this.$data.detail.province_code];
        return;
      }
      this.$data.detail.data_value = [];
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
              role_type: rd[i].role_type,
            });
          }
          that.$data.roleList = d;
        }
      });
    },
    handleChangeRole() {
      this.$refs['ruleForm'].validateField('role_ids');
    },
    handleChangeDataValue() {
      this.$refs['ruleForm'].validateField('data_value');
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
