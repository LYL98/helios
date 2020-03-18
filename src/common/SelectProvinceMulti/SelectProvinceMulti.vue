<template>
  <el-transfer v-model="provinceCodes" :data="dataItem" :titles="['未选区域','已选区域']" @change="changeProvince"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectProvinceMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseProvinceList();
  },
  props: ['value'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      provinceCodes: this.value || [],
      dataItem: []
    };
  },
  methods: {
    //区域改变
    changeProvince(v){
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有区域
    async baseProvinceList(){
      let that = this;
      let res = await Http.get(Config.api.baseProvinceList, {});
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
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.provinceCodes = a || [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
