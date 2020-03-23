<template>
  <div>
    <div class="table-option-btn" @click="isShow = true"><i class="el-icon-caret-bottom"></i></div>
    <el-dialog title="设置表头显示" :visible="isShow" width="540px" :before-close="() => isShow = false">
      <div>
        <el-transfer v-model="showColumn" :data="columnList" :titles="['隐藏的列','显示的列']" @change="changeSelect"></el-transfer>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Dialog, Transfer } from 'element-ui';
  import { Constant } from '@/util';
  export default {
    name: 'TableSettingColumnTitle',
    components: {
      'el-dialog': Dialog,
      'el-transfer': Transfer
    },
    props: {
      columnList: { type: Array, default: [] },
      change: { type: Function },
      value: { type: Array }
    },
    data() {
      let showColumn = this.$props.value;
      return {
        isShow: false,
        showColumn: showColumn
      }
    },
    methods: {
      changeSelect(value){
        this.$emit('change', value);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
