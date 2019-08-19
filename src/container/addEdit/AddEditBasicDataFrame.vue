<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}商品筐`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :disabled="detail.id" placeholder="请输入12位以内的字母和数字组合" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="筐重" prop="weight">
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
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { InputWeight, InputPrice } from '@/common';

export default {
  name: "AddEditBasicDataFrame",
  mixins: [addEditMixin],
  components: {
    'input-weight': InputWeight,
    'input-price': InputPrice
  },
  data(){
    //判断是否是重量
    let isWeight = (rule, value, callback) => {
      if (!Verification.isWeight(value)) {
        callback(new Error('请输入正确的商品筐重量'));
      } else {
        callback();
      }
    }

     //判断是否是金额
    let isPrice = (rule, value, callback) => {
      if (!Verification.isPrice(value)) {
        callback(new Error('请输入正确的商品筐价格'));
      } else {
        callback();
      }
    };

    let validWeight = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 100000) {
          callback('筐重不能超过100000')
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

      let { detail } = that;
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
      initDetail: {
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
          { required: true, message: '筐重不能为空', trigger: 'blur' },
          { pattern: Verification.testStrs.isValidValue, message: '筐重必须为数字', trigger: 'blur' },
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
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.$data.detail = JSON.parse(JSON.stringify({
          ...data,
          weight: this.returnWeight(data.weight),
          price: this.returnPrice(data.price),
          id: true,
        }));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataFrameEdit' : 'basicdataFrameAdd'], {
        ...detail,
        weight: this.handleWeight(detail.weight),
        price: this.handlePrice(detail.price)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableBasicDataFrame');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
