<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <template v-if="provinceCode !== ''">
      <table-item-display-class :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="TableItemDisplayClass"/>
      <add-edit-item-display-class :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="AddEditItemDisplayClass"/>
    </template>
  </sub-menu>
</template>

<script>
  import TableItemDisplayClass from './TableItemDisplayClass';
  import AddEditItemDisplayClass from './AddEditItemDisplayClass';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: 'Main',
    components: {
      'table-item-display-class': TableItemDisplayClass,
      'add-edit-item-display-class': AddEditItemDisplayClass,
      'global-province': GlobalProvince,
    },
    mixins: [mainMixin],
    created() {
      documentTitle("商品 - 展示分类");
    },
    data(){
      return {
        provinceCode: ''
      }
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('TableItemDisplayClass');
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

