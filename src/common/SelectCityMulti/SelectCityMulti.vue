<template>
  <el-transfer v-model="cityCodes" :data="dataItem" :filterable="filterable" :titles="['未选县域','已选县域']" @change="changeCity"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectCityMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseCityList();
  },
  props: {
    value: { type: String | Number, default: '' },
    provinceCode: { type: String | Number, default: '' },
    filterable: { type: Boolean, default: false },
    forCreateLine: { type: Boolean, default: false },
    connectData: { type: Array, default: null},
    isClearDisabledData: { type: Boolean, default: false}, //是否清除失效的数据
  },
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
      //清除失效数据
      if(this.isClearDisabledData){
        for(let i = 0; i < v.length; i++){
          let con = this.dataItem.filter(item => item.key === v[i]);
          if(con.length === 0){
            v.remove(i);
            i--;
          }
        }
      }
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有县市
    async baseCityList(){
      let that = this;
      let { pCode, connectData } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Http.get(Config.api.baseCityList, {
        province_code: pCode,
        for_create_line: this.forCreateLine ? 1 : 0
      });
      if(res.code === 0){
        let rd = res.data, d = [];
        if(connectData) rd = rd.concat(connectData);
        rd.forEach(item => {
          d.push({
            label: item.title,
            key: item.id,
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
