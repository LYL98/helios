
<!--
1、初始化时，获取到一个 value值 和 options对象
    options示例： { '全部': '', '已审核': '1' , '未审核': '0' }
2、当用户点击后，对value进行更新
3、在外部可以用过 @change 事件 监听button按钮的更新
-->

<template>
  <el-button-group :class="buttonWidth ? '' : 'query-item-button-group'">
    <el-button
      :class="buttonWidth ? '' : 'query-item-button custom-el-button'"
      :style="buttonWidth && `width: ${buttonWidth}px; text-align: center; padding-left: 0; padding-right: 0;` "
      v-for="(value, key) of options"
      :size="size"
      :key="key"
      :type="selectValue === value ? 'primary' : 'default'"
      @click="handleClick(value)"
    >
      {{ key }}
    </el-button>
  </el-button-group>
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
      buttonWidth: { type: String | Number, default: null }
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

<style scoped>
  /*.group{*/
    /*min-width: 270px;*/
  /*}*/
  /*.button{*/
    /*width: 90px*/
  /*}*/
  /*@media only screen and (max-width: 1400px) {*/
    /*.button {*/
      /*width: 70px*/
    /*}*/
  /*}*/
</style>

