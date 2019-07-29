<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}商户内标签`" :visible="isShow" width="720px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入4位以内的字符" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAddEdit">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Input, Dialog } from 'element-ui';
import { Config, Constant, Verification } from '@/util';

export default {
  name: "MerchantInnerTagsAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'basicDataMerchantInnerTagsIsShowAddEdit',
    basicDataMerchantInnerTagsDetail: 'basicDataMerchantInnerTagsDetail'
  }),
  data(){
    return{
      detail: {},
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    //取消
    cancelAddEdit(){
      this.basicDataMerchantInnerTagsShowHideAddEdit({ isShow: false });
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
          that.basicDataMerchantInnerTagsAddEdit({
            data: detail,
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.cancelAddEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['basicDataMerchantInnerTagsShowHideAddEdit', 'basicDataMerchantInnerTagsAddEdit'])
  },
  watch:{
    basicDataMerchantInnerTagsDetail: {
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
