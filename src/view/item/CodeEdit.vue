<template>
  <div>
    <el-dialog title="编辑商品编号" :visible="isShow" width="720px" :before-close="cancelCodeEdit" :close-on-click-modal="false">
      <el-form :model="detail" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" style="width: 600px;">
        <el-form-item label="商品编号" prop="code">
          <el-input placeholder="不能大于6位数字" @keyup.enter.native="submitCodeEdit" v-model="detail.code" :maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelCodeEdit">取 消</el-button>
        <el-button type="primary" @click.native="submitCodeEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, MessageBox, Dialog, Input } from 'element-ui';
import { Config, DataHandle, Verification } from '@/util';
import { Item, Base } from '@/service';

export default {
  name: "CodeEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-input': Input,
  },
  computed: mapGetters({
    isShow: 'itemItemIsShowEditCode',
    itemItemDetail: 'itemItemDetail'
  }),
  data() {
    return {
      detail: {
        code: ''
      },
      rules: {
        code: [
          { required: true, message: '商品编号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.isNumber, message: '商品编号必须是整数', trigger: 'blur' },
        ]
      }
    }
  },
  watch: {
    itemItemDetail: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        let rd = JSON.parse( JSON.stringify( a ) );
        this.detail = rd;
      }
    }
  },
  methods: {
    //取消
    cancelCodeEdit(){
      this.itemItemShowHideEditCode({ isShow: false });
    },
    //修改商品编号
    submitCodeEdit() {
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          that.itemCodeEdit({
            data: {
              id: detail.id,
              code: detail.code
            },
            callback: (res)=>{
              this.$attrs.callback();
              that.cancelCodeEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['itemItemShowHideEditCode', 'itemCodeEdit'])
  }
}
</script>

<style scoped>

</style>
