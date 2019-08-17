<template>
  <div>
    <head-list :getPageComponents="viewGetPageComponents" ref="HeadList"></head-list>
    <!--详情-->
    <head-detail :getPageComponents="viewGetPageComponents" ref="HeadDetail"></head-detail>
    <!--新增-->
    <head-edit :getPageComponents="viewGetPageComponents" ref="HeadEdit"></head-edit>
    <detail-head-balance-log :getPageComponents="viewGetPageComponents" ref="DetailHeadBalanceLog"/>
  </div>
</template>

<script>
  import { Dialog } from 'element-ui';
  import HeadList from './HeadList';
  import HeadEdit from './HeadEdit';
  import HeadDetail from './HeadDetail';
  import { DetailHeadBalanceLog } from '@/container';
  export default {
    name: "Head",
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
    methods: {
      //获取当前页面的组件
      getPageComponents(name){
        let com = null;
        const fun = (refs)=>{
          for(let item in refs){
            if(item === name){
              com = refs[name];
            }
            if(refs[item] && refs[item].$refs){
              fun(refs[item].$refs);
            }
          }
        }
        fun(this.$refs);
        return com;
      },
    }
  }
</script>

<style scoped>

</style>
