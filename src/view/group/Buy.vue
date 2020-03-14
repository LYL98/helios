<template>
  <div>
    <buy-list :show-log-list="handleShowLogList"></buy-list>
    <el-dialog
      :visible.sync="dialog.isShowLogList"
      title="操作记录"
      width="1100px"
      append-to-body
    >
      <buy-log-list v-if="dialog.isShowLogList" />
    </el-dialog>
  </div>
</template>

<script>
  import BuyList from './BuyList';
  import BuyLogList from './BuyLogList';
  import { Dialog } from 'element-ui';

  export default {
    name: "Buy",
    components: {
      'el-dialog': Dialog,
      'buy-list': BuyList,
      'buy-log-list': BuyLogList
    },
    data() {
      return {
        dialog: {
          isShowLogList: false
        }
      }
    },
    methods: {
      handleShowLogList() {
        this.$data.dialog.isShowLogList = true;
      }
    }
  }
</script>

<style scoped>

</style>
