<template>
  <div class="common-query-item">
    <div v-if="label" class="query-label">
      <span class="align-right" v-if="align !== 'left'">{{ label }}</span>
      <span v-if="align === 'left'">{{ label }}</span>
    </div>
    <div class="query-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QueryItem",
    props: {
      align: { type: String, default: 'right' },
      label: { type: String | undefined, default: '' }
    }
  }
</script>

<style lang="scss" scoped>
  .common-query-item {
    display: flex;
    align-items: center;
  }
  .query-label {
    display: flex;
    height: 32px;
    font-size: 12px;
    align-items: center;
    margin-right: 12px;
  }
  .query-main{
    flex: 1;
  }

  .align-right {
    display: block;
    width: 60px;
    text-align: right;
  }
</style>
