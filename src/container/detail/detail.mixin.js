import { DataHandle, Http, Method, Constant, Config } from '@/util';
import {Table, TableColumn, Pagination, DatePicker, Row, Col, Input, Button, RadioGroup, RadioButton, Radio, Dialog, Form, FormItem, Transfer, TabPane, Tabs, Tag} from 'element-ui';

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
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
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-tag': Tag
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
  },
  data() {
    return {
      province: this.$province,
      auth: this.$auth,
      tencentPath: Config.tencentPath,
      defaultAvatar: Constant.IMGS.defaultAvatar,
      isShow: false,
      detail: {}
    }
  },
  created() {
    
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
    //处理百分比
    returnPercent(data) {
      return DataHandle.returnPercent(data);
    },
    //返回表格序号
    indexMethod(index) {
      let { query } = this;
      return (query.page - 1) * query.page_size + index + 1;
    },
    //显示新增修改(供外部也调用)
    showDetail(data){
      if(data){
        this.$data.detail = JSON.parse(JSON.stringify(data));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //取消
    handleCancel(){
      this.$data.isShow = false;
      this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
    },
  }
}
