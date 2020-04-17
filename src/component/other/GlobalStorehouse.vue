<template>
  <el-select v-model="selectId" :filterable="filterable" placeholder="请选择仓" :size="size" style="width:100%;">
    <el-option v-for="(item, index) in dataItem" :key="index" :label="item.title" :value="item.id"/>
  </el-select>
</template>

<script>
import Vue from 'vue';
import { Tag, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "GlobalStorehouse",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  props: {
    value: { type: Number | Object, default: null }, //如果 === null,没传值，类型 === String,已传值
    filterable: { type: Boolean, default: false },
    size: { type: String, default: 'small' },
    change: { type: Function },
    initCallBack: { type: Function }
  },
  data() {
    return {
      selectStorehouse: {},
      isShow: false,
      dataItem: []
    };
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  created(){
    this.baseSupStorehouseList();
  },
  computed: {
    selectId: {
      get(){
        if(typeof this.value === 'int') return this.value;
        return this.selectStorehouse.id;
      },
      set(id){
        let con = this.dataItem.filter(item => item.id === id);
        this.changeStorehouse(con[0]);
      }
    },
  },
  methods: {
    //仓改变 (data: {}, type: 'init')
    changeStorehouse(data, type){
      this.$data.selectStorehouse = data;
      this.$emit('ev', data.id); //先v-model
      if(type === 'init'){
        this.$emit('initCallBack', data); //后initCallBack
      }else{
        //全局注册方法
        Vue.use({
          install(Vue){
            //全局仓
            Vue.prototype.$storehouse = data;
          }
        });
        this.$emit('change', data); //后change
      }
    },
    //获取所有仓
    async baseSupStorehouseList(){
      let { isRequired, selectStorehouse } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.baseSupStorehouseList, {});
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
        //如果没有仓
        if(rd.length === 0){
          this.$message({ message: '没有可选的仓', type: 'error' });
          return;
        }
        let p = this.$province;
        let s = this.$storehouse;
        //如果已选择过仓
        if(s && s.id){
          this.changeStorehouse(s, 'init');
        }
        //否则如果选了省
        else if(p && p.id){
          let con = rd.filter(item => item.province_code === p.code);
          if(con.length > 0){
            this.changeStorehouse(con[0], 'init');
          }else{
            this.changeStorehouse(rd[0], 'init');
          }
        }else{
          this.changeStorehouse(rd[0], 'init');
        }
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
