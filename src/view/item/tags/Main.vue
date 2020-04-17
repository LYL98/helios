<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <template v-if="provinceCode !== ''">
      <table-item-tags :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableItemTags"/>
      <add-edit-item-tags :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="AddEditItemTags"/>
      <detail-item-tags :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="DetailItemTags"/>
      
    </template>
  </sub-menu>
</template>

<script>
  import TableItemTags from './TableItemTags';
  import AddEditItemTags from './AddEditItemTags';
  import Detail from './DetailItemTags'
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'table-item-tags': TableItemTags,
      'add-edit-item-tags': AddEditItemTags,
      'global-province': GlobalProvince,
      'detail-item-tags': Detail,
     
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle("商品 - 商品运营专区");
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableItemTags');
            if(pc) pc.getData();
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

