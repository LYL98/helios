import { DataHandle, Http, Method, Constant, Config } from '@/util';
import {DatePicker, Row, Col, Input, Button, Message, RadioGroup, RadioButton, Radio, Dialog, Form, FormItem, Transfer, Slider} from 'element-ui';

export default {
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    'el-transfer': Transfer,
    'el-input': Input,
    'el-button': Button,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-col': Col,
    'el-slider': Slider
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
  },
  data() {
    //今天
    let today = DataHandle.returnDateStr(); //返回今日日期时间字符串
    today = DataHandle.returnDateFormat(today, 'yyyy-MM-dd');

    //明天
    let tomorrow = DataHandle.returnDateCalc(today, 1);
    tomorrow = DataHandle.returnDateFormat(tomorrow, 'yyyy-MM-dd');

    return {
      province: this.$province,
      auth: this.$auth,
      today: today, //今天
      tomorrow: tomorrow, //明天
      tencentPathUp: Config.tencentUpPath,
      tencentPath: Config.tencentPath,
      defaultAvatar: Constant.IMGS.defaultAvatar,
      isShow: false,
      detail: {},
      rules: {}
    }
  },
  created() {
    
  },
  methods: {
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },
    //返回加价率
    returnMarkup(data){
      return DataHandle.returnMarkup(data);
    },
    //处理加价率
    handleMarkup(data){
      return DataHandle.handleMarkup(data);
    },
    //显示新增修改(供外部也调用)
    showAddEdit(data){
      if(data){
        this.$data.detail = JSON.parse(JSON.stringify(data));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //提交
    handleAddEdit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addEditData();
        } else {
          return false;
        }
      });
    },
    //取消新增修改
    handleCancel(){
      this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.$data.isShow = false;
    },
  }
}
