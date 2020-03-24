<template>
  <sub-menu>
    <head-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="HeadList"></head-list>
    <!--详情-->
    <head-detail :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="HeadDetail"></head-detail>
    <!--新增-->
    <head-edit :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="HeadEdit"></head-edit>
    <detail-head-balance-log :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailHeadBalanceLog"/>
  </sub-menu>
</template>

<script>
  import { Dialog } from 'element-ui';
  import HeadList from './HeadList';
  import HeadEdit from './HeadEdit';
  import HeadDetail from './HeadDetail';
  import DetailHeadBalanceLog from './DetailHeadBalanceLog';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Head",
    mixins: [mainMixin],
    components: {
      'head-list': HeadList,
      'head-edit': HeadEdit,
      'head-detail': HeadDetail,
      'detail-head-balance-log': DetailHeadBalanceLog
    },
    data() {
      return {
      }
    },
    created() {
      documentTitle('团购 - 团长列表');
    },
  }
</script>

<style scoped>

</style>
