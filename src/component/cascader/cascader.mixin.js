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
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    value: {type: Array, default: []},
    size: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    createdGetData: { type: Boolean, default: true }, //是否组件创建时取数据
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  computed: {
    selectIds: {
      get(){
        return this.value;
      },
      set(v){
        this.$emit('change', v);
      }
    }
  },
  data() {
    return {
      query: {
        id: '',
        condition: '',
        title: '',
        need_num: 10
      },
      dataTree: []
    };
  },
  methods: {
    //选择改变
    handleChange(val) {
      //this.$emit('change', val);
    },
  },
}
