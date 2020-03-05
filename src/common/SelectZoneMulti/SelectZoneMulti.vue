<template>
  <el-transfer v-model="zoneIds" :data="dataItem" :titles="['未选片区','已选片区']" @change="changeZone"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectZoneMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseZoneList();
  },
  props: ['value', 'provinceCode'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      zoneIds: this.value || [],
      dataItem: []
    };
  },
  methods: {
    //片区改变
    changeZone(v){
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有片区
    async baseZoneList(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Http.get(Config.api.baseZoneList, {
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data, d = [];
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
        this.$data.pCode = a || '';
        this.baseZoneList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.zoneIds = a || [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
