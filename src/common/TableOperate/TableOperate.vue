<template>
  <div :class="`table-operate ${mainDisplayItem.length > 2 && 'is-more'}`">
    <div class="main" v-if="mainDisplayItem.length > 0">
      <a href="javascript:void(0);" @click.prevent="handleCommand(mainDisplayItem[0].command)">{{ mainDisplayItem[0].title }}</a>
      <a href="javascript:void(0);" v-if="mainDisplayItem.length > 1" @click.prevent="handleCommand(mainDisplayItem[1].command)">{{ mainDisplayItem[1].title }}</a>
    </div>
    <div class="sub" :style="`right: ${tableOperateWidth}px`" v-if="subDisplayItem.length > 0">
      <a href="javascript:void(0);"
        v-for="(item, index) in subDisplayItem"
        :key="index"
        @click.prevent="handleCommand(item.command)"
      >{{ item.title }}</a>
    </div>
    <div v-if="mainDisplayItem.length === 0">-</div>
  </div>
</template>

<script>
  export default {
    name: "TableOperate",
    props: {
      trigger: { type: String, default: 'hover' },
      placement: { type: String, default: 'bottom' },
      list: { type: Array, required: true }
    },
    data() {
      return {
        tableOperateWidth: 100
      }
    },
    computed: {
      mainDisplayItem: {
        get() {
          // 判断操作队列中是否有需要显示的项
          let d = this.$props.list.filter(item => item.isDisplay);
          if(d.length > 0) return d;
          return [];
        }
      },
      subDisplayItem: {
        get() {
          // 判断操作队列中是否有需要显示的项
          let d = this.$props.list.filter(item => item.isDisplay);
          if(d.length > 2){
            //删除前两个
            d.shift();
            d.shift();
            return d;
          }
          return [];
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
        let dom = document.querySelector('.table-operate');
        let w = 100;
        if(dom){
          w = dom.clientWidth;
        }
        this.$data.tableOperateWidth = w;
      });
    },
    methods: {
      handleCommand(command) {
        if (this.$props.list.length <= 1) {
          this.$emit('command-click');
        } else {
          this.$data.clickedItem = true;
        }
        command && command();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .table-operate {
    position: relative;
    font-size: 12px;
    &.is-more{
      &::after{
        position: absolute;
        top: 14px;
        right: -2px;
        content: '...';
        font-size: 12px;
        font-weight: bold;
        width: 0;
        display: block;
        word-wrap:break-word;
        line-height: 4px;
        color: #999;
      }
    }
    >.main{
      >a{
        display: block;
        &:hover{
          font-weight: bold;
        }
      }
    }
    >.sub{
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;
      width: auto;
      white-space: nowrap;
      background: #fff;
      display: none;
      align-items: center;
      padding: 10px 15px;
      box-shadow: 0 0 5px rgba($color: #000, $alpha: .1);
      border-radius: 6px;
      >a{
        margin: 0 10px;
        display: inline-block;
        &:hover{
          font-weight: bold;
        }
      }
    }
    &:hover{
      &.is-more{
        &::after{
          display: none;
        }
      }
      >.sub{
        display: flex;
      }
    }
  }
</style>
<style lang="scss">
  .el-table__row:hover {
    td:last-child > .cell{
      overflow: visible;
    }
  }
</style>
