<template>
  <sub-menu>
    <brand :getPageComponents="viewGetPageComponents" ref="Brand"/>
  </sub-menu>
</template>

<script>
import mainMixin from '@/share/mixin/main.mixin';
import Brand from './Brand';

export default {
  name: 'Setting',
  mixins: [mainMixin],
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

