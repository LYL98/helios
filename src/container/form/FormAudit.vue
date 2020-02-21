<template>
  <el-dialog :title="title" :visible="isShow" width="600px" :before-close="handleCancel">
    <el-form label-position="right" label-width="110px" :model="auditData" ref="ruleForm" :rules="rules">
      <el-form-item label="类型">
        <el-radio-group size="small" v-model="auditData.audit_status">
          <template v-for="(value, key) in auditStatus">
            <el-radio v-if="key !== 'init'" border :label="key" :key="key">{{value}}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="auditData.remark"
          type="textarea"
          :rows="4"
          resize="none"
          :maxlength="200" placeholder="请输入200位以内的字符"
          style="width: 360px;"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "FormAudit",
  mixins: [formMixin],
  props: {
    page: { type: String, default: '' }, //来自页面
    title: { type: String, default: '审核' }
  },
  created() {
  },
  data(){
    let initDetail = {}
    return{
      auditData: {
        audit_status: 'success',
        remark: '',
      },
      rules: {
        //remark: { required: true, message: '备注不能为空', trigger: 'change' } //确认先不必填
      },
      auditStatus: Constant.AUDIT_STATUS(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      pages: {
        //预采订单
        'SupplierGPurchase': {
          api: Config.api.fromSupplierOrderAudit,
          table: 'TableSupplierGPurchase'
        },
        //供应商流水审核
        'FinanceSBDetail': {
          api: Config.api.financeSupBDetailAudit,
          table: 'TableFinanceSBDetail'
        },
      }
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail, auditData, pages, page } = this;
      this.$loading({isShow: true});
      let res = await Http.post(pages[page].api, {
        ...detail,
        remark: auditData.remark,
        audit_status: auditData.audit_status
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已审核', type: 'success'});
        this.$data.auditData = {
          audit_status: 'success',
          remark: '',
        };
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents(pages[page].table);
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
