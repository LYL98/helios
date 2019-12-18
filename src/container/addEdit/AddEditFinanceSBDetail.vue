<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" label-position="right" :disabled="pageType === 'detail'" label-width="140px" style="width: 98%; max-width: 1400px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">

        <h6 class="subtitle" v-if="pageType === 'detail'">基本信息</h6>
        <el-form-item label="名称" prop="title">
          <el-input placeholder="20个字符以内" size="medium" v-model="detail.title" style="width: 520px;"/>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="linkman">
          <el-input placeholder="请输入姓名" size="medium" :maxlength="10" v-model="detail.linkman" style="width: 320px;"/>
        </el-form-item>
        <el-form-item label="联系人手机号" prop="contact_phone">
          <el-input placeholder="" size="medium" v-model="detail.contact_phone" style="width: 240px;"/>
        </el-form-item>
        <el-form-item label="登录手机号" prop="phone">
          <el-input placeholder="" size="medium" v-model="detail.phone" style="width: 240px;"/>
        </el-form-item>
        <el-form-item label="类型" prop="supplier_type">
          <el-radio v-model="detail.supplier_type" :label="key" :key="key" border size="mini" v-for="(value, key) in supplierType" @change="detail.bill_term = 0">{{value}}</el-radio>
        </el-form-item>
        <el-form-item label="账期" prop="bill_term">
          <el-radio v-model="detail.bill_term" :disabled="detail.supplier_type === 'global_pur' ? true : false" :label="Number(key)" :key="key" border size="mini" v-for="(value, key) in supplierBillTerm">{{value}}</el-radio>
        </el-form-item>
      </el-form>

      <template v-if="pageType === 'detail'">
        <h6 class="subtitle">商品信息</h6>
        <el-table :data="detail.bind_items" :highlight-current-row="true" style="margin: 0 50px; width: 1000px; border-top: 1px solid #ececec;">
          <el-table-column prop="title" label="编号/名称" width="180">
            <template slot-scope="scope">
              {{ scope.row.code }}<br/>
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
        </el-table>
      </template>

      <div style="margin-left: 110px; margin-top: 80px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="(auth.isAdmin || auth.SupplierListEdit) && pageType === 'detail'">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEditFinanceSBDetail",
  mixins: [addEditMixin],
  components: {
  },
  created() {
  },
  data(){
    let initDetail = {
      province_code: this.$province.code,
      title: '',
      phone: '',
      supplier_type: 'global_pur',
      bill_term: 0,
      bind_items: []
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      supplierType: Constant.SUPPLIER_TYPE(),
      supplierBillTerm: Constant.SUPPLIER_BILL_TERM(),
      rules: {
        title: [
          { required: true, message: '供应商名称不能为空', trigger: 'change' },
          { max: 20, message: '供应商名称不能超过20个字符', trigger: 'blur' }
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
      },
      pageTitles: {
        add: '新增供应商',
        edit: '修改供应商',
        detail: '供应商详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierDetail(data.id);
        this.$data.pageType = type;
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
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
        let pc = this.getPageComponents('TableSupplierList');
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
  @import "./add.edit.scss";
</style>
