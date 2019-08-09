import { Input } from 'element-ui';

export default {
  components: {
    'el-input': Input
  },
  props: {
    min: { type: Number | String, default: 0 },
    max: { type: Number | String, default: 1000000 },
    value: { type: Number | String, default: '' },
    placeholder: { type: String, default: '' },
    unit: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: '' }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
}
