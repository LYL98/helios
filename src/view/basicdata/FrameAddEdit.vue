<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}商品框`" :visible="isShow" width="720px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :disabled="detail.id" placeholder="请输入12位以内的字母和数字组合" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="框重" prop="weight">
          <el-input v-model="detail.weight" placeholder="0 - 100000"><template slot="append">斤</template></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="detail.price" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="200" placeholder="请输入200位以内的字符"></el-input>
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
import { Http, Config, Verification, DataHandle } from '@/util';

export default {
  name: "FrameAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'basicDataFrameIsShowAddEdit',
    basicDataFrameDetail: 'basicDataFrameDetail'
  }),
  data(){
    //判断是否是重量
    let isWeight = (rule, value, callback) => {
      if (!Verification.isWeight(value)) {
        callback(new Error('请输入正确的商品框重量'));
      } else {
        callback();
      }
    }

     //判断是否是金额
    let isPrice = (rule, value, callback) => {
      if (!Verification.isPrice(value)) {
        callback(new Error('请输入正确的商品框价格'));
      } else {
        callback();
      }
    };

    let validWeight = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 100000) {
          callback('框重不能超过100000')
        } else if (numStr.indexOf('.') > 1) {
          callback('最多只能输入1位小数')
        } else {
          callback()
        }
      } else {
        callback('必须为数值')
      }
    };

    let validPrice = function (rules, value, callback) {
      // console.log(value, ',', typeof value);
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000000) {
          callback('金额不能超过1000000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须为数值')
      }
    };

    let that = this;

    let validCode = function (rules, value, callback) {
      let asyncValid = () => {
        Http.get(Config.api.baseFrameList, {
          code: value
        }).then(res => {
          if (res.data && res.data.length > 0) {
            callback(new Error('编号重复，请重新输入'))
          } else {
            callback()
          }
        }).catch(e => {
          callback();
        })
      };

      let detail = that.basicDataFrameDetail;
      if (detail.id) {
        //编辑模式
        if (value === detail.code) {
          //没有修改编号
          callback();
        } else {
          asyncValid()
        }
      } else {
        asyncValid()
      }
    };

    return{
      detail: {
      },
      rules: {
        code: [
            { required: true, message: '编号不能为空', trigger: 'blur' },
          { pattern: Verification.testStrs.isNumberOrAlpha, message: '请输入12位以内的字母和数字组合', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' },
        ],
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '框重不能为空', trigger: 'blur' },
          { pattern: Verification.testStrs.isValidValue, message: '框重必须为数字', trigger: 'blur' },
          { validator: validWeight, trigger: 'blur' },
        ],
        price: [
          { required: true, message: '金额不能为空', trigger: 'blur' },
          { pattern: Verification.testStrs.isValidValue, message: '金额必须为数字', trigger: 'blur' },
          { validator: validPrice, trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    //返回价格
    returnPrice(data){
      return DataHandle.returnPrice(data);
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //处理价格
    handlePrice(data){
      return DataHandle.handlePrice(data);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },
    //取消
    cancelAddEdit(){
      this.detail = {};
      this.$refs['ruleForm'].resetFields();
      this.basicDataFrameShowHideAddEdit({ isShow: false});
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          that.basicDataFrameAddEdit({
            data: {
              ...detail,
              weight: that.handleWeight(detail.weight),
              price: that.handlePrice(detail.price)
            },
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
    ...mapActions(['basicDataFrameShowHideAddEdit', 'basicDataFrameAddEdit'])
  },
  watch:{
    basicDataFrameDetail: {
      deep: true,
      handler: function (a, b) {
        this.detail = Object.assign({}, this.detail, a);
        if (this.detail.id) {
          this.detail.weight = this.returnWeight(this.detail.weight) || '';
          this.detail.price = this.returnPrice(this.detail.price) || '';
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
