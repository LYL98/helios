<template>
  <el-input v-model="changeValue" :placeholder="placeholder" :disabled="disabled" :size="size">
    <template slot="append">元</template>
  </el-input>
</template>
<script>
  import inputMixin from './../input.mixin';
  import { DataHandle, Verification } from '@/util';

  export default {
    mixins: [inputMixin],
    data(){
      return{
        isFinallyDot: ''
      }
    },
    computed: {
      changeValue: {
        get() {
          let v = this.$props.value;
          let price = '';
          if(v !== '' && typeof v !== 'undefined'){
            price = DataHandle.returnPrice(v);
          }
          if(typeof price === 'string' && price.indexOf('.') >= 0) return price;
          return price + this.isFinallyDot;
        },
        set(v) {
          if(v === '0.00') return;

          if(v.indexOf('.') === v.length - 1 && v.length > 0){
            this.$data.isFinallyDot = '.';
            if(!Verification.isPrice(v + '0')) return;
          }else if(v.indexOf('.0') === v.length - 2 && v.length > 2){
            this.$data.isFinallyDot = '.0';
            if(!Verification.isPrice(v)) return;
          }else{
            this.$data.isFinallyDot = '';
            if(!Verification.isPrice(v)) return;
          }

          let price = '';
          if(v === ''){
            price = '';
          }else{
            let { min, max } = this.$props;
            if(Number(v) < Number(min)) return; //最小值
            if(Number(v) > Number(max)) return; //最大价格
            price = DataHandle.handlePrice(v);
          }
          this.$emit('change', price);
        }
      }
    },
    methods: {
    }
  }
</script>
<style scoped>

</style>
