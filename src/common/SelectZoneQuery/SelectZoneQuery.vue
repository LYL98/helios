<template>
  <div style="margin-bottom: 10px;">
    <el-radio-group v-model="zoneCode" @change="changeZone" size="mini">
      <el-radio-button label="">全省</el-radio-button>
      <el-radio-button :label="item.code" v-for="(item, index) in dataItem" :key="index">
        {{item.title}}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { RadioGroup, RadioButton, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectZoneQuery",
  components: {
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton
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
      dataItem: [],
      zoneCode: this.value || ''
    };
  },
  methods: {
    //片区改变
    changeZone(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有片区
    async baseZoneList(){
      let that = this;
      let { pCode } = that;
      let res = await Http.get(Config.api.baseZoneList, {
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
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
        this.$data.zoneCode = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .item{
    border-bottom: 1px solid #f3f4f6;
    padding: 10px;
  }
</style>
