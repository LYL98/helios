<template>
  <sub-menu>
    <brand :getPageComponents="viewGetPageComponents" ref="Brand"/>
  </sub-menu>
</template>

<script>
import viewMixin from '@/view/view.mixin';
import Brand from './Brand';

export default {
  name: 'Setting',
  mixins: [viewMixin],
  components: {
    'brand': Brand
  },
  created(){
    documentTitle("设置 - 运营配置");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

