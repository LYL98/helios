<template>
  <sub-menu>
    <global-province slot="left-query" type="default" isRequired @change="selectProvince"/>
    <template v-if="provinceCode !== ''">
      <table-view :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="Table"/>
    <add-edit-view :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="AddEdit"/>
    </template>
  </sub-menu>
</template>

<script>
  import Table from './Table';
  import AddEdit from './AddEdit';
  import { GlobalProvince } from '@/component';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "BannerList",
    mixins: [mainMixin],
    components: {
      'table-view': Table,
      'add-edit-view': AddEdit,
      'global-province': GlobalProvince,
    },
    data(){
      return {
        provinceCode: ''
      }
    },
    created: function () {
      documentTitle("业务 - Banner");
    },
    methods: {
      //选择区域后
      selectProvince(data){
        if(this.provinceCode !== ''){
          this.$data.provinceCode = data.code;
          this.$nextTick(()=>{
            let pc = this.viewGetPageComponents('Table');
            if(pc) pc.getData();
          });
        }else{
          this.$data.provinceCode = data.code;
        }
      }
    }
  }
</script>

<style scoped>

</style>
