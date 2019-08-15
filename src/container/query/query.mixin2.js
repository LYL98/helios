import { DataHandle, Http, Method, Constant } from '@/util';
import { QueryItem, CollapseQuery } from '@/common';
import { Form, FormItem, DatePicker, Input, Button, RadioGroup, RadioButton, Radio, Dialog, Row, Col, Select, Option } from 'element-ui';

export default {
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    'el-input': Input,
    'el-button': Button,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-dialog': Dialog,
    'el-select': Select,
    'el-option': Option,
    'my-query-item': QueryItem,
    'my-collapse-query': CollapseQuery
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
    windowHeight: {type: Number, default: 0}
  },
  data() {
    return {
      province: this.$province,
      auth: this.$auth,
      query: {
        page: 1,
        page_size: Constant.PAGE_SIZE
      },
      isShowFiltrate: false, //显示高级筛选
      isExpand: false,
    }
  },
  created() {
    
  },
  methods: {
    //初始化搜索条件
    initQueryData(){
      if(this.initQuery){
        for(let key in this.initQuery){
          this.query[key] = this.initQuery[key]
        }
        this.query.page = 1;
        this.$data.query = JSON.parse(JSON.stringify(this.query));
      }
    },
    //搜索方法(页面组件)
    handleQuery(pageComponent){
      let pc = this.getPageComponents(pageComponent);
      this.$data.query.page = 1;
      pc.getData(this.query);
    },
    //清除搜索(页面组件)
    handleClearQuery(pageComponent){
      let pc = this.getPageComponents(pageComponent);
      this.initQueryData();
      pc.getData(this.query);
    },
    //显示高级筛选
    handleShowFiltrate(){
      this.$data.isShowFiltrate = true;
    },
    //隐藏高级筛选
    handleHideFiltrate(){
      this.$data.isShowFiltrate = false;
    },
    //收起展开
    onExpandChange(isExpand, pageComponent) {
      this.isExpand = isExpand;
      let pc = this.getPageComponents(pageComponent);
      if(pc){
        pc.onExpandChange(isExpand);
      }
    }
  }
}
