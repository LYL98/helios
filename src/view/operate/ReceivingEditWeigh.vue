<template>
  <div class="receiving-allot">
    <el-dialog title="称重" :visible="isShow" width="520px" :before-close="cancel" :close-on-click-modal="false">
      <el-form label-position="right" label-width="140px" style="width: 380px;" :model="dataItem" :rules="rules" ref="ruleForm">
        <el-form-item label="客户">
          <div style="font-size: 16px;">{{dataItem.store_title}}</div>
        </el-form-item>
        <el-form-item label="商品">
          <div style="font-size: 16px;">
            <span style="font-weight: bold;font-size: 16px;">{{dataItem.item_code}}</span>
            <span>{{dataItem.item_title}}</span>
          </div>
        </el-form-item>
        <el-form-item label="实重/应重(斤)" prop="real_weight_temp">
          <div class="edit-div">
            <span :class="`input ${isWeighWarn(dataItem) && 'warn'}`" @click="editWeigh">{{dataItem.real_weight_temp}}&nbsp;</span>
            <span>/</span>
            <span>{{returnWeight(dataItem.order_weight)}}</span>
          </div>
        </el-form-item>
        <div style="margin-left: 120px;color: red;">注：实重为含框的重量</div>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Dialog } from 'element-ui';
import { Config, Constant, DataHandle, Method } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "ReceivingEditWeigh",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'operateReceivingWeighIsShowEdit',
    editWeighData: 'operateReceivingEditWeighData'
  }),
  data(){
    let validRealWeight = (rules, value, callback) => {
      if (isNaN(value)) {
        return callback(new Error('称重必须为数字'));
      }
      if (!/^[0-9]+([.]\d{1})?$/.test(value)) {
        return callback(new Error('称重最多只能输入一位小数'));
      }
      if (value < 0) {
        return callback(new Error('称重不能小于0'));
      }
      if (value > 100000) {
        return callback(new Error('称重不能超过100000'));
      }
      callback();
    };
    return {
      weightScope: Constant.WEIGHT_SCOPE,//称重浮动范围
      dataItem: {},
      rules: {
        real_weight_temp: [
          { required: true, message: '称重不能为空', trigger: 'change' },
          { validator: validRealWeight, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },
    //重量是否异常
    isWeighWarn(data){
      let that = this;
      if(data.real_weight === null){
        return false;
      }
      if(data.real_weight > data.order_weight * (1 + that.weightScope)){
        return true;
      }
      if(data.real_weight < data.order_weight * (1 - that.weightScope)){
        return true;
      }
      return false;
    },
    //取消
    cancel(){
      this.operateReceivingWeighShowHideEdit({ isShow: false });
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //修改重量
    editWeigh(){
      let that = this;
      let { dataItem } = that;
      NumberKey.show({
        num: dataItem.real_weight_temp,
        type: 'Weight',
        confirm(num){
          dataItem.real_weight = that.handleWeight(num);
          dataItem.real_weight_temp = num;
          that.$data.dataItem = dataItem;
          that.$refs['ruleForm'].validate();
        }
      });
    },
    //确认提交
    submit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { dataItem } = that;
          that.operatorReceivingWeighData({
            data: {
              store_item_id: dataItem.id,
              real_weight: that.handleWeight(dataItem.real_weight_temp)
            },
            callback: ()=>{
              let c = that.$attrs.callback;
              typeof c === 'function' && c();//回调
              that.cancel();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['operateReceivingWeighShowHideEdit', 'operatorReceivingWeighData'])
  },
  watch:{
    editWeighData: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        if(a){
          let d = JSON.parse( JSON.stringify(a));
          d.real_weight_temp = d.real_weight;
          if(d.real_weight){
            d.real_weight_temp = that.returnWeight(d.real_weight);
          }
          that.dataItem = d;
        }else{
          that.dataItem = {};
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .edit-div{
    font-size: 20px;
    span{
      display: inline-block;
      height: 36px;
      line-height: 36px;
      border: 1px solid #fff;
      &.input{
        border: 1px solid #999;
        width: 84px;
        border-radius: 3px;
        text-align: center;
      }
      &.warn{
        color: red;
        border: 1px solid red;
        font-weight: bold;
      }
    }
  }
</style>
