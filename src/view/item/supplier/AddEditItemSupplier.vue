<template>
  <div>
    <add-edit-layout :title="returnPageTitles('供应商')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <h6 class="subtitle">基本信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商类型" prop="supplier_type">
              <el-radio v-model="detail.supplier_type" :label="key" :key="key" border size="medium" v-for="(value, key) in supplierType" @change="changeSupType">{{value}}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="detail.supplier_type === 'local_pur'">
            <el-form-item label="区域" prop="province_code">
              <select-province v-model="detail.province_code" size="medium" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="title">
              <el-input placeholder="10个字符以内" size="medium" :maxlength="10" v-model="detail.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input placeholder="10个字符以内" size="medium" :maxlength="10" v-model="detail.linkman"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contact_phone">
              <el-input placeholder="" size="medium" v-model="detail.contact_phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="pageType === 'add'">
            <el-form-item label="账号手机号" prop="phone">
              <el-input placeholder="" size="medium" v-model="detail.phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结款类型" prop="bill_term">
              <!-- //:disabled="detail.supplier_type === 'global_pur' ? true : false" -->
              <el-select size="medium" v-model="detail.bill_term"  style="width: 100%;">
                <el-option v-for="(value, key) in supplierBillTerm" :value="Number(key)" :key="key" :label="value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="档口号">
              <el-input placeholder="30个字符以内" size="medium" :maxlength="30" v-model="detail.stall_code"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票" prop="has_ticket">
              <el-radio v-model="detail.has_ticket" :label="true" border size="medium">有</el-radio>
              <el-radio v-model="detail.has_ticket" :label="false" border size="medium">无</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="auth.isAdmin || auth.ItemSupplierEditBank">
          <h6 class="subtitle">银行账户信息</h6>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户行" prop="bank_name">
                <el-input placeholder="10个字符以内" size="medium" :maxlength="10" v-model="detail.bank_name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账户名称" prop="bank_account_name">
                <el-input placeholder="10个字符以内" size="medium" :maxlength="10" v-model="detail.bank_account_name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账户号" prop="bank_account">
                <el-input placeholder="25个字符以内" size="medium" :maxlength="25" v-model="detail.bank_account"/>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        
        <template v-if="pageType === 'detail'">
          <h6 class="subtitle">操作记录</h6>
          <el-row v-if="detail.creator && detail.creator.id">
            <el-col :span="12">
              <el-form-item label="创建人">{{detail.creator.realname}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">{{detail.created}}</el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.auditor && detail.auditor.id">
            <el-col :span="12">
              <el-form-item label="审核人">{{detail.auditor.realname}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核时间">{{detail.audit_time}}</el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div style="margin-left: 140px; margin-top: 20px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="(auth.isAdmin || auth.ItemSupplierEdit) && pageType === 'detail'">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectProvince } from '@/common';

export default {
  name: "AddEditItemSupplier",
  mixins: [addEditMixin],
  components: {
    'select-province': SelectProvince
  },
  created() {
  },
  data(){
    let validBankAccount = function(rules, value, callback) {
      if (isNaN(value)) {
        return callback(new Error('请输入25位以内的数字'));
      }
      if (value.length <= 25) {
        callback();
      } else {
        callback(new Error('请输入25位以内的数字'));
      }
    };
    let initDetail = {
      province_code: 'nationwide', //全国要传nationwide
      title: '',
      phone: '',
      stall_code: '',
      supplier_type: 'global_pur',
      has_ticket: true,
      bill_term: 0,
      bank_name: '',
      bank_account_name: '',
      bank_account: '',
      creator: {},
      auditor: {}
    }
    return {
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
      supplierType: Constant.SUPPLIER_TYPE(),
      supplierBillTerm: Constant.SUPPLIER_BILL_TERM(),
      rules: {
        province_code: [
          { required: true, message: '请选择区域', trigger: 'change' },
        ],
        title: [
          { required: true, message: '供应商名称不能为空', trigger: 'change' },
          { max: 10, message: '供应商名称不能超过10个字符', trigger: 'blur' }
        ],
        linkman: [
          {required: true, message: '联系人姓名不能为空', trigger: 'change'},
          {max: 10, message: '请输入10个以内的字符', trigger: 'blur'}
        ],
        contact_phone: [
          { required: true, message: '联系人手机号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.checkMobile, message: '请输入11位的手机号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '登录手机号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.checkMobile, message: '请输入11位的手机号', trigger: 'blur' }
        ],
        bank_name: [
          { required: true, message: '开户行不能为空', trigger: 'change' },
          { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
        ],
        bank_account_name: [
          {required: true, message: '账户名称不能为空', trigger: 'change'},
          { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
        ],
        bank_account: [
          {required: true, message: '银行账户号不能为空', trigger: 'change'},
          { validator: validBankAccount, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierDetail(data.id);
        this.$data.pageType = type;
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
        this.$data.pageType = 'add';
      }
    },
    //获取详情
    async supplierDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //修改类型
    changeSupType(){
      let { detail,  } = this;
      detail.bill_term = 0;
      if(detail.supplier_type === 'local_pur'){
        detail.province_code = '';
      }else{
        detail.province_code = 'nationwide';
      }
      this.$data.detail = detail;
      setTimeout(()=>{
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].clearValidate();
      }, 0);
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'supplierEdit' : 'supplierAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `供应商${pageType === 'edit' ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemSupplier');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "@/share/scss/add.edit.scss";
</style>
