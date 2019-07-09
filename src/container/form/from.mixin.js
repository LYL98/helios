import { DataHandle, Http, Method, Constant, Config } from '@/util';
import {DatePicker, Row, Col, Input, Button, RadioGroup, RadioButton, Radio, Dialog, Form, FormItem, Transfer, TimePicker} from 'element-ui';

export default {
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    'el-time-picker': TimePicker,
    'el-transfer': Transfer,
    'el-input': Input,
    'el-button': Button,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-col': Col
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
    windowHeight: {type: Number, value: 0}
  },
  data() {
    return {
      qiniuPath: Config.qiniuPath,
      defaultAvatar: Constant.IMGS.defaultAvatar,
      isShow: false,
      initDetail: {},
      detail: {},
    }
  },
  created() {
    
  },
  methods: {
    //显示(供外部也调用)
    showFrom(data){
      if(data){
        this.$data.detail = JSON.parse(JSON.stringify(data));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //取消新增修改
    handleCancel(){
      this.$data.isShow = false;
      this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      setTimeout(()=>{
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      },0);
    },
  }
}
