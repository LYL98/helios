
<!--
1、初始化时，获取到一个 value值 和 options对象
    options示例： { '全部': '', '已审核': '1' , '未审核': '0' }
2、当用户点击后，对value进行更新
3、在外部可以用过 @change 事件 监听button按钮的更新
-->

<template>
  <div :style="width ? `'width: ${width};` : ''" class="button-group">
    <el-button
      v-for="(value, key) of options"
      :size="size"
      :key="key"
      :type="selectValue === value ? 'primary' : 'default'"
      :disabled="disabled"
      @click="handleClick(value)"
    >
      {{ key }}
    </el-button>
  </div>
</template>


<script>
  import { Button, ButtonGroup } from 'element-ui';
  export default {
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup
    },
    props: {
      size: { type: String, default: 'small' },
      value: [ String, Number, Boolean ],
      options: { type: Object, default: {} },
      width: { type: String | Number, default: '' },
      disabled: { type: Boolean, default: false }
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

<style lang="scss">
  .button-group{
    display: flex;
    >button{
      flex: 1;
      margin: 0 !important;
      border-radius: 0;
      &:first-child{
        border-radius: 3px 0 0 3px;
      }
      &:last-child{
        border-radius: 0 3px 3px 0;
      }
    }
  }
</style>

