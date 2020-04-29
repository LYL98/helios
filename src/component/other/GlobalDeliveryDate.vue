<template>
  <el-date-picker
    :size="size"
    v-model="selectValue"
    value-format="yyyy-MM-dd"
    style="width: 100%;"
    :placeholder="placeholder"
    :clearable="false"
  />
</template>

<script>
import Vue from 'vue';
import { DatePicker } from 'element-ui';
import { Http, Config, DataHandle } from '@/util';

export default {
  name: "GlobalDeliveryDate",
  components: {
    'el-date-picker': DatePicker
  },
  props: {
    value: { type: String | Object, default: null },
    placeholder: { type: String, default: '配送日期' },
    size: { type: String, default: 'small' },
    change: { type: Function },
    initCallBack: { type: Function }
  },
  data() {
    return {
      selectStorehouse: {},
    };
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  created(){
    if(this.$deliverydate){
      this.changeDate(this.$deliverydate, 'init');
      return;
    }
    let date = DataHandle.formatDate(new Date(), 'yyyy-MM-dd');
    this.changeDate(date, 'init');
  },
  computed: {
    selectValue: {
      get(){
        return this.value;
      },
      set(v){
        this.changeDate(v);
      }
    },
  },
  methods: {
    //改变
    changeDate(date, type){
      this.$data.selectStorehouse = date;
      this.$emit('ev', date); //先v-model
      if(type === 'init'){
        this.$emit('initCallBack', date); //后initCallBack
      }else{
        //全局注册方法
        Vue.use({
          install(Vue){
            //全局仓
            Vue.prototype.$deliverydate = date;
          }
        });
        this.$emit('change', date); //后change
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
