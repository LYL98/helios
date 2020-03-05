<template>
  <el-select
    v-model="zoneId" @clear="onClear"
    :clearable="clearable" :size="size"
    :disabled="disabled"
    filterable placeholder="请选择片区"
    style="width: 100%;"
    @change="changeZone">
      <el-option v-if="typeof showAll !== 'undefined'" key="" label="全部" value=""></el-option>
      <el-option
        v-for="item in dataItem"
        :key="item.id"
        :label="item.title"
        :value="item.id">
      </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectZone",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseZoneList();
  },
  props: ['value', 'provinceCode', 'showAll', 'size', 'clearable', 'disabled'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      zoneId: this.value || '',
      dataItem: []
    };
  },
  methods: {
    //片区改变
    changeZone(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);

      let title = ''
      this.dataItem.map(item => {
        if (item.id === v) {
          title = item.title
        }
      });
      this.$emit('changeTitle', title, isInit)
    },
    onClear(v) {
      this.$emit('clear', v)
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
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个片区，默认选择，页面不显示
        if(rd.length === 1){
          that.changeZone(rd[0].id, true);
        }else{
          that.changeZone('', true);
        }
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
        this.$data.zoneId = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
