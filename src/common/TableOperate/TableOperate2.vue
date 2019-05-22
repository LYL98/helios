<template>
  <div>
    <!-- 如果只有一项操作，则列出单项 -->
    <a class="single-item" v-if="list.length <= 1 && list[0].isDisplay" href="javascript:void(0);" @click.prevent="handleCommand(list[0].command)">{{ list[0].title }}</a>

    <!-- 如果有多项操作，则下拉显示操作菜单 -->
    <el-dropdown
      v-if="list.length > 1 && hasDisplayItem"
      class="my-table-operate"
      :trigger="trigger"
      :placement="placement"
      :show-timeout="50"
      :hide-timeout="50"
      @command="handleCommand"
      @visible-change="handleVisibleChange"
    >
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAADCAYAAACXr/8TAAAAAXNSR0IArs4c6QAAAE9JREFUGBljZACBdc9DGf4zrAKzQQQjw2qGIMkwOJ8MeUaGbZ9FGb5/uQo0RBRq0GsGTh5tBi/e12A+mfJMDD++TEUyFOTabLihIJPJlAcAXZUuzjQGkjIAAAAASUVORK5CYII="
        alt="operate-icon"
      />
      <el-dropdown-menu slot="dropdown" style="margin-top: 0px; margin-left: -5px;">
        <el-dropdown-item
          v-for="(item, index) in list"
          :key="index"
          v-show="item.isDisplay"
          :command="item.command"
        >{{item.title}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {Dropdown, DropdownMenu, DropdownItem} from 'element-ui';

  export default {
    name: "TableOperate",
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem
    },
    props: {
      trigger: { type: String, default: 'hover' },
      placement: { type: String, default: 'bottom' },
      list: { type: Array, required: true }
    },
    computed: {
      hasDisplayItem: {
        get() {
          // 判断操作队列中是否有需要显示的项
          return this.$props.list.some(item => item.isDisplay);
        }
      }
    },
    data() {
      return {
        clickedItem: false
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
      handleVisibleChange(visible) {
        if (!this.$data.clickedItem) {
          this.$emit('command-visible', visible);
        } else {
          this.$emit('command-click');
          this.$data.clickedItem = false;
        }
      }
    }
  }
</script>

<style scoped>
  .single-item {
    font-size: 12px;
    text-decoration: underline;
  }
  .single-item:hover {
    font-weight: 900;
  }
  .my-table-operate {
    cursor: pointer;
  }

  .my-table-operate img {
    padding: 10px;
    margin-left: -10px;
    margin-bottom: -10px;
  }
</style>
