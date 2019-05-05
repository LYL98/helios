<template>
  <el-button v-if="name" :type="buttonType" :icon="iconType" :size="size" @click.native="onClick">{{name}}</el-button>
  <el-button v-else :type="buttonType" :icon="iconType" :size="size" @click.native="onClick"></el-button>
</template>

<script>
import { Button } from 'element-ui'

export default {
  name: 'Button',
  props: ['cType', 'type', 'icon', 'name', 'size'],
  computed: {
    iconType: function () {
      let { cType, icon } = this
      if (icon) {
        return icon
      } else {
        switch (cType) {
          case 'search':
            return 'el-icon-search';
          case 'add':
            return 'el-icon-plus';
          default:
            return ''
        }
      }
    },
    buttonType: function () {
      let { cType, type } = this
      if (type) {
        return type
      } else {
        switch (cType) {
          case 'search':
          case 'add':
          case 'primary':
            return 'primary';
          case 'text':
            return 'text';
          default:
            return ''
        }
      }
    }
  },
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  },
  components: {
    'el-button': Button
  }
}
</script>

<style scoped>

</style>
