<template>
  <div style="margin-bottom: 10px;" v-show="dataItem.length > 1">
    <el-radio-group :size="size" v-model="provinceCode" @change="changeProvince">
      <el-radio-button label="">全国</el-radio-button>
      <el-radio-button :label="item.code" v-for="(item, index) in dataItem" :key="index">
        {{item.title}}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { RadioGroup, RadioButton, MessageBox } from 'element-ui';
import { Base } from '@/service';

export default {
  name: "SelectProvinceQuery",
  components: {
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton
  },
  created(){
    this.baseProvinceList();
  },
  props: ['value', 'size'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      dataItem: [],
      provinceCode: this.value || ''
    };
  },
  methods: {
    //省改变
    changeProvince(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有省
    async baseProvinceList(){
      let that = this;
      let res = await Base.baseProvinceList();
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个省，默认选择，页面不显示
        if(rd.length === 1){
          that.changeProvince(rd[0].code, true);
        }
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
  },
  watch:{
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.provinceCode = a || '';
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
