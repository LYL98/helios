<template>
    <div>
      <div style="display: flex; width: 100%">
        <div style="flex: 1;">
          <slot name="header"></slot>
        </div>
        <div style="width: 16px">
          <div class="expand"
               v-if="isShowExpandButton"
               @click="onExpandChange">
            <a href="javascript:void(0)" style="color: #73767D;margin-right: 2px">{{isExpand ? '收起' : '展开'}}</a>
            <i class="iconfont expand-icon" v-if="isExpand">&#xe76e;</i>
            <i class="iconfont expand-icon" v-else>&#xe772;</i>
          </div>
        </div>
      </div>
      <div style="display: flex" v-show="isExpand">
        <div style="flex: 1;">
          <slot name="expand"></slot>
        </div>
        <div style="flex: none;width: 16px"></div>
      </div>
    </div>
</template>

<script>

  export default {
    name: "CollapseQuery",
    props: {
      defaultExpand: {type: Boolean, default: false},
      isSubPage: {type: Boolean, default: false},
      isShowExpandButton: {type: Boolean, default: true}
    },
    data() {
      return {
        isExpand: this.defaultExpand
      }
    },
    methods: {
      onExpandChange() {
        this.isExpand = !this.isExpand;
        this.$emit('expandChange', this.isExpand)
      }
    }
  }
</script>

<style scoped>
  .expand{
    width: 50px;
    position: relative;
    z-index: 100;
    left: -34px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .expand-icon{
    width: 14px;
    color: #B0B3BA;
    position: center;
    padding-top: 2px
  }
</style>
