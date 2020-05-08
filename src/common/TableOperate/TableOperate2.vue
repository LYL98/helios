<template>
  <div class="table-operate">
    <div class="main table-operate-main" v-if="mainDisplayItem.length > 0">
      <a href="javascript:void(0);" @click.prevent="handleCommand(mainDisplayItem[0].command)">{{ mainDisplayItem[0].title }}</a>
    </div>
    <div class="sub table-operate-sub" :style="`right: ${width - 10}px`" v-if="subDisplayItem.length > 0">
      <a href="javascript:void(0);"
        v-for="(item, index) in subDisplayItem"
        :key="index"
        @click.prevent="handleCommand(item.command)"
      >{{ item.title }}</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TableOperate",
    props: {
      width: { type: String | Number, default: 120},
      trigger: { type: String, default: 'hover' },
      placement: { type: String, default: 'bottom' },
      list: { type: Array, required: true }
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
          if(d.length > 1){
            d.shift(); //删除第一个
            return d;
          }
          return [];
        }
      }
    },
    data() {
      return {
      }
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
    height: 100%;
    >.main{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
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
      padding-left: 10px;
      >a{
        margin: 0 10px;
        display: inline-block;
        &:hover{
          font-weight: bold;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>
<style lang="scss">
  .table-operate-sub{
    display: none;
  }
  .el-table__row:hover {
    .table-operate-sub{
      display: flex;
    }
    .table-operate-main{
      background: #fff;
    }
    td:last-child >.cell{
      overflow: visible;
      background: #fff;
    }
  }
  
</style>
