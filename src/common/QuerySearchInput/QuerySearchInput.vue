<template>
  <el-row style="flex: 1;">
    <el-col :span="15">
      <el-input v-model="condition" :size="size" :placeholder="placeholder" @keyup.enter.native="search"/>
    </el-col>
    <el-col :span="9" style="position: relative; left: -5px;">
      <el-button :size="size" type="primary" @click.native="search" icon="el-icon-search"></el-button>
      <el-button :size="size"  type="primary" plain @click.native="reset">重置</el-button>
    </el-col>
  </el-row>
</template>


<script>
  import { Button, Row, Col, Input } from 'element-ui';
  export default {
    name: 'QuerySearchInput',
    components: {
      'el-input': Input,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button
    },
    props: {
      size: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      value: { type: String, default: '' }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      condition: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    methods: {
      //搜索
      search(){
        this.$emit('search');
      },
      //重置
      reset(){
        this.$emit('reset');
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

