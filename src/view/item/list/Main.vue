<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <template v-if="provinceCode !== ''">
      <query-item-list :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="QueryItemList"/>
      <table-item-list :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableItemList"/>
      <add-edit-item-list :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="AddEditItemList"/>
      <detail-item-list-edit-record :getPageComponents="viewGetPageComponents" ref="DetailItemListEditRecord"/>
      <form-item-list-edit-inner-tag :getPageComponents="viewGetPageComponents" ref="FormItemListEditInnerTag"/>
    </template>
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
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle("商品 - 在售商品");
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableItemList');
            pc.query.page = 1;
            pc.$data.query = pc.query;
            if(pc) pc.getData(pc.query);
          });
        }else{
          this.$data.provinceCode = data.code;
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>