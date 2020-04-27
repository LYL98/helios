<template>
  <div>
    <el-dialog title="处理进度" :visible="isShow" :before-close="cancel" width="480px">
      <el-form label-position="right" label-width="100px" style="width: 400px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="处理进度" prop="handle_loading">
          <el-select v-model="detail.handle_loading" style="width: 100%;">
            <el-option v-for="item in afterSaleHandleLoading" :key="item.key" :value="item.key" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.native="cancel">取 消</el-button>
          <el-button type="primary" @click.native="submit">确 认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant } from '@/util';

export default {
  name: "HandleLoading",
  mixins: [formMixin],
  components: {
  },
  created() {
  },
  data(){
    return{
      afterSaleHandleLoading: Constant.AFTER_SALE_HANDLE_LOADING('list'),
      isShow: false,
      detail: {
        handle_loading: ''
      },
      rules: {
        handle_loading: [
          { required: true, message: '请选择处理进度', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //取消
    cancel(){
      this.$refs['ruleForm'].resetFields();
      this.handleShowHindeLoading();
    },
    //提交结果
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.aftersaleHandleLoading();
        }
      });
    },
    //提交
    async aftersaleHandleLoading(){
      let { detail } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.aftersaleHandleLoading, {
        handle_loading: detail.handle_loading,
        id: detail.id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.cancel();
        //this.$attrs.callback();//回调
        this.$refs['ruleForm'].resetFields();
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //关闭显示
    handleShowHindeLoading(detail){
      if(detail){
        this.$data.detail = this.copyJson(detail);
        this.$data.isShow = true;
      }else{
        this.$data.isShow = false;
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
