<template>
  <div class="form-area">
    <div class="label" :style="`width: ${width}; text-align: ${position}`">
      <span>{{ label }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "FormArea",
    props: {
      label: { type: String, default: '' },
      'label-width': { type: String, default: '' },
      'label-position': { type: String, default: '' }
    },
    data() {
      return {
        width: '',
        position: ''
      }
    },
    created() {
      if (!this.$parent.$vnode || this.$parent.$vnode.tag.indexOf('ElForm') == -1) {
        throw new Error('FormArea 组件必须做为el-form组件的直系子组件使用。')
      } else {
        this.$data.width = this.$props['label-width'] || this.$parent.$props.labelWidth;
        this.$data.position = this.$props['label-position'] || this.$parent.$props.labelPosition;
      }
    }
  }
</script>

<style scoped>

  .form-area > .label {
    font-weight: 600;
    color: #3B3D42;
    box-sizing: border-box;
    padding-right: 19px;
    margin-bottom: 16px;
  }
</style>
