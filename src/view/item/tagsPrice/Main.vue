<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <template v-if="provinceCode !== ''">
      <table-item-tags-price :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableItemTagsPrice"/>
      <add-edit-item-tags-price :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="AddEditItemTagsPrice"/>
    </template>
  </sub-menu>
</template>

<script>
  import TableItemTagsPrice from './TableItemTagsPrice';
  import AddEditItemTagsPrice from './AddEditItemTagsPrice';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'table-item-tags-price': TableItemTagsPrice,
      'add-edit-item-tags-price': AddEditItemTagsPrice,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    data(){
      return {
        provinceCode: ''
      }
    },
    created() {
      documentTitle("商品 - 商品价格标签");
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableItemTagsPrice');
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

