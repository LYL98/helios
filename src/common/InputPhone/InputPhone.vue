<template>
  <el-input v-model="changeValue">
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
          let price = DataHandle.handlePrice(v);
          if(v === '') price = '';
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
