<template>
  <el-dialog :title="title" :visible="isShow" width="600px" :before-close="handleCancel">
    <el-form label-position="right" label-width="110px" :model="auditData" ref="ruleForm" :rules="rules">
      <div style="padding: 0 0 20px 108px; color: #ff5252;" v-if="detail.close_hint">
        {{detail.close_hint}}
      </div>
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
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config } from '@/util';

export default {
  name: "FormClose",
  mixins: [formMixin],
  props: {
    page: { type: String, default: '' }, //来自页面
    title: { type: String, default: '关闭' }
  },
  created() {
  },
  data(){
    let initDetail = {}
    return{
      auditData: {
        remark: '',
      },
      rules: {
        remark: { required: true, message: '备注不能为空', trigger: 'change' }
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      pages: {
        //预采订单
        'ItemGPurchase': {
          api: Config.api.fromSupplierOrderClose,
          table: 'TableItemGPurchase'
        },
        //反采采订单
        'ItemLocalPurchase': {
          api: Config.api.fromSupplierOrderClose,
          table: 'TableItemLocalPurchase'
        },
        //仓库品控
        'WarehouseQualityControl': {
          api: Config.api.supFromSupplierInClose,
          table: 'TableWarehouseQualityControl'
        },
        //场地品控
        'OperateReceiving': {
          api: Config.api.supFromSupplierInClose,
          table: 'TableWarehouseQualityControl'
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
        remark: auditData.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已关闭', type: 'success'});
        this.$data.auditData = {
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
