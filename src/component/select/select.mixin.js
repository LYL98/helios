import { Select, Option } from 'element-ui';

export default {
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created() {
    let { value } = this.$props;
    if (value) {
      this.$data.query.id = value;
    }
    if(this.createdGetData){
      this.getData();
    }
  },
  props: {
    showAll: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    value: { type: Number | String, default: '' },
    size: { type: String, default: '' },
    hasAllSelection: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    remote: { type: Boolean, default: false },
    createdGetData: { type: Boolean, default: true }, //是否组件创建时取数据
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      selectId: this.value || '',
      query: {
        id: '',
        condition: '',
        title: '',
        need_num: 10
      },
      dataItem: []
    };
  },
  methods: {
    //改变
    handleChange(v, isInit) {
      this.$emit('ev', v, isInit);
      let data = this.dataItem.filter((item) => item.id === v || item.code === v);
      data = data.length > 0 ? data[0] : {};
      this.$emit('change', data, isInit);
    },
    //搜索条件
    searchMethod(v) {
      let { value } = this.$props;
      if (v) {
        this.$data.query.id = '';
        this.$data.query.condition = v;
        this.$data.query.title = v;
      } else if (value) {
        this.$data.query.id = value;
        this.$data.query.condition = '';
        this.$data.query.title = '';
      } else {
        this.$data.query.id = '';
        this.$data.query.condition = '';
        this.$data.query.title = '';
      }
      this.getData();
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.selectId = a || '';
        //如果可搜索
        if (this.filterable) {
          this.$data.query.id = a || '';
          this.$data.query.condition = '';
          this.$data.query.title = '';
          this.searchMethod('');
        }
      }
    }
  }
}
