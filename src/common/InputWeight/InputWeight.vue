<template>
  <el-input v-model="changeValue" :placeholder="placeholder" :disabled="disabled" :size="size">
    <template slot="append" v-if="unit">{{unit}}</template>
  </el-input>
</template>
<script>
  import inputMixin from './../input.mixin';
  import { DataHandle, Verification } from '@/util';

  export default {
    name: 'InputWeight',
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
          let p = '';
          if(v !== '' && typeof v !== 'undefined'){
            p = DataHandle.returnWeight(v);
          }
          if(typeof p === 'string' && p.indexOf('.') >= 0) return p;
          return p + this.isFinallyDot;
        },
        set(v) {
          if(v === '0.0' || v.indexOf('..') >= 0) return;

          if(v.indexOf('.') === v.length - 1 && v.length > 0){
            this.$data.isFinallyDot = '.';
            if(!Verification.isPercent(v + '0')) return;
          }else if(v.indexOf('.0') === v.length - 2 && v.length > 2){
            this.$data.isFinallyDot = '.0';
            if(!Verification.isPercent(v)) return;
          }else{
            this.$data.isFinallyDot = '';
            if(!Verification.isPercent(v)) return;
          }

          let p = '';
          if(v === ''){
            p = '';
          }else{
            let { min, max } = this.$props;
            if(Number(v) < Number(min)) return; //最小值
            if(Number(v) > Number(max)) return; //最大值
            p = DataHandle.handleWeight(v);
          }
          this.$emit('change', p);
        }
      }
    },
    methods: {
    }
  }
</script>
<style scoped>

</style>
