<template>
  <div class="common-query-item">
    <div v-if="label" class="label">
      <span class="align-right" v-if="align !== 'left'">{{ label }}</span>
      <span v-if="align === 'left'">{{ label }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "QueryItem",
    props: {
      align: { type: String, default: 'right' },
      label: { type: String | undefined, default: ''}
    }
  }
</script>

<style lang="scss" scoped>
  .common-query-item {
    display: flex;
    align-items: center;
  }
  .label {
    display: flex;
    height: 32px;
    font-size: 12px;
    align-items: center;
    margin-right: 12px;
  }

  .align-right {
    display: block;
    width: 60px;
    text-align: right;
  }

  /*.align-right {*/
    /*justify-content: flex-end;*/
    /*width: 60px;*/
    /*background-color: red;*/
  /*}*/

</style>
