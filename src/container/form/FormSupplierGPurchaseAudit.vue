<template>
  <el-dialog :close-on-click-modal="false" title="统采订单审核" :visible="isShow" width="600px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="类型">
        <el-radio-group size="small" v-model="auditStatus">
          <template v-for="(value, key) in gPurchaseAuditStatus">
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
  name: "FormSupplierGPurchaseAudit",
  mixins: [formMixin],
  created() {
  },
  data(){
    let initDetail = {}
    return{
      auditStatus: 'success',
      gPurchaseAuditStatus: Constant.G_PURCHASE_AUDIT_STATUS(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail, auditStatus } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supplierGPurchaseAudit, {
        id: detail.id,
        audit_status: auditStatus
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已审核', type: 'success'});
        this.$data.auditStatus = 'success';
        this.handleCancel(); //隐藏
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .select-supplier{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    >.select{
      width: 240px;
    }
    >.move{
      width: 60px;
      margin-left: 10px;
      font-size: 12px;
      >a{
        margin-right: 5px;
        display: block;
        line-height: 20px;
      }
    }
    >.delete{
      font-size: 12px;
    }
    >.main{
      margin-left: 10px;
      font-size: 12px;
    }
  }
</style>
