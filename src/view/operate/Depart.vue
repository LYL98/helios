<template>
  <div>
    <query-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryOperateDepart"/>
    <table-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableOperateDepart"/>
    <detail-operate-depart :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailOperateDepart"/>
    <form-operate-depart-affirm :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormOperateDepartAffirm"/>
  </div>
</template>

<script>
  import { QueryOperateDepart, TableOperateDepart, DetailOperateDepart, FormOperateDepartAffirm, DetailOperateDepartDriverTrack, DetailOperateDepartStockout } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'Depart',
    components: {
      'query-operate-depart': QueryOperateDepart,
      'table-operate-depart': TableOperateDepart,
      'detail-operate-depart': DetailOperateDepart,
      'form-operate-depart-affirm': FormOperateDepartAffirm,
      'detail-operate-depart-driver-track': DetailOperateDepartDriverTrack,
      'detail-operate-depart-stockout': DetailOperateDepartStockout
    },
    mixins: [viewMixin],
    created() {
      documentTitle('场地 - 发车');
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
