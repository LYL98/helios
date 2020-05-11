
<!--
1、初始化时，获取到一个 value值 和 options对象
    options示例： { '全部': '', '已审核': '1' , '未审核': '0' }
2、当用户点击后，对value进行更新
3、在外部可以用过 @change 事件 监听button按钮的更新
-->

<template>
  <el-select :size="size" v-model="selectValue" :placeholder="placeholder" :clearable="clearable" style="width: 100%;">
    <el-option v-for="(key, value) in options" :key="key" :value="key" :label="value"/>
  </el-select>
</template>


<script>
  import { Select, Option } from 'element-ui';
  export default {
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: {
      size: { type: String, default: '' },
      value: { type: String | Number | Boolean, default: '' },
      options: { type: Object, default: {} },
      placeholder: { type: String, default: '' },
      clearable: { type: Boolean, default: false }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      selectValue: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    methods: {
      handleClick(v) {
        this.selectValue = v;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

