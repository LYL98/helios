import { Select, Option } from 'element-ui';

export default {
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    let { value } = this.$props;
    if(value){
      this.$data.query.id = value;
    }
    this.getData();
  },
  props: {
    clearable: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    value: {type: Number | String, default: ''},
    size: {type: String, default: ''},
    hasAllSelection: { type: Boolean, default: false }
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
        count: 10
      },
      dataItem: []
    };
  },
  methods: {
    //改变
    handleChange(v, isInit){
      this.$emit('ev', v, isInit);
      let data = {};
      for(let i = 0; i < this.dataItem.length; i++){
        if(this.dataItem[i].id === v || this.dataItem[i].code === v){
          data = this.dataItem[i];
          break;
        }
      }
      this.$emit('change', data, isInit);
    },
    //搜索条件
    searchMethod(v){
      let { value } = this.$props;
      if(v){
        this.$data.query.id = '';
        this.$data.query.condition = v;
        this.$data.query.title = v;
      }else if(value){
        this.$data.query.id = value;
        this.$data.query.condition = '';
        this.$data.query.title = '';
      }else{
        this.$data.query.id = '';
        this.$data.query.condition = '';
        this.$data.query.title = '';
      }
      this.getData();
    }
  },
  watch:{
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.selectId = a || '';
        this.$data.query.id = a || '';
        this.$data.query.condition = '';
        this.$data.query.title = '';
        this.searchMethod('');
      }
    }
  }
}
