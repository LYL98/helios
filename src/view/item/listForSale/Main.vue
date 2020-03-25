<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <query-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryItemList" fromPage="ListForSale"/>
    <table-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableItemList" fromPage="ListForSale"/>
    <add-edit-item-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditItemList"/>
    <detail-item-list-edit-record :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="DetailItemListEditRecord"/>
    <form-item-list-edit-inner-tag :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="FormItemListEditInnerTag"/>
  </sub-menu>
</template>

<script>
  import QueryItemList from '@/view/item/list/QueryItemList';
  import TableItemList from '@/view/item/list/TableItemList';
  import AddEditItemList from '@/view/item/list/AddEditItemList';
  import DetailItemListEditRecord from '@/view/item/list/DetailItemListEditRecord';
  import FormItemListEditInnerTag from '@/view/item/list/FormItemListEditInnerTag';
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
      documentTitle("商品 - 待售商品");
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