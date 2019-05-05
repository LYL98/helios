<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      v-if="show"
      :append-to-body="append-to-body"
    >
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
  import { Dialog } from 'element-ui';
  export default {
    component: {
      'el-dialog': Dialog
    },
    props: {
      title: { type: String, default: '' },
      show: { type: Boolean, default: false },
      'append-to-body': { type: Boolean, default: false }
    },
    data() {
      return {
        visible: this.show
      };
    },
    watch: {
      show() {
        this.visible = this.show;
      }
    }
  };
</script>
