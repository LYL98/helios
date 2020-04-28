<template>
  <!-- 如果只有一项操作，则列出单项 -->
  <div>
    <template v-if="displayItemList.length === 0">-</template>
    <template v-else>
      <a
        class="single-item no-pre"
        v-if="displayItemList.length >= 1"
        href="javascript:void(0);"
        @click.prevent="handleCommand(displayItemList[0].command)"
      >{{ displayItemList[0].title }}</a>
      <a
        class="single-item no-pre"
        v-if="displayItemList.length >= 2"
        href="javascript:void(0);"
        @click.prevent="handleCommand(displayItemList[1].command)"
      >{{ displayItemList[1].title }}</a>

      <!-- 如果有多项操作，则下拉显示操作菜单 -->
      <el-dropdown
        v-if="displayItemList.length > 2"
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
          <template v-for="(item, index) in displayItemList">
            <el-dropdown-item :key="index" :command="item.command" v-if="index > 1">{{item.title}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
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
      //显示的列
      displayItemList: {
        get() {
          // 判断操作队列中是否有需要显示的项
          return this.$props.list.filter(item => item.isDisplay);
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
    margin-right: 10px;
  }
  .single-item:hover {
    font-weight: bold;
  }
  .my-table-operate {
    cursor: pointer;
  }

  .my-table-operate img {
    padding: 10px;
    margin-bottom: -8px;
    width: 16px;
  }
</style>
