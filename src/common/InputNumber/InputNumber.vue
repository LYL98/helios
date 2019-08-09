<template>
  <el-input v-model="changeValue" :placeholder="placeholder" :disabled="disabled" :size="size">
    <template slot="append" v-if="unit">{{unit}}</template>
  </el-input>
</template>
<script>
  import inputMixin from './../input.mixin';
  import { Verification } from '@/util';

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
          return v || v === 0 ? v.toString() : '';
        },
        set(v) {
          let { min, max, unit } = this.$props;
          let value = '';
          if(v || v === '0'){
            if(!Verification.isNumber(v)) return;
            value = Number(v);
            if(value > max) return; //最大值
            if(value === 0 && min > 0) return; //最小值
          }else{
            value = '';
          }
          this.$emit('change', value);
        }
      }
    },
    methods: {
    }
  }
</script>
<style scoped>

</style>
