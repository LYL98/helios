<template>
  <el-popover
    v-if="content.length > maxlength"
    :content="content"
    :trigger="trigger"
    :placement="placement"
    :width="width"
  >
    <span slot="reference" style="cursor: pointer;">{{ content.slice(0, maxlength) }} ...</span>
  </el-popover>
  <span v-else>{{ content }}</span>
</template>

<script>
  import { Popover } from 'element-ui';

  export default {
    name: "OmissionText",
    components: {
      'el-popover': Popover
    },
    props: {
      content: { type: String, default: '' },
      maxlength: { type: Number | String, default: 30 },
      width: { type: Number | String, default: '300'},
      placement: { type: String, default: 'top-start'},
      trigger: { type: String, default: 'hover' }
    }
  }
</script>

<style scoped>

</style>
