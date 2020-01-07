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
    clearable: { type: Boolean, default: false },
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
      let data = {};
      let { dataTree } = this;
      if(val.length > 0){
        let fun = (d) =>{
          for(let i = 0; i < d.length; i++){
            if(d[i].code === val[val.length - 1]){
              data = d[i];
              break;
            }
            if(d[i].childs){
              fun(d[i].childs);
            }
          }
        }
        fun(dataTree);
      }
      this.$emit('change', val, data);
    },
  },
}
