<template>
  <div class="table-operate">
    <div class="main" v-if="mainDisplayItem.length > 0">
      <a href="javascript:void(0);" @click.prevent="handleCommand(mainDisplayItem[0].command)">{{ mainDisplayItem[0].title }}</a>
    </div>
    <div class="sub table-operate-sub" v-if="subDisplayItem.length > 0">
      <a href="javascript:void(0);" :style="`width: ${index === subDisplayItem.length - 1 ? width - 20 + 'px' : 'auto'}`"
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
    }
  }
</script>

<style lang="scss" scoped>
  .table-operate {
    position: relative;
    font-size: 12px;
    >.main{
      text-align: center;
      >a{
        display: block;
        &:hover{
          font-weight: bold;
        }
      }
    }
    >.sub{
      position: absolute;
      right: 0px;
      top: 28px;
      width: auto;
      white-space: nowrap;
      >a{
        margin-left: 10px;
        display: inline-block;
        &:hover{
          font-weight: bold;
        }
        &:last-child{
          text-align: center;
          margin: 0;
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
      display: block;
    }
    td:last-child >.cell{
      overflow: visible;
    }
  }
  
</style>
