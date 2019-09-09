<template>
  <div :style="{ overflowX: 'auto', height: windowHeight - offsetHeight + 'px', background: '#fff'}">
    <div class="top">
      <div class="setting-item" v-if="auth.isAdmin || auth.SystemSettingOperating">
        <from-systen-setting-operating :getPageComponents="viewGetPageComponents" :windowHeight="windowHeight" ref="FormSystemSettingOperating"/>
      </div>
      <div class="setting-item" v-if="auth.isAdmin || auth.SystemSettingAdvert">
        <from-systen-setting-ad :getPageComponents="viewGetPageComponents" :windowHeight="windowHeight" ref="FormSystemSettingAd"/>
      </div>
    </div>
    <div class="bottom">
      <div class="setting-item" v-if="auth.isAdmin || auth.SystemSettingItemCommonDes">
        <from-systen-setting-item-common-des :getPageComponents="viewGetPageComponents" :windowHeight="windowHeight" ref="FormSystemSettingItemCommonDes"/>
      </div>
    </div>
  </div>
</template>

<script>
import viewMixin from './../view.mixin';
import {mapGetters, mapActions} from "vuex";
import { FormSystemSettingAd, FormSystemSettingOperating, FormSystemSettingItemCommonDes } from '@/container';
import { Constant } from '@/util';

export default {
  name: 'Setting',
  mixins: [viewMixin],
  components: {
    'from-systen-setting-ad': FormSystemSettingAd,
    'from-systen-setting-operating': FormSystemSettingOperating,
    'from-systen-setting-item-common-des': FormSystemSettingItemCommonDes
  },
  created(){
    let that = this;
    documentTitle("设置 - 个性化设置");
  },
  computed: mapGetters({
    auth: 'globalAuth',
    windowHeight: 'windowHeight'
  }),
  data(){
    return{
      offsetHeight: Constant.OFFSET_BASE_HEIGHT,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .top{
    overflow: hidden;
    >.setting-item{
      float: left;
      width: 420px;
      margin-right: 20px;
    }
  }

</style>
