<!--
  排序指示器
  参数：
  showArrow：是否显示排序箭头
  name：排序项名称
-->
<template>
  <div>
    <a href="javascript:void(0)" @click="changeOrder" style="color: #999;">{{name}}</a>
    <i class="iconfont" v-if="isUp && showArrow" style="width: 12px; color: #ff5252; position: center">&#xe76d;</i>
    <i class="iconfont" v-else-if="showArrow" style="width: 12px; color: #ff5252; position: center">&#xe771;</i>
    <div v-else style="width: 12px; display: inline-block"></div>
  </div>
</template>

<script>
export default {
  name: 'SortingIndicator',
  data: function () {
    return {
      isUp: false
    }
  },
  props: ['showArrow', 'name'],
  methods: {
    changeOrder () {
      this.isUp = this.isUp !== true;
      this.$emit('onChangeOrder', this.isUp)
    }
  }
}
</script>

<style scoped>
  /*如果主项目没加，那么在组件中加入下面的css*/
  /*@font-face {*/
    /*font-family: 'iconfont';  !* project id 789867 *!*/
    /*src: url('//at.alicdn.com/t/font_789867_9gegxrp3tjd.eot');*/
    /*src: url('//at.alicdn.com/t/font_789867_9gegxrp3tjd.eot?#iefix') format('embedded-opentype'),*/
    /*url('//at.alicdn.com/t/font_789867_9gegxrp3tjd.woff') format('woff'),*/
    /*url('//at.alicdn.com/t/font_789867_9gegxrp3tjd.ttf') format('truetype'),*/
    /*url('//at.alicdn.com/t/font_789867_9gegxrp3tjd.svg#iconfont') format('svg');*/
  /*}*/

  /*.iconfont{*/
    /*font-family:"iconfont" !important;*/
    /*font-style:normal;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-webkit-text-stroke-width: 0.2px;*/
    /*-moz-osx-font-smoothing: grayscale;*/
  /*}*/
</style>
