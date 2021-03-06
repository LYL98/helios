import {
  Table,
  TableColumn,
  Pagination,
  DatePicker,
  Row,
  Col,
  Input,
  Button,
  RadioGroup,
  RadioButton,
  Checkbox,
  Radio,
  Dialog,
  Form,
  FormItem,
  Transfer,
  TabPane,
  Tabs,
  Tag,
  Popover,
  Select,
  Option,
  Tree,
  Tooltip,
  InputNumber,
  Slider,
  TimePicker,
  Drawer,
  Switch,
  Collapse,
  CollapseItem,
} from 'element-ui';
import { DataHandle, Http, Config, Constant } from '@/util';

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
    'el-drawer': Drawer,
    'el-switch': Switch,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
    windowHeight: { type: Number, default: 0 }
  },
  data() {
    //今天日期
    let today = DataHandle.returnDateStr();
    today = DataHandle.returnDateFormat(today, 'yyyy-MM-dd');

    //明天
    let tomorrow = DataHandle.returnDateCalc(today, 1);
    tomorrow = DataHandle.returnDateFormat(tomorrow, 'yyyy-MM-dd');

    return {
      tencentPathUp: Config.tencentUpPath,
      tencentPath: Config.tencentPath,
      defaultAvatar: Constant.IMGS.defaultAvatar,
      province: this.$province,
      auth: this.$auth,
      today: today,
      nowDate: today,
      tomorrow: tomorrow
    }
  },
  created() {

  },
  methods: {
    //显示新增修改(新增组件，数据, add,edit,detail)
    handleShowAddEdit(pageComponents, data, type){
      let pc = this.getPageComponents(pageComponents);
      pc.showAddEdit(data, type);
    },
    //显示详情
    handleShowDetail(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showDetail(data);
    },
    //显示form
    handleShowForm(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showForm(data);
    },
    //显示打印
    handleShowPrint(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showPrint(data);
    },
    //列表导出
    async handleExport(apiStr, query) {
      let api = Config.api[apiStr];
      //判断是否可导出
      this.$loading({ isShow: true });
      let res = await Http.get(`${api}_check`, query);
      if(res.code === 0){
        let queryStr = `${api}?`;
        for(let item in query){
          queryStr += `${item}=${query[item]}&`;
        }
        queryStr = queryStr.substring(0, queryStr.length - 1);
        window.open(queryStr);
      }else{
        this.$message({ title: '提示', message: res.message, type: 'error' });
      }
      this.$loading({ isShow: false });
    },
    /**
     * 斑马线的背景颜色样式
     */
    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },
    //深拷贝json
    copyJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    //返回价格
    returnPrice(price) {
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price) {
      return DataHandle.handlePrice(price);
    },

    //返回重量
    returnWeight(weight) {
      return DataHandle.returnWeight(weight);
    },
    //处理重量
    handleWeight(data) {
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
    returnMarkup(markup) {
      return DataHandle.returnMarkup(markup);
    },
    //处理加价率
    handleMarkup(data) {
      return DataHandle.handleMarkup(data);
    },
    //返回下单率
    returnLowerRate(data) {
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

    //处理单位（数据，单位，没值替换符）
    returnUnit(data, unit, replaceStr){
      if(data) return `${data}${unit}`;
      if(replaceStr) return replaceStr;
      return `${data}${unit}`;
    },

    //处理基本数据类型转array
    handleToArray(data) {
      if (data) return [data];
      return [];
    },

    //返回数组第几位，如空则返''
    returnArrayIndex(data, index) {
      if (data && data.length > index) {
        return data[index];
      }
      return '';
    },

    //判断and s,
    judgeAnds(data, ands) {
      //let con = ands.filter( item => item === data);
      //return con.length > 0 ? true : false;
    },

    //判断or s,
    judgeOrs(data, ors) {
      let con = ors.filter(item => item === data);
      return con.length > 0 ? true : false;
    },
    //返回List里的某个key的list (key, list)
    returnListKeyList(key, list){
      let data = [];
      list.forEach(item => {
        data.push(item[key]);
      });
      return data;
    },
    //选择map key
    selectMapKeys(mapData, keys){
      let d = {};
      for(const item in mapData) {
        let con = keys.filter(key => key === item);
        if(con.length > 0) d[item] = mapData[item];
      }
      return d;
    },
    //删除map key
    deleteMapKeys(mapData, keys){
      let d = this.copyJson(mapData);
      keys.forEach(item => {
        delete (d[item]);
      });
      return d;
    }
  }
}
