<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}商户外标签`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入4位以内的字符" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEditMerchantOuterTags",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    return{
      initDetail: {},
      rules: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    //取消
    handleCancel(){
      this.basicDataMerchantOuterTagsShowHideAddEdit({ isShow: false });
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          that.basicDataMerchantOuterTagsAddEdit({
            data: detail,
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.handleCancel();
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  watch:{
    basicDataMerchantOuterTagsDetail: {
      deep: true,
      handler: function (a, b) {
        this.detail = JSON.parse( JSON.stringify( a ) );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
