<template>
  <div class="tabs">
    <el-tabs :value="value" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(key, value) in tabPanes" :key="key" :label="value" :name="key"></el-tab-pane>
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
      value: [ String, Number, Boolean ],
      tabPanes: { type: Object, default: {} },
      type: { type: String, default: 'none' }, //none 普通；route 路由模式
      routePanes: { type: Object, default: null },
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
    },
    methods: {
      handleClick(e) {
        let { type, tabPanes, routePanes, value } = this;
        if(value === e.name) return;
        if(type === 'route'){
          this.$router.push({
            name: routePanes[e.name]
          });
        }
        this.$emit('change', e.name);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs{
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
  }
</style>

