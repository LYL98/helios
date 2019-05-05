<template>
  <el-transfer v-model="cityCodes" :data="dataItem" :filterable="filterable" :titles="['未选县域','已选县域']" @change="changeCity"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Base } from '@/service';

export default {
  name: "SelectCityMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseCityList();
  },
  props: ['value', 'provinceCode', 'filterable'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      cityCodes: this.value || [],
      dataItem: []
    };
  },
  methods: {
    //县市改变
    changeCity(v){
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有县市
    async baseCityList(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Base.baseCityList({
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data, d = [];
        rd.forEach(item => {
          d.push({
            label: item.title,
            key: item.code,
          });
        });
        that.$data.dataItem = d;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
  },
  watch:{
    provinceCode: {
      deep: true,
      handler: function (a, b) {
        // console.log('省份发生变化：', a);
        this.$data.pCode = a || '';
        this.baseCityList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.cityCodes = a || [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
