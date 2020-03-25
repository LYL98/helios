<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <query-item-list :getPageComponents="viewGetPageComponents" ref="QueryItemList"/>
    <table-item-list :getPageComponents="viewGetPageComponents" ref="TableItemList"/>
    <add-edit-item-list :getPageComponents="viewGetPageComponents" ref="AddEditItemList"/>
    <detail-item-list-edit-record :getPageComponents="viewGetPageComponents" ref="DetailItemListEditRecord"/>
    <form-item-list-edit-inner-tag :getPageComponents="viewGetPageComponents" ref="FormItemListEditInnerTag"/>
  </sub-menu>
</template>

<script>
  import QueryItemList from './QueryItemList';
  import TableItemList from './TableItemList';
  import AddEditItemList from './AddEditItemList';
  import DetailItemListEditRecord from './DetailItemListEditRecord';
  import FormItemListEditInnerTag from './FormItemListEditInnerTag';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'query-item-list': QueryItemList,
      'table-item-list': TableItemList,
      'add-edit-item-list': AddEditItemList,
      'detail-item-list-edit-record': DetailItemListEditRecord,
      'form-item-list-edit-inner-tag': FormItemListEditInnerTag,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 在售商品");
    },
    methods: {
      //选择区域后
      selectProvince(data){
        let pc = this.viewGetPageComponents('TableItemList');
        if(pc) pc.initGetData({province_code: data.code});
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>