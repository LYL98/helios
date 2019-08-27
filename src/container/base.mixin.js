import {Table, TableColumn, Pagination, DatePicker, Row, Col, Input, Button, RadioGroup, RadioButton, Checkbox, Radio, Dialog, Form, FormItem, Transfer, TabPane, Tabs, Tag, Popover, Select, Option, Tree, Tooltip, InputNumber, Slider, TimePicker} from 'element-ui';
import { DataHandle, Config } from '@/util';
import { mapGetters } from 'vuex';

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    'el-time-picker': TimePicker,
    'el-transfer': Transfer,
    'el-input': Input,
    'el-input-number': InputNumber,
    'el-button': Button,
    'el-checkbox': Checkbox,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-col': Col,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-tag': Tag,
    'el-popover': Popover,
    'el-select': Select,
    'el-option': Option,
    'el-slider': Slider,
    'el-tree': Tree,
    'el-tooltip': Tooltip,
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
    windowHeight: {type: Number, default: 0}
  },
  data() {
    return {
      tencentPathUp: Config.tencentUpPath,
      tencentPath: Config.tencentPath,
      //province: this.$province,
      //auth: this.$auth,
    }
  },
  computed: mapGetters({
    auth: 'globalAuth',
    province: 'globalProvince',
  }),
  created() {
    
  },
  methods: {
    //深拷贝json
    copyJson(json){
      return JSON.parse(JSON.stringify(json));
    },
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },

    //返回重量
    returnWeight(weight){
      return DataHandle.returnWeight(weight);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },

    // 返回折扣
    returnDiscount(discount) {
      return DataHandle.returnDiscount(discount);
    },
    // 返回百分比
    returnPercent(data) {
      return DataHandle.returnPercent(data);
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    //处理加价率
    handleMarkup(data){
      return DataHandle.handleMarkup(data);
    },
    //返回下单率
    returnLowerRate(data){
      return DataHandle.returnLowerRate(data);
    },

    //处理日期
    returnDateFormat(dateStr, format) {
      return DataHandle.returnDateFormat(dateStr, format || 'yyyy-MM-dd');
    },

    //处理日期
    returnDate(dateStr) {
      return DataHandle.returnDateFormat(dateStr, 'yyyy-MM-dd')
    },

    //处理时间
    returnTime(dateStr) {
      return DataHandle.returnDateFormat(dateStr, 'HH:mm:ss')
    },

    //处理基本数据类型转array
    handleToArray(data){
      if(data) return [data];
      return [];
    },

    //返回数组第几位，如空则返''
    returnArrayIndex(data, index){
      if(data && data.length > index){
        return data[index];
      }
      return '';
    }
  }
}
