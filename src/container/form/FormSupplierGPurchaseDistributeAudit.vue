<template>
  <el-dialog :close-on-click-modal="false" title="统采调拨单审核" :visible="isShow" width="600px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="类型">
        <el-radio-group size="small" v-model="selectAuditStatus">
          <template v-for="(value, key) in auditStatus">
            <el-radio v-if="key !== 'init'" border :label="key" :key="key">{{value}}</el-radio>
          </template>
        </el-radio-group>
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
  name: "FormSupplierGPurchaseDistributeAudit",
  mixins: [formMixin],
  created() {
  },
  data(){
    let initDetail = {}
    return{
      selectAuditStatus: 'success',
      auditStatus: Constant.AUDIT_STATUS(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail, selectAuditStatus } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supplierGPurchaseDistributeAudit, {
        id: detail.id,
        audit_status: selectAuditStatus
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已审核', type: 'success'});
        this.$data.selectAuditStatus = 'success';
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableSupplierGPurchaseDistribute');
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
