<template>
  <div class="tabs">
    <el-tabs :value="handleValue" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(key, value) in handleTabPanes" :key="key" :label="value" :name="key"></el-tab-pane>
    </el-tabs>    
  </div>
</template>


<script>
  import { Tabs, TabPane } from 'element-ui';
  export default {
    components: {
      'el-tabs': Tabs,
      'el-tab-pane': TabPane
    },
    props: {
      value: { type: String | Number | Boolean, default: '' },
      tabPanes: { type: Object, default: {} },
      type: { type: String, default: 'none' }, //none 普通；route 路由模式
      routePanes: { type: Object, default: null }, //route 路由模式 传
      query: { type: Object, default: null }, //route 路由模式 传
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    
    computed: {
      handleValue(){
        return this.value === '' ? 'my_all' : this.value;
      },
      handleTabPanes(){
        let d = this.tabPanes;
        for(let item in d){
          if(d[item] === '') d[item] = 'my_all';
        }
        return d;
      }
    },
    methods: {
      handleClick(e) {
        let an = e.name === 'my_all' ? '' : e.name;
        let { type, routePanes, value, query } = this;
        if(value === an) return;
        if(type === 'route'){
          this.$router.push({
            name: routePanes[an],
            query: query
          });
        }
        this.$emit('change', an);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs{
    position: absolute;
    top: 16px;
    left: 16px;
    right: 0;
  }
</style>

