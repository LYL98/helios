<template>
  <div>
    <head-list
      :item-add="handleItemAdd"
      ref="headList"
    ></head-list>
    <el-dialog
      title="新增团长"
      :visible.sync="dialog.isShowItemAdd"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
    >
      <head-edit v-if="dialog.isShowItemAdd" :close="handleClose" :refreshList="handleRefreshList"></head-edit>
    </el-dialog>
  </div>
</template>

<script>
  import { Dialog } from 'element-ui';
  import HeadList from './HeadList';
  import HeadEdit from './HeadEdit';
  export default {
    name: "Head",
    components: {
      'head-list': HeadList,
      'head-edit': HeadEdit,
      'el-dialog': Dialog
    },
    data() {
      return {
        dialog: {
          isShowItemAdd: false
        }
      }
    },
    created() {
      documentTitle('团购 - 团长列表');
    },
    methods: {
      handleItemAdd() {
        this.$data.dialog.isShowItemAdd = true;
      },
      handleClose() {
        this.$data.dialog.isShowItemAdd = false;
      },
      handleRefreshList() {
        this.$refs['headList'] && this.$refs['headList'].headQuery();
      },
    }
  }
</script>

<style scoped>

</style>
