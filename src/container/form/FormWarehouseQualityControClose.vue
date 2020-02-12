<template>
  <form-layout title="关闭采购单" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <div style="padding: 0 0 20px 108px; color: #ff5252;">是否确认关闭采购单，如是，请填写关闭采购单的原因</div>
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="detail.remark"
          type="textarea"
          :rows="4"
          resize="none"
          :maxlength="50" placeholder="请输入50位以内的字符"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';

export default {
  name: "FormWarehouseQualityControClose",
  mixins: [formMixin],
  created() {
  },
  components: {
  },
  data(){
    let initDetail = {}
    return{
      rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail)
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let apis = {
        global_pur: Config.api.supPurchaseInClose,
        local_pur: Config.api.supFromSupplierInClose
      }
      let res = await Http.post(apis[detail.order_type], {
        id: detail.id,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已关闭', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableWarehouseQualityControl');
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
